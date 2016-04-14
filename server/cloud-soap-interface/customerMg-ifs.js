/**
 * @author qianqing
 * @create by 16-4-5
 * @description
 */
var util = require('util');
var customerMgObj = require('./object/customerMgObj');

var CustomerMgIFS = function (app) {
	this.DS = app.datasources.CustomerMgSoap;
	Object.call(this);
};
util.inherits(CustomerMgIFS, Object);
exports = module.exports = CustomerMgIFS;

CustomerMgIFS.prototype.setCustomerGroup = function (data, callback) {
	var CustomerMg = this.DS.models.CustomerMg;
	var xml = customerMgObj.setCustomerGroupXML(data);
	CustomerMg.SetCustomerGroup(xml, function (err, response) {
		try {
			callback(err, response.SetCustomerGroupResult);
		} catch (e) {
			console.error('CustomerMgIFS setCustomerGroup Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};