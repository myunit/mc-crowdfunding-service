/**
 * @author qianqing
 * @create by 16-4-5
 * @description
 */
/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
var util = require('util');
var smsObj = require('./object/smsObj');

var SmsIFS = function (app) {
	this.DS = app.datasources.SMSSoap;
	Object.call(this);
};
util.inherits(SmsIFS, Object);
exports = module.exports = SmsIFS;

SmsIFS.prototype.sendMsg = function (data, callback) {
	var Customer = this.DS.models.SMS;
	var xml = smsObj.sendMsgXML(data);
	Customer.SendMsg(xml, function (err, response) {
		try {
			callback(err, response.SendMsgResult);
		} catch (e) {
			console.error('SmsIFS sendMsg Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};