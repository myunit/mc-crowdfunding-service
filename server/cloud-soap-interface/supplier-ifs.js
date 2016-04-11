/**
 * @author qianqing
 * @create by 16-4-11
 * @description
 */
var util = require('util');
var supplierObj = require('./object/supplierObj');

var SupplierIFS = function (app) {
	this.DS = app.datasources.SupplierSoap;
	Object.call(this);
};
util.inherits(SupplierIFS, Object);
exports = module.exports = SupplierIFS;

SupplierIFS.prototype.setShoppingImg = function (data, callback) {
	var Supplier = this.DS.models.Supplier;
	var xml = supplierObj.setShoppingImgXML(data);
	Supplier.SetShoppingImg(xml, function (err, response) {
		try {
			callback(err, response.SetShoppingImgResult);
		} catch (e) {
			console.error('SupplierIFS setShoppingImg Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};