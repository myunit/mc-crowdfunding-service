/**
 * @author qianqing
 * @create by 16-4-5
 * @description
 */
var xml = require('xml');

function getSMSType(type) {
	if (type === 1) {
		return 'Register';
	}
	if (type === 2) {
		return 'Login';
	}
	if (type === 3) {
		return 'FindPwd';
	}
	if (type === 4) {
		return 'Verify';
	}
	if (type === 5) {
		return 'Safety';
	}
	if (type === 6) {
		return 'Exception';
	}
	if (type === 99) {
		return 'Others';
	}

	return '';
}

function getSMSNote(type) {
	if (type === 1) {
		return '注册';
	}
	if (type === 2) {
		return '登录';
	}
	if (type === 3) {
		return '找回密码';
	}
	if (type === 4) {
		return '校验';
	}
	if (type === 5) {
		return '安全';
	}
	if (type === 6) {
		return '异常';
	}
	if (type === 99) {
		return '其他';
	}

	return '';
}

exports.sendMsgXML = function (obj) {
	var xmlObj = [{
		SendMsg: [
			{
				_attr: {
					xmlns: 'http://tempuri.org/'
				}
			},
			{
				data: [
					{
						_attr: {
							'xmlns:d4p1': 'http://schemas.datacontract.org/2004/07/MYun.BPC.Contract.SMSMgmt.Data',
							'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
						}
					}, {
						'd4p1:Password': '123'
					}, {
						'd4p1:PszMobis': obj.phone
					}, {
						'd4p1:PszMsg': '尊敬的用户，您申请的' + getSMSNote(obj.type) + '验证码是：' + obj.captcha + ', 验证码很重要，如非本人操作，请联系客服。【美仓众筹】'
					}, {
						'd4p1:SMSCompany': 'All'
					}, {
						'd4p1:SMSType': getSMSType(obj.type)
					}, {
						'd4p1:SubPort': '80'
					}, {
						'd4p1:UserId': '496'
					}, {
						'd4p1:iMobiCount': 1
					}
				]
			}
		]
	}];

	return xml(xmlObj, true);
};