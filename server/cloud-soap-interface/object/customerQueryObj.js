/**
 * @author qianqing
 * @create by 16-4-12
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.isRegXML = function (obj) {
	var xmlObj = [{
		GetCustomers: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				query: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					},
					{
						'd4p1:Header': [
							{
								'd4p1:AppKey': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
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
										'd4p1:UserSysNo': 0
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
							},
							{
								'd4p1:SessionKey': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:Sign': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:Timestamp': 0
							}
						]
					},
					{
						'd4p1:PagingInfo': [
							{
								'd4p1:CurrentPage': 0
							},
							{
								'd4p1:PageSize': 0
							},
							{
								'd4p1:SortType': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:TotalCount': 0
							}
						]
					},
					{
						'd4p1:Body': [
							{
								_attr: {
									'xmlns:d5p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.QueryService.Data'
								}
							},
							{
								'd5p1:CellPhoneNo': obj.phone
							},
							{
								'd5p1:CompanyCode': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CompanyName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CompanySysNo': 0
							},
							{
								'd5p1:CustomerCompanyName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CustomerGroupSysNo': 0
							},
							{
								'd5p1:CustomerID': 0
							},
							{
								'd5p1:CustomerIdentityMobileNo': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CustomerIdentityRealName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CustomerManagerSysNo': 0
							},
							{
								'd5p1:CustomerName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CustomerNo': 0
							}
							,
							{
								'd5p1:CustomerType': -1
							},
							{
								'd5p1:EmployeeCode': 0
							},
							{
								'd5p1:EnableStatus': 'All'
							},
							{
								'd5p1:EndWelfareValue': 0
							},
							{
								'd5p1:GroupStatus': 'All'
							},
							{
								'd5p1:HaveCustomerManager': -1
							},
							{
								'd5p1:HaveSales': -1
							}
							,
							{
								'd5p1:IdentityAudit': 'All'
							},
							{
								'd5p1:InDateForm': '0001-01-01T00:00:00'
							},
							{
								'd5p1:InDateTo': '0001-01-01T00:00:00'
							}
							,
							{
								'd5p1:IsNeedBill': 'All'
							},
							{
								'd5p1:LastOrderDateForm': '0001-01-01T00:00:00'
							},
							{
								'd5p1:LastOrderDateTo': '0001-01-01T00:00:00'
							},
							{
								'd5p1:PCDCode': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:RegisterStatus': 'All'
							},
							{
								'd5p1:SalesSysNo': 0
							},
							{
								'd5p1:SearchCustomerReceiveAddress': 'NoSearchCustomerReceiveAddress'
							},
							{
								'd5p1:StartWelfareValue': 0
							},
							{
								'd5p1:WeixinOpenID': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:WeixinUniqueID': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:WexinNo': [
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
			}
		]
	}];

	return xml(xmlObj, true);
};