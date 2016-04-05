/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
var util = require('util');
var customerObj = require('./object/customerObj');

var CustomerIFS = function (app) {
  this.DS = app.datasources.CustomerSoap;
  Object.call(this);
};
util.inherits(CustomerIFS, Object);
exports = module.exports = CustomerIFS;

CustomerIFS.prototype.setCaptcha = function (data, callback) {
  var Customer = this.DS.models.Customer;
  var xml = customerObj.setCaptchaXML(data);
  Customer.SetCaptcha(xml, function (err, response) {
    try {
      callback(err, response.SetCaptchaResult);
    } catch (e) {
      console.error('CustomerIFS setCaptcha Exception: ' + e);
      callback(err, {HasError: 'false', Faults:'服务异常'});
    }
  });
};

CustomerIFS.prototype.getCaptcha = function (data, callback) {
  var Customer = this.DS.models.Customer;
  var xml = customerObj.getCaptchaXML(data);
  Customer.GetCaptcha(xml, function (err, response) {
    try {
      callback(err, response.GetCaptchaResult);
    } catch (e) {
      console.error('CustomerIFS GetCaptcha Exception: ' + e);
      callback(err, {HasError: 'false', Faults:'服务异常'});
    }
  });
};

CustomerIFS.prototype.login = function (data, callback) {
  var Customer = this.DS.models.Customer;
  var xml = customerObj.loginXML(data);
  Customer.Login(xml, function (err, response) {
    try {
      callback(err, response.LoginResult);
    } catch (e) {
      console.error('CustomerIFS login Exception: ' + e);
      callback(err, {HasError: 'false', Faults:'服务异常'});
    }
  });
};