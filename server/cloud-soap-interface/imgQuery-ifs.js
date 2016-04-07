/**
 * @author qianqing
 * @create by 16-4-7
 * @description
 */
var util = require('util');
var imgQueryObj = require('./object/imgQueryObj');

var ImgQueryIFS = function (app) {
	this.DS = app.datasources.ImgQuerySoap;
	Object.call(this);
};
util.inherits(ImgQueryIFS, Object);
exports = module.exports = ImgQueryIFS;

ImgQueryIFS.prototype.getImg = function (data, callback) {
	var ImgQuery = this.DS.models.ImgQuery;
	var xml = imgQueryObj.getImgXML(data);
	ImgQuery.GetShoppingImgBySysNo(xml, function (err, response) {
		try {
			callback(err, response.GetShoppingImgBySysNoResult);
		} catch (e) {
			console.error('ImgQueryIFS getImg Exception: ' + e);
			callback(err, {HasError: 'false', Faults:'服务异常'});
		}
	});
};