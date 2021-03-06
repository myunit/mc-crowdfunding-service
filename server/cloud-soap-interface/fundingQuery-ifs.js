/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var util = require('util');
var fundingQueryObj = require('./object/fundingQueryObj');

var FundingQueryIFS = function (app) {
	this.DS = app.datasources.FundingQuerySoap;
	Object.call(this);
};
util.inherits(FundingQueryIFS, Object);
exports = module.exports = FundingQueryIFS;

FundingQueryIFS.prototype.getAllFunding = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getAllFundingXML(data);
	FundingQuery.GetAllCrowdFunding(xml, function (err, response) {
		try {
			callback(err, response.GetAllCrowdFundingResult);
		} catch (e) {
			console.error('FundingQueryIFS getAllFunding Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};

FundingQueryIFS.prototype.getFundingDetail = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getFundingDetailXML(data);
	FundingQuery.GetAllCrowdFunding(xml, function (err, response) {
		try {
			callback(err, response.GetAllCrowdFundingResult);
		} catch (e) {
			console.error('FundingQueryIFS getFundingDetail Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};

FundingQueryIFS.prototype.getFundingProgress = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getFundingProgressXML(data);
	FundingQuery.GetAllCrowdFundingProgress(xml, function (err, response) {
		try {
			callback(err, response.GetAllCrowdFundingProgressResult);
		} catch (e) {
			console.error('FundingQueryIFS getFundingProgress Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};

FundingQueryIFS.prototype.getFundingReserve = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getFundingReserveXML(data);
	FundingQuery.GetAllCrowdFundingReserve(xml, function (err, response) {
		try {
			callback(err, response.GetAllCrowdFundingReserveResult);
		} catch (e) {
			console.error('FundingQueryIFS getFundingReserve Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};

FundingQueryIFS.prototype.getFundingOrder = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getFundingOrderXML(data);
	FundingQuery.GetAllCrowdFundingOrder(xml, function (err, response) {
		try {
			callback(err, response.GetAllCrowdFundingOrderResult);
		} catch (e) {
			console.error('FundingQueryIFS getFundingOrder Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};

FundingQueryIFS.prototype.getHotFunding = function (data, callback) {
	var FundingQuery = this.DS.models.FundingQuery;
	var xml = fundingQueryObj.getHotFundingXML(data);
	FundingQuery.GetAllHotCrowdFunding(xml, function (err, response) {
		try {
			callback(err, response.GetAllHotCrowdFundingResult);
		} catch (e) {
			console.error('FundingQueryIFS getHotFunding Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};