/**
 * @author qianqing
 * @create by 16-4-12
 * @description
 */
var util = require('util');
var districtObj = require('./object/districtObj');

var DistrictIFS = function (app) {
	this.DS = app.datasources.DistrictQuerySoap;
	Object.call(this);
};
util.inherits(DistrictIFS, Object);
exports = module.exports = DistrictIFS;

DistrictIFS.prototype.getDistrict = function (data, callback) {
	var DistrictQuery = this.DS.models.DistrictQuery;
	var xml = districtObj.getDistrictXML(data);
	DistrictQuery.GetAllDistrictBrand(xml, function (err, response) {
		try {
			callback(err, response.GetAllDistrictBrandResult);
		} catch (e) {
			console.error('DistrictIFS getDistrict Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};