/**
 * @author qianqing
 * @create by 16-4-6
 * @description
 */
var xml = require('xml');
var utils = require('../../util/utils');

exports.getAllFundingXML = function (obj) {

	var status = [];
	status.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});
	var i = 0;
	for (i = 0; i < obj.fundingStatus.length; i ++) {
		status.push({'d6p1:int': obj.fundingStatus[i]});
	}


	var type = [];
	type.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	for (i = 0; i < obj.fundingType.length; i ++) {
		type.push({'d6p1:int': obj.fundingType[i]});
	}

	var active = [];
	active.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	for (i = 0; i < obj.fundingActive.length; i ++) {
		active.push({'d6p1:int': obj.fundingActive[i]});
	}

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
								'd5p1:AcitveStatus': -1
							},
							{
								'd5p1:AcitveStatuss': active
							},
							{
								'd5p1:BrandName': obj.brandName || ''
							},
							{
								'd5p1:CrowdFundingStatus': -1
							},
							{
								'd5p1:CrowdFundingStatuss': status
							},
							{
								'd5p1:CrowdFundingType': -1
							},
							{
								'd5p1:CrowdFundingTypes': type
							},
							{
								'd5p1:DistrictBrandSysNo': obj.districtId || 0
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
								'd5p1:CrowdFundingSysNo': obj.fundingId || -1
							},
							{
								'd5p1:CustomerNo': obj.userId
							},
							{
								'd5p1:SysNo': obj.reserveId || -1
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
	var statusAry = [];
	statusAry.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});
	var typeAry = [];
	typeAry.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	var status = -1;
	var type = -1;
	var i = 0;

	if (Array.isArray(obj.fundingStatus)) {
		for (i = 0; i < obj.fundingStatus.length; i ++) {
			statusAry.push({'d6p1:int': obj.fundingStatus[i]});
		}
	} else {
		status = obj.fundingStatus;
	}

	if (Array.isArray(obj.fundingType)) {
		for (i = 0; i < obj.fundingType.length; i ++) {
			typeAry.push({'d6p1:int': obj.fundingType[i]});
		}
	} else {
		type = obj.fundingType;
	}

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
								'd5p1:AcitveStatus': obj.fundingActive
							},
							{
								'd5p1:BrandSysNo': 0
							},
							{
								'd5p1:CrowdFundingName': [
									{
										_attr: {
											'i:nil': 'true'
										}
									}
								]
							},
							{
								'd5p1:CrowdFundingStatus': status
							},
							{
								'd5p1:CrowdFundingStatuss': statusAry
							},
							{
								'd5p1:CrowdFundingSysNo': -1
							},
							{
								'd5p1:CrowdFundingType': type
							},
							{
								'd5p1:CrowdFundingTypes': typeAry
							},
							{
								'd5p1:CustomerNo': obj.userId
							},
							{
								'd5p1:OrderStatus': obj.orderStatus
							},
							{
								'd5p1:PaymentStatus': obj.payStatus
							},
							{
								'd5p1:PublishStatus': 1
							},
							{
								'd5p1:ReturnStatus': obj.returnStatus
							},
							{
								'd5p1:SysNo': obj.orderId || -1
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
	var status = [];
	status.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	var active = [];
	active.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	var type = [];
	type.push({
		_attr: {
			'xmlns:d6p1': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
			'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
		}
	});

	for (var i = 0; i < obj.fundingType.length; i ++) {
		type.push({'d6p1:int': obj.fundingType[i]});
	}

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
								'd5p1:AcitveStatus': -1
							},
							{
								'd5p1:AcitveStatuss': active
							},
							{
								'd5p1:BrandName': obj.brandName || ''
							},
							{
								'd5p1:CrowdFundingStatus': -1
							},
							{
								'd5p1:CrowdFundingStatuss': status
							},
							{
								'd5p1:CrowdFundingType': -1
							},
							{
								'd5p1:CrowdFundingTypes': type
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