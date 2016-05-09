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
var xml = require('xml');
var utils = require('../../util/utils');

exports.setCustomerGroupXML = function (obj) {
	var user = [];
	user.push({
		_attr: {
			'xmlns:d4p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	user.push({'d4p1:int': obj.userId});

	var xmlObj = [{
		SetCustomerGroup: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				message:  [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:Header': [
							{
								'd4p1:OperationUser': [
									{
										'd4p1:FullName': 'mc'
									},
									{
										'd4p1:UserSysNo': obj.userId
									}
								]
							},
							{
								'd4p1:Sender': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							}
						]
					}
				]
			},
			{
				customerSysNos: user
			},
			{
				groupSysNo: obj.groupId
			}
		]
	}];

	return xml(xmlObj, true);
};