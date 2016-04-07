/**
 * @author qianqing
 * @create by 16-4-7
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.getImgXML = function (obj) {
	var xmlObj = [{
		GetShoppingImgBySysNo: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				SysNo: obj.imgId
			}
		]
	}];

	return xml(xmlObj, true);
};