/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.addFundingOrderXML = function (obj) {
	var xmlObj = [{
		AddCrowdFundingOrder: [
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
										'd4p1:FullName': [
											{
												_attr: {
													'i:nil': 'true'
												}
											}
										]
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
				data: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.ShoppingMgmt.Data',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:CrowFundingSysNo': obj.fundingId
					},
					{
						'd4p1:CustomerNo': obj.userId
					},
					{
						'd4p1:Quantity': obj.quantity
					},
					{
						'd4p1:UnitPrice': obj.price
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.addFundingReserveXML = function (obj) {
	var xmlObj = [{
		AddCrowdFundingReserve: [
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
										'd4p1:FullName': [
											{
												_attr: {
													'i:nil': 'true'
												}
											}
										]
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
				data: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.ShoppingMgmt.Data',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:CrowFundingSysNo': obj.fundingId
					},
					{
						'd4p1:CustomerNo': obj.userId
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};