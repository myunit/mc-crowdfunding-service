/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
var xml = require('xml');

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
