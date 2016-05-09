/**
 * @author qianqing
 * @create by 16-4-12
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.getDistrictXML = function (obj) {
	var xmlObj = [{
		GetAllDistrictBrand: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			}
		]
	}];

	return xml(xmlObj, true);
};