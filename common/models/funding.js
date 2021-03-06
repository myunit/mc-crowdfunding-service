/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var loopback = require('loopback');
var async = require('async');
var FundingQueryIFS = require('../../server/cloud-soap-interface/fundingQuery-ifs');
var FundingIFS = require('../../server/cloud-soap-interface/funding-ifs');
var SupplierIFS = require('../../server/cloud-soap-interface/supplier-ifs');
var ImgQueryIFS = require('../../server/cloud-soap-interface/imgQuery-ifs');
var DistrictIFS = require('../../server/cloud-soap-interface/district-ifs');

function toDecimal2(x) {
	var f = parseFloat(x);

	if (isNaN(f)) {
		return;
	}

	f = Math.round(x*100)/100;
	return f;
}
function toDecimalForce2(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return;
	}

	f = Math.round(x*100)/100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

function toDecimal6(x) {
	var f = parseFloat(x);

	if (isNaN(f)) {
		return;
	}

	f = Math.round(x*1000000)/1000000;
	return f;
}

function toDecimal4(x) {
	var f = parseFloat(x);

	if (isNaN(f)) {
		return;
	}

	f = Math.round(x*10000)/10000;
	return f;
}

module.exports = function(Funding) {
	Funding.getApp(function (err, app) {
		if (err) {
			throw err;
		}
		var app_self = app;
		var fundingQueryIFS = new FundingQueryIFS(app);
		var fundingIFS = new FundingIFS(app);
		var imgQueryIFS = new ImgQueryIFS(app);
		var supplierIFS = new SupplierIFS(app);
		var districtIFS = new DistrictIFS(app);

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
					if (count === 0) {
						cb(null, {status: 1, count: count, funding: [], img: []});
						return;
					}

					if (Array.isArray(res.Body.CrowdFunding)) {
						fundingList = res.Body.CrowdFunding;

					} else {
						fundingList.push(res.Body.CrowdFunding);
					}

					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						item.MaxTargetPercent = toDecimal2(item.MaxTargetPercent);
						item.MinBuyQuantity = parseInt(item.MinBuyQuantity);
						item.PerCustomerLimit = parseInt(item.PerCustomerLimit);
						item.PublishStatus = parseInt(item.PublishStatus);
						item.CrowdFundingOrderCount = parseInt(item.CrowdFundingOrderCount);
						item.CrowdFundingType = parseInt(item.CrowdFundingType);
						item.CrowdFundingStatus = parseInt(item.CrowdFundingStatus);
						item.AcitveStatus = parseInt(item.AcitveStatus);
						item.CrowdFundingReserveCount = parseInt(item.CrowdFundingReserveCount);
						item.Quantity = parseInt(item.Quantity);
						item.HaveCrowdFundingCount = parseInt(item.HaveCrowdFundingCount);
						item.HaveCrowdFundingAmount = toDecimalForce2(item.HaveCrowdFundingAmount);
						item.RemiseInterestRate = toDecimal2(item.RemiseInterestRate);
						item.SysNo = parseInt(item.SysNo);
						item.TargetAmount = toDecimal2(item.TargetAmount);
						item.UnitPrice = toDecimal2(item.UnitPrice);
						item.WholesaleGrossProfit = toDecimal2(item.WholesaleGrossProfit*100);
						item.StartDate = item.StartDate.replace('T', ' ');
						item.EndDate = item.EndDate.replace('T', ' ');
						var diff = (new Date(item.EndDate)).getTime() - (new Date()).getTime();
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


						item.CompletePercent = item.HaveCrowdFundingCount === item.Quantity ? 100:toDecimal2((item.HaveCrowdFundingCount/item.Quantity)*100);

						imgQueryIFS.getImg({imgKey: item.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true' && res.Body) {
								callback(null, {SysNo: item.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							} else {
								callback(null, {SysNo: item.SysNo, ImgValue: ''});
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
							'获取众筹 {"userId":int, "pageId":int, "pageSize":int, "fundingStatus":int, "fundingType":int, ',
							'"fundingActive":int, "fundingId":int, "brandName":"string", "districtId":int}, ',
							'fundingStatus:众筹结果状态(-1-全部 0-待结果 10-已成功 11-已失败), fundingActive:众筹进度状态(-1-全部 0-预热 1-进行中 10-已结束), ',
							'fundingType: 众筹类型(1-品牌权益 2-产品 3-单品权益),',
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
					var fundingList = [];
					var count = parseInt(res.TotalCount);

					if (count === 0) {
						cb(null, {status: 1, count: count, funding: [], img: []});
						return;
					}

					if (Array.isArray(res.Body.CrowdFundingProgress)) {
						fundingList = res.Body.CrowdFundingProgress;

					} else {
						fundingList.push(res.Body.CrowdFundingProgress);
					}

					var CrowdFundingType = 0;
					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						item.EditDate = item.EditDate.replace('T', ' ');
						item.InDate = item.InDate.replace('T', ' ');
						item.SysNo = parseInt(item.SysNo);

						var funding = item.CrowdFunding;
						funding.MaxTargetPercent = toDecimal2(funding.MaxTargetPercent);
						funding.MinBuyQuantity = parseInt(funding.MinBuyQuantity);
						funding.PerCustomerLimit = parseInt(funding.PerCustomerLimit);
						funding.PublishStatus = parseInt(funding.PublishStatus);
						funding.CrowdFundingOrderCount = parseInt(funding.CrowdFundingOrderCount);
						funding.CrowdFundingType = parseInt(funding.CrowdFundingType);
						CrowdFundingType = funding.CrowdFundingType;
						funding.CrowdFundingStatus = parseInt(funding.CrowdFundingStatus);
						funding.AcitveStatus = parseInt(funding.AcitveStatus);
						funding.CrowdFundingReserveCount = parseInt(funding.CrowdFundingReserveCount);
						funding.Quantity = parseInt(funding.Quantity);
						funding.HaveCrowdFundingCount = parseInt(funding.HaveCrowdFundingCount);
						funding.HaveCrowdFundingAmount = toDecimalForce2(funding.HaveCrowdFundingAmount);
						funding.RemiseInterestRate = toDecimal2(funding.RemiseInterestRate);
						funding.SysNo = parseInt(funding.SysNo);
						funding.TargetAmount = toDecimal2(funding.TargetAmount);
						funding.UnitPrice = toDecimal2(funding.UnitPrice);
						funding.WholesaleGrossProfit = toDecimal2(funding.WholesaleGrossProfit*100);
						funding.StartDate = funding.StartDate.replace('T', ' ');
						funding.EndDate = funding.EndDate.replace('T', ' ');
						funding.HaveCrowdFundingPercent = toDecimal4(toDecimal6((funding.RemiseInterestRate/funding.Quantity*funding.HaveCrowdFundingCount))*100);
						var diff = (new Date()).getTime() - (new Date(funding.EndDate)).getTime();
						if (diff > 0) {
							diff = diff/(24*3600*1000);
							if (diff < 1) {
								funding.RemainDay = 1;
							} else {
								funding.RemainDay = Math.round(diff);
							}
						} else {
							funding.RemainDay = 0;
						}


						funding.CompletePercent = funding.HaveCrowdFundingCount === funding.Quantity ? 100:toDecimal2((funding.HaveCrowdFundingCount/funding.Quantity)*100);

						imgQueryIFS.getImg({imgKey: item.SysNo, imgType: 8}, function (err, res) {
							if (!err && res.HasError !== 'true' && res.Body) {
								var imgList = [];
								if (Array.isArray(res.Body.ShoppingImg)) {
									for (var i = 0; i < res.Body.ShoppingImg.length; i++) {
										imgList.push(res.Body.ShoppingImg[i].ImgValue);
									}

								} else {
									imgList.push(res.Body.ShoppingImg.ImgValue);
								}

								callback(null, {SysNo: item.SysNo, ImgValue: imgList});
							} else {
								callback(null, {SysNo: item.SysNo, ImgValue: []});
							}
						});
					}, function(err,results) {
						cb(null, {status: 1, count: count, fundingType: CrowdFundingType, funding: fundingList, img: results});
					});
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
					cb(null, {status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('addFundingOrder result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb(null, {status: 0, msg: res.Faults.MessageFault.ErrorDescription.split('。')[1]});
				} else {
					cb(null, {status: 1, orderId: parseInt(res.Body)});
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

		//取消众筹订单
		Funding.cancelFundingOrder = function (data, cb) {
			if (!data.orderId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			fundingIFS.cancelFundingOrder(data, function (err, res) {
				if (err) {
					console.error('cancelFundingOrder err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('cancelFundingOrder result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '取消订单失败'});
				} else {
					cb(null, {status: 1, msg: ''});
				}
			});

		};

		Funding.remoteMethod(
			'cancelFundingOrder',
			{
				description: ['取消众筹订单.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'取消众筹订单 {"orderId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/cancel-funding-order', verb: 'post'}
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
					cb(null, {status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('addFundingReserve result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb(null, {status: 0, msg: (res.Faults.MessageFault.ErrorDescription.split('。')[0]).split(':')[1]});
				} else {
					cb(null, {status: 1, msg: '预约成功'});
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
					var fundingList = [];
					var count = parseInt(res.TotalCount);

					if (count === 0) {
						cb(null, {status: 1, count: count, funding: [], img: []});
						return;
					}

					if (Array.isArray(res.Body.CrowdFundingReserve)) {
						fundingList = res.Body.CrowdFundingReserve;

					} else {
						fundingList.push(res.Body.CrowdFundingReserve);
					}

					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						delete item.Customer;
						var funding = item.CrowdFunding;
						funding.MaxTargetPercent = toDecimal2(funding.MaxTargetPercent);
						funding.MinBuyQuantity = parseInt(funding.MinBuyQuantity);
						funding.PerCustomerLimit = parseInt(funding.PerCustomerLimit);
						funding.PublishStatus = parseInt(funding.PublishStatus);
						funding.CrowdFundingOrderCount = parseInt(funding.CrowdFundingOrderCount);
						funding.CrowdFundingType = parseInt(funding.CrowdFundingType);
						funding.CrowdFundingStatus = parseInt(funding.CrowdFundingStatus);
						funding.AcitveStatus = parseInt(funding.AcitveStatus);
						funding.CrowdFundingReserveCount = parseInt(funding.CrowdFundingReserveCount);
						funding.Quantity = parseInt(funding.Quantity);
						funding.HaveCrowdFundingCount = parseInt(funding.HaveCrowdFundingCount);
						funding.HaveCrowdFundingAmount = toDecimalForce2(funding.HaveCrowdFundingAmount);
						funding.RemiseInterestRate = toDecimal2(funding.RemiseInterestRate);
						funding.SysNo = parseInt(funding.SysNo);
						funding.TargetAmount = toDecimal2(funding.TargetAmount);
						funding.UnitPrice = toDecimal2(funding.UnitPrice);
						funding.WholesaleGrossProfit = toDecimal2(funding.WholesaleGrossProfit*100);
						funding.StartDate = funding.StartDate.replace('T', ' ');
						funding.EndDate = funding.EndDate.replace('T', ' ');
						var diff = (new Date()).getTime() - (new Date(funding.EndDate)).getTime();
						if (diff > 0) {
							diff = diff/(24*3600*1000);
							if (diff < 1) {
								funding.RemainDay = 1;
							} else {
								funding.RemainDay = Math.round(diff);
							}
						} else {
							funding.RemainDay = 0;
						}


						funding.CompletePercent = funding.HaveCrowdFundingCount === funding.Quantity ? 100:toDecimal2((funding.HaveCrowdFundingCount/funding.Quantity)*100);

						imgQueryIFS.getImg({imgKey: funding.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true' && res.Body) {
								callback(null, {SysNo: funding.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							} else {
								callback(null, {SysNo: funding.SysNo, ImgValue: ''});
							}
						});
					}, function(err,results) {
						cb(null, {status: 1, count: count, funding: fundingList, img: results});
					});
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
							'获取众筹预约 {"userId":int, "pageId":int, "pageSize":int, "publish":int, "fundingId":int, "reserveId":int}'
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
					var fundingList = [];
					var count = parseInt(res.TotalCount);

					if (count === 0) {
						cb(null, {status: 1, count: count, funding: [], img: []});
						return;
					}

					if (Array.isArray(res.Body.CrowdFundingOrder)) {
						fundingList = res.Body.CrowdFundingOrder;

					} else {
						fundingList.push(res.Body.CrowdFundingOrder);
					}

					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						delete item.Customer;
						item.OrderStatus = parseInt(item.OrderStatus);
						item.PaymentStatus = parseInt(item.PaymentStatus);
						item.ReturnStatus = parseInt(item.ReturnStatus);
						item.StatusTip = '';
						if (item.ReturnStatus === 1) {
							item.StatusTip = '已退款';
						} else if (item.OrderStatus === 11 && item.ReturnStatus === 0) {
							item.StatusTip = '已取消';
						}  else if (item.PaymentStatus === 1) {
							item.StatusTip = '已支付';
						} else if (item.OrderStatus === 0) {
							item.StatusTip = '待支付';
						} else if (item.OrderStatus === 1) {
							item.StatusTip = '审核中';
						}

						item.Quantity = parseInt(item.Quantity);
						item.SysNo = parseInt(item.SysNo);
						item.TotalAmount = toDecimal2(item.TotalAmount);
						item.UnitPrice = toDecimal2(item.UnitPrice);
						item.InDate = item.InDate.replace('T', ' ');
						var funding = item.CrowdFunding;
						funding.MaxTargetPercent = toDecimal2(funding.MaxTargetPercent);
						funding.MinBuyQuantity = parseInt(funding.MinBuyQuantity);
						funding.PerCustomerLimit = parseInt(funding.PerCustomerLimit);
						funding.PublishStatus = parseInt(funding.PublishStatus);
						funding.CrowdFundingOrderCount = parseInt(funding.CrowdFundingOrderCount);
						funding.CrowdFundingType = parseInt(funding.CrowdFundingType);
						funding.CrowdFundingStatus = parseInt(funding.CrowdFundingStatus);
						funding.AcitveStatus = parseInt(funding.AcitveStatus);
						funding.CrowdFundingReserveCount = parseInt(funding.CrowdFundingReserveCount);
						funding.Quantity = parseInt(funding.Quantity);
						funding.HaveCrowdFundingCount = parseInt(funding.HaveCrowdFundingCount);
						funding.HaveCrowdFundingAmount = toDecimalForce2(funding.HaveCrowdFundingAmount);
						funding.RemiseInterestRate = toDecimal2(funding.RemiseInterestRate);
						funding.SysNo = parseInt(funding.SysNo);
						funding.TargetAmount = toDecimal2(funding.TargetAmount);
						funding.UnitPrice = toDecimal2(funding.UnitPrice);
						funding.WholesaleGrossProfit = toDecimal2(funding.WholesaleGrossProfit*100);
						funding.StartDate = funding.StartDate.replace('T', ' ');
						funding.EndDate = funding.EndDate.replace('T', ' ');
						funding.HaveCrowdFundingPercent = toDecimal4(toDecimal6((funding.RemiseInterestRate/funding.Quantity*funding.HaveCrowdFundingCount))*100);
						item.BuyPercent = toDecimal4(toDecimal6((funding.RemiseInterestRate/funding.Quantity))*100*item.Quantity);
						var diff = (new Date()).getTime() - (new Date(funding.EndDate)).getTime();
						if (diff > 0) {
							diff = diff/(24*3600*1000);
							if (diff < 1) {
								funding.RemainDay = 1;
							} else {
								funding.RemainDay = Math.round(diff);
							}
						} else {
							funding.RemainDay = 0;
						}


						funding.CompletePercent = funding.HaveCrowdFundingCount === funding.Quantity ? 100:toDecimal2((funding.HaveCrowdFundingCount/funding.Quantity)*100);
						imgQueryIFS.getImg({imgKey: funding.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true' && res.Body) {
								callback(null, {SysNo: funding.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							} else {
								callback(null, {SysNo: funding.SysNo, ImgValue: ''});
							}
						});
					}, function(err,results) {
						cb(null, {status: 1, count: count, funding: fundingList, img: results});
					});
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
							'获取众筹订单 {"userId":int, "pageId":int, "pageSize":int, "fundingStatus":int, "fundingType":int,',
							' "fundingActive":int, "orderStatus":int, "payStatus":int, "returnStatus":int, "orderId":int}'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-funding-order', verb: 'post'}
			}
		);

		//完成支付
		Funding.finishPayFunding = function (data, callback) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			async.waterfall(
				[
					function (cb) {
						fundingIFS.finishPayFunding(data, function (err, res) {
							if (err) {
								console.error('finishPayFunding err: ' + err);
								cb({status: 0, msg: '操作异常'});
								return;
							}

							if (res.HasError === 'true') {
								console.error('finishPayFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
								cb({status: 0, msg: '提交支付失败'});
							} else {
								cb(null, {status: 1, msg: ''});
							}
						});
					},
					function (captcha, cb) {
						var obj = {
							userId: data.userId,
							orderId: data.orderId,
							imgType: 9,
							imgUrl: data.imgUrl
						};
						supplierIFS.setShoppingImg(obj, function (err, res) {
							if (err) {
								console.error('setShoppingImg err: ' + err);
								cb({status: 0, msg: '操作异常'});
								return;
							}

							if (res.HasError === 'true') {
								console.error('setShoppingImg result err: ' + res.Faults.MessageFault.ErrorDescription);
								cb({status: 0, msg: '提交支付失败'});
							} else {
								cb(null, {status: 1, msg: ''});
							}
						});
					}
				],
				function (err, msg) {
					if (err) {
						callback(null, err);
					} else {
						callback(null, msg);
					}
				}
			);

		};

		Funding.remoteMethod(
			'finishPayFunding',
			{
				description: ['完成支付.返回结果-status:操作结果 0 成功 -1 失败, res:支付结果, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'完成支付 {"userId":int, "orderId":int, "imgUrl":"string"}'
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

					if (count === 0) {
						cb(null, {status: 1, count: count, funding: [], img: []});
						return;
					}

					if (Array.isArray(res.Body.CrowdFunding)) {
						fundingList = res.Body.CrowdFunding;

					} else {
						fundingList.push(res.Body.CrowdFunding);
					}

					async.map(fundingList, function(item, callback) {
						//console.log('item: ' + JSON.stringify(item));
						item.MaxTargetPercent = toDecimal2(item.MaxTargetPercent);
						item.MinBuyQuantity = parseInt(item.MinBuyQuantity);
						item.PerCustomerLimit = parseInt(item.PerCustomerLimit);
						item.PublishStatus = parseInt(item.PublishStatus);
						item.CrowdFundingOrderCount = parseInt(item.CrowdFundingOrderCount);
						item.CrowdFundingType = parseInt(item.CrowdFundingType);
						item.CrowdFundingStatus = parseInt(item.CrowdFundingStatus);
						item.AcitveStatus = parseInt(item.AcitveStatus);
						item.CrowdFundingReserveCount = parseInt(item.CrowdFundingReserveCount);
						item.Quantity = parseInt(item.Quantity);
						item.HaveCrowdFundingCount = parseInt(item.HaveCrowdFundingCount);
						item.HaveCrowdFundingAmount = toDecimalForce2(item.HaveCrowdFundingAmount);
						item.RemiseInterestRate = toDecimal2(item.RemiseInterestRate);
						item.SysNo = parseInt(item.SysNo);
						item.TargetAmount = toDecimal2(item.TargetAmount);
						item.UnitPrice = toDecimal2(item.UnitPrice);
						item.WholesaleGrossProfit = toDecimal2(item.WholesaleGrossProfit*100);
						item.StartDate = item.StartDate.replace('T', ' ');
						item.EndDate = item.EndDate.replace('T', ' ');
						var diff = (new Date(item.EndDate)).getTime() - (new Date()).getTime();
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


						item.CompletePercent = item.HaveCrowdFundingCount === item.Quantity ? 100:toDecimal2((item.HaveCrowdFundingCount/item.Quantity)*100);

						imgQueryIFS.getImg({imgKey: item.SysNo, imgType: 0}, function (err, res) {
							if (!err && res.HasError !== 'true' && res.Body) {
								callback(null, {SysNo: item.SysNo, ImgValue: res.Body.ShoppingImg.ImgValue});
							} else {
								callback(null, {SysNo: item.SysNo, ImgValue: ''});
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
							'fundingType: 众筹类型(1-品牌权益 2-产品 3-单品权益)'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-hot-funding', verb: 'post'}
			}
		);

		//获取众筹详情
		Funding.getFundingDetail = function (data, cb) {
			if (!data.userId) {
				cb(null, {status: 0, msg: '参数错误'});
				return;
			}

			data.pageId = 0;
			data.pageSize = 1;
			data.fundingStatus = [0,1,10,11];
			data.fundingType = [1,2,3];
			data.fundingActive = [0,1,10];
			fundingQueryIFS.getFundingDetail(data, function (err, res) {
				if (err) {
					console.error('getAllFunding err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getAllFunding result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '生成验证码失败'});
				} else {
					var item = {};
					var count = parseInt(res.TotalCount);

					if (count === 1) {
						item = res.Body.CrowdFunding;
						//console.log('item: ' + JSON.stringify(item));
						item.MaxTargetPercent = toDecimal2(item.MaxTargetPercent);
						item.MinBuyQuantity = parseInt(item.MinBuyQuantity);
						item.PerCustomerLimit = parseInt(item.PerCustomerLimit);
						item.PublishStatus = parseInt(item.PublishStatus);
						item.CrowdFundingOrderCount = parseInt(item.CrowdFundingOrderCount);
						item.CrowdFundingType = parseInt(item.CrowdFundingType);
						item.CrowdFundingStatus = parseInt(item.CrowdFundingStatus);
						item.AcitveStatus = parseInt(item.AcitveStatus);
						item.CrowdFundingReserveCount = parseInt(item.CrowdFundingReserveCount);
						item.Quantity = parseInt(item.Quantity);
						item.HaveCrowdFundingCount = parseInt(item.HaveCrowdFundingCount);
						item.HaveCrowdFundingAmount = toDecimalForce2(item.HaveCrowdFundingAmount);
						item.RemiseInterestRate = toDecimal2(item.RemiseInterestRate);
						item.SysNo = parseInt(item.SysNo);
						item.TargetAmount = toDecimal2(item.TargetAmount);
						item.UnitPrice = toDecimal2(item.UnitPrice);
						item.WholesaleGrossProfit = toDecimal2(item.WholesaleGrossProfit*100);
						item.StartDate = item.StartDate.replace('T', ' ');
						item.EndDate = item.EndDate.replace('T', ' ');
						item.UnitPercent = toDecimal4(toDecimal6((item.RemiseInterestRate/item.Quantity))*100);
						item.HaveCrowdFundingPercent = toDecimal4(toDecimal6((item.RemiseInterestRate/item.Quantity*item.HaveCrowdFundingCount))*100);
						var diff = (new Date(item.EndDate)).getTime() - (new Date()).getTime();
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


						item.CompletePercent = item.HaveCrowdFundingCount === item.Quantity ? 100:toDecimal2((item.HaveCrowdFundingCount/item.Quantity)*100);

						var imgTypes = null;
						if (item.CrowdFundingType === 2){
							imgTypes = [0,1,2,3,5,7];
						} else {
							imgTypes = [0,1,2,3,4,5,6,7];
						}
						async.map(imgTypes, function(type, callback) {
							imgQueryIFS.getImg({imgKey: item.SysNo, imgType: type}, function (err, res) {
								if (!err && res.HasError !== 'true' && res.Body) {
									var imgList = [];
									if (Array.isArray(res.Body.ShoppingImg)) {
										for (var i = 0; i < res.Body.ShoppingImg.length; i++) {
											imgList.push(res.Body.ShoppingImg[i].ImgValue);
										}

									} else {
										imgList.push(res.Body.ShoppingImg.ImgValue);
									}

									callback(null, {type: type, ImgValue: imgList});
								} else {
									callback(null, {type: type, ImgValue: []});
								}
							});
						}, function(err,results) {
							cb(null, {status: 1, count: count, funding: item, img: results});
						});
					} else {
						cb(null, {status: 1, count: count, funding: item, img: []});
					}
				}
			});

		};

		Funding.remoteMethod(
			'getFundingDetail',
			{
				description: ['获取众筹详情.返回结果-status:操作结果 0 成功 -1 失败, funding:众筹信息, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取众筹详情 {"userId":int, "fundingId":int }'
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-funding-detail', verb: 'post'}
			}
		);

		//获取品牌区域
		Funding.getDistrict = function (data, cb) {
			districtIFS.getDistrict(data, function (err, res) {
				if (err) {
					console.error('getDistrict err: ' + err);
					cb({status: 0, msg: '操作异常'});
					return;
				}

				if (res.HasError === 'true') {
					console.error('getDistrict result err: ' + res.Faults.MessageFault.ErrorDescription);
					cb({status: 0, msg: '获取品牌区域失败'});
				} else {
					var districtList = [];
					var count = parseInt(res.TotalCount);

					if (Array.isArray(res.Body.DistrictBrand)) {
						async.map(res.Body.DistrictBrand, function(item, callback) {
							districtList.push({districtId: parseInt(item.SysNo), districtName: item.DistrictBrandName.substring(0,2)});
							callback(null);
						}, function(err,results) {
							cb(null, {status: 1, count: count, district: districtList});
						});
					} else {
						districtList.push({districtId: parseInt(res.Body.DistrictBrand.SysNo), districtName: res.Body.DistrictBrand.DistrictBrandName.substring(0,2)});
						cb(null, {status: 1, count: count, district: districtList});

					}

				}
			});

		};

		Funding.remoteMethod(
			'getDistrict',
			{
				description: ['获取品牌区域.返回结果-status:操作结果 0 成功 -1 失败, district:品牌区域, msg:附带信息'],
				accepts: [
					{
						arg: 'data', type: 'object', required: true, http: {source: 'body'},
						description: [
							'获取品牌区域 {} '
						]
					}
				],
				returns: {arg: 'repData', type: 'string'},
				http: {path: '/get-district', verb: 'post'}
			}
		);

	});
};
