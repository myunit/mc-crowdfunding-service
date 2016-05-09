/**
 * @author qianqing
 * @create by 16-4-12
 * @description
 */
var util = require('util');
var customerQueryObj = require('./object/customerQueryObj');

var CustomerQueryIFS = function (app) {
	this.DS = app.datasources.CustomerQuerySoap;
	Object.call(this);
};
util.inherits(CustomerQueryIFS, Object);
exports = module.exports = CustomerQueryIFS;

CustomerQueryIFS.prototype.isReg = function (data, callback) {
	var CustomerQuery = this.DS.models.CustomerQuery;
	var xml = customerQueryObj.isRegXML(data);
	CustomerQuery.GetCustomers(xml, function (err, response) {
		try {
			callback(err, response.GetCustomersResult);
		} catch (e) {
			console.error('CustomerQueryIFS isReg Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};