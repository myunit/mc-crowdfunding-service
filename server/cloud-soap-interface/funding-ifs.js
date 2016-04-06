/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var util = require('util');
var fundingObj = require('./object/fundingObj');

var FundingIFS = function (app) {
	this.DS = app.datasources.FundingSoap;
	Object.call(this);
};
util.inherits(FundingIFS, Object);
exports = module.exports = FundingIFS;

FundingIFS.prototype.setCaptcha = function (data, callback) {
	var Funding = this.DS.models.Funding;
	var xml = fundingObj.setCaptchaXML(data);
	Funding.SetCaptcha(xml, function (err, response) {
		try {
			callback(err, response.SetCaptchaResult);
		} catch (e) {
			console.error('CustomerIFS setCaptcha Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};