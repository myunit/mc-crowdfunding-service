/**
 * @author qianqing
 * @create by 16-4-7
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.getImgXML = function (obj) {
	var xmlObj = [{
		GetShoppingImgByImgTypeAndImgKey: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				ImgType: obj.imgType
			},
			{
				ImgKey: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:string': obj.imgKey
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};