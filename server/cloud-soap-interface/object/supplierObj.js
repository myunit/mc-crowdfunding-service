/**
 * @author qianqing
 * @create by 16-4-11
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.setShoppingImgXML = function (obj) {
	var imgObj = [];
	imgObj.push({
		_attr: {
			'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.ShoppingMgmt.Data',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});
	var img = null;
	var time = utils.formatByT(new Date());
	for (var i = 0; i < obj.imgUrl.length; i++) {
		img = {
			'd4p1:ShoppingImg': [
				{
					EditDate: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service'
							}
						}, time
					]
				},
				{
					EditUser: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service',
								'i:nil': 'true'
							}
						}
					]
				},
				{
					EditUserSysno: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service'
							}
						}, 0
					]
				},
				{
					InDate: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service'
							}
						}, utils.formatByT(new Date())
					]
				},
				{
					InUser: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service',
								'i:nil': 'true'
							}
						}
					]
				},
				{
					InUserSysno: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service'
							}
						}, 0
					]
				},
				{
					Status: [
						{
							_attr: {
								'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service',
								'i:nil': 'true'
							}
						}
					]
				},
				{
					'd4p1:ImgKey': obj.orderId
				},
				{
					'd4p1:ImgType': obj.imgType
				},
				{
					'd4p1:ImgValue': obj.imgUrl[i]
				}
			]
		};
		imgObj.push(img);
	}
	var xmlObj = [{
		SetShoppingImg: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				message: [
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
				imgs: imgObj
			}
		]
	}];

	return xml(xmlObj, true);
};