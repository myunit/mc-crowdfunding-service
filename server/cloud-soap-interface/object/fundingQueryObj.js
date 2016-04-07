/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.getAllFundingXML = function (obj) {
	var xmlObj = [{
		GetAllCrowdFunding: [
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
								'd4p1:CurrentPage': obj.pageId
							},
							{
								'd4p1:PageSize': obj.pageSize
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
								'd5p1:BrandName': obj.brandName || ''
							},
							{
								'd5p1:CrowdFundingStatus': obj.fundingStatus
							},
							{
								'd5p1:CrowdFundingType': obj.fundingType
							},
							{
								'd5p1:PublishStatus': 1
							},
							{
								'd5p1:SysNo': obj.fundingId || 0
							}
						]
					}

				]
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.getFundingProgressXML = function (obj) {
	var xmlObj = [{
		GetAllCrowdFundingProgress: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				CrowdFundingSysNo: [
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
								'd4p1:CurrentPage': obj.pageId
							},
							{
								'd4p1:PageSize': obj.pageSize
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
						'd4p1:Body': obj.fundingId
					}

				]
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.getFundingReserveXML = function (obj) {
	var xmlObj = [{
		GetAllCrowdFundingReserve: [
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
								'd4p1:CurrentPage': obj.pageId
							},
							{
								'd4p1:PageSize': obj.pageSize
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
								'd5p1:CrowdFundingSysNo': obj.fundingId || 0
							},
							{
								'd5p1:CustomerNo': obj.userId
							},
							{
								'd5p1:SysNo': obj.reserveId || 0
							}
						]
					}

				]
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.getFundingOrderXML = function (obj) {
	var xmlObj = [{
		GetAllCrowdFundingOrder: [
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
								'd4p1:CurrentPage': obj.pageId
							},
							{
								'd4p1:PageSize': obj.pageSize
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
								'd5p1:CrowdFundingSysNo': obj.fundingId || 0
							},
							{
								'd5p1:CustomerNo': obj.userId
							},
							{
								'd5p1:OrderStatus': -1
							},
							{
								'd5p1:PaymentStatus': -1
							},
							{
								'd5p1:PublishStatus': -1
							},
							{
								'd5p1:ReturnStatus': -1
							},
							{
								'd5p1:SysNo': obj.orderId || 0
							}
						]
					}

				]
			}
		]
	}];

	return xml(xmlObj, true);
};

exports.getHotFundingXML = function (obj) {
	var xmlObj = [{
		GetAllHotCrowdFunding: [
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
								'd4p1:CurrentPage': obj.pageId
							},
							{
								'd4p1:PageSize': obj.pageSize
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
								'd5p1:BrandName': obj.brandName || ''
							},
							{
								'd5p1:CrowdFundingStatus': -1
							},
							{
								'd5p1:CrowdFundingType': obj.type
							},
							{
								'd5p1:PublishStatus': -1
							},
							{
								'd5p1:SysNo': obj.fundingId || 0
							}
						]
					}

				]
			}
		]
	}];

	return xml(xmlObj, true);
};