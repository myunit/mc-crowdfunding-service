/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.setCaptchaXML = function (obj) {
	var xmlObj = [{
		SetCaptcha: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				CellPhoneNo: obj.phone
			},
			{
				FailureSeconds: 1200
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.getCaptchaXML = function (obj) {
	var xmlObj = [{
		GetCaptcha: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				CellPhoneNo: obj.phone
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.loginXML = function (obj) {
	var xmlObj = [{
		Login: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				cellPhone: obj.phone
			},
			{
				password: obj.password
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.registerXML = function (obj) {
	var xmlObj = [{
		Register: [
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
						'd4p1:CellPhoneNo': obj.phone
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
						'd4p1:ContractAddress': obj.address
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
						'd4p1:CustomerIDNo': obj.IDNo
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
								EditDate: [
									{
										_attr: {
											'xmlns': 'http://schemas.datacontract.org/2004/07/MYun.Framework.Service'
										}
									}, utils.formatByT(new Date())
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
								'd4p1:CustomerNo': 0
							},
							{
								'd4p1:ProductMaterial': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:PurchaseAmountPerMonth': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:PurchaseChannel': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:PurchaseFrequency': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:PurchasePolicy': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:SellingPrice': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreArea': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreAuditType': obj.categoryId
							},
							{
								'd4p1:StoreBossBirthDay': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreBossBirthPlace': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreBossName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreBossQQ': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreBossWeixin': obj.bossWeixin
							},
							{
								'd4p1:StoreCategory': [
									{
										'd4p1:Name': [
											{
												_attr: {
													'i:nil': 'true'
												}
											}
										]
									},
									{
										'd4p1:SysNo': obj.categoryType
									}
								]
							},
							{
								'd4p1:StoreContactAddress': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreContactName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreContactPhoneNo': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreDetailCategory': obj.detailCategory
							},
							{
								'd4p1:StoreName': obj.bossWeixin || obj.storeName
							},
							{
								'd4p1:StoreNeedProductCategory': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StorePCDCode': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StorePCDDescription': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StorePicture': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreProductLink': obj.storeLink
							},
							{
								'd4p1:StoreTableCount': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreType': 0
							},
							{
								'd4p1:StoreUrl': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:StoreYears': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd4p1:SysNo': 0

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
						'd4p1:Gender': 'All'
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
						'd4p1:IsEnable': true
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
						'd4p1:StoreName': obj.bossWeixin || obj.storeName
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
			},{
				'invitationCode':  [
					{
						_attr: {
							'i:nil': 'true',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};
