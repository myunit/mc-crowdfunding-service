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

exports.saveStoreXML = function (obj) {
	var xmlObj = [{
		SaveCustomerStore: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				registerInfo: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.CustomerMgmt.Data',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:BirthDay': utils.formatByT(new Date())
					},
					{
						'd4p1:CellPhone': obj.phone
					},
					{
						'd4p1:CompanyCreator': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:CompanySysNo': 0
					},
					{
						'd4p1:CompanyToken': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:ContactCellPhoneNo': obj.phone
					},
					{
						'd4p1:ContactAddress': obj.address
					},
					{
						'd4p1:CustomerFrom': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:CustomerIDNo': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:CustomerLevel': 0
					},
					{
						'd4p1:CustomerSource': 1
					},
					{
						'd4p1:CustomerStore': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:CustomerType': 'Normal'
					},
					{
						'd4p1:Email': obj.email
					},
					{
						'd4p1:Gender': 'Male'
					},
					{
						'd4p1:HeadPicture': [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:IsEnable': false
					},
					{
						'd4p1:LoginPassword': obj.password
					},
					{
						'd4p1:Memo':  [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:Name': obj.name
					},
					{
						'd4p1:PCDCode': obj.pcdCode
					},
					{
						'd4p1:PCDDescription': obj.pcd
					},
					{
						'd4p1:ProductRight': 0
					},
					{
						'd4p1:QQNo': obj.qq
					},
					{
						'd4p1:StoreName':  [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:WangwangNo':  [
							{
								_attr: {
									'i:nil': 'true'
								}
							}
						]
					},
					{
						'd4p1:WeixinNo':  obj.weixin
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};
