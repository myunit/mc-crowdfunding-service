/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var loopback = require('loopback');
var async = require('async');
var FundingQueryIFS = require('../../server/cloud-soap-interface/fundingQuery-ifs');
var FundingIFS = require('../../server/cloud-soap-interface/funding-ifs');
var ImgQueryIFS = require('../../server/cloud-soap-interface/imgQuery-ifs');

module.exports = function(Funding) {
	Funding.getApp(function (err, app) {
		if (err) {
			throw err;
		}
		var app_self = app;
		var fundingQueryIFS = new FundingQueryIFS(app);
		var fundingIFS = new FundingIFS(app);
		var imgQueryIFS = new ImgQueryIFS(app);

		//获取众筹
		Funding.getAllFunding = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingQueryIFS.getAllFunding(data, function (err, res) {
				if (err) {
					console.error('getAllFunding err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getAllFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					var fundingList = [];
					var count = parseInt(res.TotalCount);

					if (count === 1) {
						fundingList.push(res.Body.CrowdFunding);
					} else if (count > 1){
						fundingList = res.Body.CrowdFunding;
					}

					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						item.MaxTargetPercent = parseFloat(item.MaxTargetPercent);
						item.MinBuyQuantity = parseInt(item.MinBuyQuantity);
						item.PerCustomerLimit = parseInt(item.PerCustomerLimit);
						item.PublishStatus = parseInt(item.PublishStatus);
						item.CrowdFundingOrderCount = parseInt(item.CrowdFundingOrderCount);
						item.CrowdFundingType = parseInt(item.CrowdFundingType);
						item.CrowdFundingStatus = parseInt(item.CrowdFundingStatus);
						item.CrowdFundingReserveCount = parseInt(item.CrowdFundingReserveCount);
						item.Quantity = parseInt(item.Quantity);
						item.HaveCrowdFundingCount = parseInt(item.HaveCrowdFundingCount);
						item.HaveCrowdFundingAmount = parseFloat(item.HaveCrowdFundingAmount);
						item.RemiseInterestRate = parseFloat(item.RemiseInterestRate);
						item.SysNo = parseInt(item.SysNo);
						item.TargetAmount = parseFloat(item.TargetAmount);
						item.UnitPrice = parseFloat(item.UnitPrice);
						item.WholesaleGrossProfit = parseFloat(item.WholesaleGrossProfit);
						item.StartDate = item.StartDate.replace('T', ' ');
						item.EndDate = item.EndDate.replace('T', ' ');
						var diff = (new Date()).getTime() - (new Date(item.EndDate)).getTime();
						if (diff > 0) {
							diff = diff/(24*3600*1000);
							if (diff < 1) {
								item.RemainDay = 1;
							} else {
								item.RemainDay = Math.round(diff);
							}
						} else {
							item.RemainDay = 0;
						}


						item.CompletePercent = parseInt((item.HaveCrowdFundingCount/item.Quantity)*100);
						if (!item.RemainDay || item.HaveCrowdFundingCount === item.Quantity) {
							item.IsEnd = true;
						} else {
							item.IsEnd = false;
						}


						imgQueryIFS.getImg({imgKey: item.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true') {
								callback(null, {SysNo: item.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							}
						});
					}, function(err,results) {
						cb(null, {status: 1, count: count, funding: fundingList, img: results});
					});
				}
			});

		};

		Funding.remoteMethod(
			'getAllFunding',
			{
				description: ['获取众筹.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹 {"userId":int, "pageId":int, "pageSize":int, "fundingStatus":int, "fundingType":int',
							', "fundingId":int, "brandName":"string"}, ',
							'fundingStatus:众筹状态(-1-全部 0-预热 1-进行中 10-已结束), fundingType: 众筹类型(1-品牌 2-产品 3-权益),',
							' fundingId:众筹编号, brandName: 品牌名称'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-all-funding', verb: 'post'}
			}
		);

		//获取众筹进度
		Funding.getFundingProgress = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingQueryIFS.getFundingProgress(data, function (err, res) {
				if (err) {
					console.error('getFundingProgress err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getAllFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, count: res.TotalCount, funding: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'getFundingProgress',
			{
				description: ['获取众筹进度.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹进度 {"userId":int, "pageId":int, "pageSize":int, "fundingId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-funding-progress', verb: 'post'}
			}
		);

		//添加众筹订单
		Funding.addFundingOrder = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingIFS.addFundingOrder(data, function (err, res) {
				if (err) {
					console.error('addFundingOrder err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('addFundingOrder result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, funding: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'addFundingOrder',
			{
				description: ['添加众筹订单.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'添加众筹订单 {"userId":int, "fundingId":int, "quantity":int, "price":float}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/add-funding-order', verb: 'post'}
			}
		);

		//添加众筹预约
		Funding.addFundingReserve = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingIFS.addFundingReserve(data, function (err, res) {
				if (err) {
					console.error('addFundingReserve err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('addFundingReserve result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, funding: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'addFundingReserve',
			{
				description: ['添加众筹预约.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'添加众筹预约 {"userId":int, "fundingId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/add-funding-reserve', verb: 'post'}
			}
		);

		//获取众筹预约
		Funding.getFundingReserve = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingQueryIFS.getFundingReserve(data, function (err, res) {
				if (err) {
					console.error('getFundingReserve err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getFundingReserve result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, reserve: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'getFundingReserve',
			{
				description: ['获取众筹预约.返回结果-status:操作结果 0 成功 -1 失败, reserve:预约, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹预约 {"userId":int, "pageId":int, "pageSize":int, "fundingId":int, "reserveId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-funding-reserve', verb: 'post'}
			}
		);

		//获取众筹订单
		Funding.getFundingOrder = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingQueryIFS.getFundingOrder(data, function (err, res) {
				if (err) {
					console.error('getFundingOrder err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getFundingOrder result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, orders: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'getFundingOrder',
			{
				description: ['获取众筹订单.返回结果-status:操作结果 0 成功 -1 失败, orders:订单, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹订单 {"userId":int, "pageId":int, "pageSize":int, "fundingId":int, "orderId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-funding-order', verb: 'post'}
			}
		);

		//完成支付
		Funding.finishPayFunding = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingIFS.finishPayFunding(data, function (err, res) {
				if (err) {
					console.error('finishPayFunding err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('finishPayFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					cb(null, {status: 1, res: res.Body});
				}
			});

		};

		Funding.remoteMethod(
			'finishPayFunding',
			{
				description: ['获取众筹预约.返回结果-status:操作结果 0 成功 -1 失败, res:支付结果, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹预约 {"userId":int, "fundingId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/finish-pay-funding', verb: 'post'}
			}
		);

		//获取热门众筹
		Funding.getHotFunding = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingQueryIFS.getHotFunding(data, function (err, res) {
				if (err) {
					console.error('getHotFunding err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getHotFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					var fundingList = [];
					var count = parseInt(res.TotalCount);

					if (count === 1) {
						fundingList.push(res.Body.CrowdFunding);
					} else if (count > 1){
						fundingList = res.Body.CrowdFunding;
					}
					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						item.MaxTargetPercent = parseFloat(item.MaxTargetPercent);
						item.MinBuyQuantity = parseInt(item.MinBuyQuantity);
						item.PerCustomerLimit = parseInt(item.PerCustomerLimit);
						item.PublishStatus = parseInt(item.PublishStatus);
						item.CrowdFundingOrderCount = parseInt(item.CrowdFundingOrderCount);
						item.CrowdFundingType = parseInt(item.CrowdFundingType);
						item.CrowdFundingStatus = parseInt(item.CrowdFundingStatus);
						item.CrowdFundingReserveCount = parseInt(item.CrowdFundingReserveCount);
						item.Quantity = parseInt(item.Quantity);
						item.HaveCrowdFundingCount = parseInt(item.HaveCrowdFundingCount);
						item.HaveCrowdFundingAmount = parseFloat(item.HaveCrowdFundingAmount);
						item.RemiseInterestRate = parseFloat(item.RemiseInterestRate);
						item.SysNo = parseInt(item.SysNo);
						item.TargetAmount = parseFloat(item.TargetAmount);
						item.UnitPrice = parseFloat(item.UnitPrice);
						item.WholesaleGrossProfit = parseFloat(item.WholesaleGrossProfit);
						item.StartDate = item.StartDate.replace('T', ' ');
						item.EndDate = item.EndDate.replace('T', ' ');
						var diff = (new Date()).getTime() - (new Date(item.EndDate)).getTime();
						if (diff > 0) {
							diff = diff/(24*3600*1000);
							if (diff < 1) {
								item.RemainDay = 1;
							} else {
								item.RemainDay = Math.round(diff);
							}
						} else {
							item.RemainDay = 0;
						}


						item.CompletePercent = parseInt((item.HaveCrowdFundingCount/item.Quantity)*100);
						if (!item.RemainDay || item.HaveCrowdFundingCount === item.Quantity) {
							item.IsEnd = true;
						} else {
							item.IsEnd = false;
						}

						imgQueryIFS.getImg({imgKey: item.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true') {
								callback(null, {SysNo: item.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							}
						});
					}, function(err,results) {
						cb(null, {status: 1, count: count, funding: fundingList, img: results});
					});

				}
			});

		};

		Funding.remoteMethod(
			'getHotFunding',
			{
				description: ['获取热门众筹.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取热门众筹 {"userId":int, "pageId":int, "pageSize":int, "fundingType":int} ',
							'fundingType: 众筹类型(1-品牌 2-产品 3-权益)'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-hot-funding', verb: 'post'}
			}
		);

	});
};
