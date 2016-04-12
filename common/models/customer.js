var loopback = require('loopback');
var async = require('async');
var CustomerIFS = require('../../server/cloud-soap-interface/customer-ifs');
var CustomerQueryIFS = require('../../server/cloud-soap-interface/customerQuery-ifs');
var SmsIFS = require('../../server/cloud-soap-interface/sms-ifs');

module.exports = function(Customer) {
  Customer.getApp(function (err, app) {
    if (err) {
      throw err;
    }
    var app_self = app;
    var customerIFS = new CustomerIFS(app);
    var customerQueryIFS = new CustomerQueryIFS(app);
    var smsIFS = new SmsIFS(app);

    //获取验证码
    Customer.sendCaptcha = function (data, callback) {
      if (!data.phone || !data.type) {
        callback(null, {status: 0, msg: '参数错误'});
        return;
      }

      async.waterfall(
          [
            function (cb) {
              customerQueryIFS.isReg(data, function (err, res) {
                if (err) {
                  console.error('isReg err: ' + err);
                  cb({status: 0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true') {
                  console.error('isReg result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status: 0, msg: '生成验证码失败'});
                } else {
                  if (data.type === 1) {
                    if (res.TotalCount > 0) {
                      cb({status: 0, msg: '该手机已被注册'});
                    } else {
                      cb(null);
                    }
                  } else {
                    if (res.TotalCount > 0) {
                      cb(null);
                    } else {
                      cb({status: 0, msg: '该手机未注册, 请先注册'});
                    }
                  }
                }
              });
            },
            function (cb) {
              customerIFS.setCaptcha(data, function (err, res) {
                if (err) {
                  console.error('setCaptcha err: ' + err);
                  cb({status: 0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true') {
                  console.error('setCaptcha result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status: 0, msg: '生成验证码失败'});
                } else {
                  cb(null, res.Body.Captcha);
                }
              });
            },
            function (captcha, cb) {
              console.log('captcha: ' + captcha);
              var obj = {
                phone: data.phone,
                type: data.type,
                captcha: captcha
              };
              smsIFS.sendMsg(obj, function (err, res) {
                if (err) {
                  console.log('sendMsg err: ' + err);
                  cb({status:0, msg: '操作异常'});
                  return;
                }
                if (res.HasError === 'true') {
                  console.error('sendMsg result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status:0, msg: res.Faults.MessageFault.ErrorDescription});
                } else {
                  cb(null, {status: 1, msg: '发送成功'});
                }
              });
            }
          ],
          function (err, msg) {
            if (err) {
              callback(null, err);
            } else {
              callback(null, msg);
            }
          }
      );

    };

    Customer.remoteMethod(
      'sendCaptcha',
      {
        description: ['获取验证码.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取验证码信息 {"phone":"string", "type":int}, ',
              'phone:手机号, type:类型(1:注册 2:登录 3:找回密码 4:校验 5:安全 6:异常 99:其他)'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/send-captcha', verb: 'post'}
      }
    );

    //登录
    Customer.login = function (data, callback) {
      if (!data.phone) {
        callback(null, {status: 0, msg: '参数错误'});
        return;
      }

      async.waterfall(
          [
            function (cb) {
              customerIFS.getCaptcha(data, function (err, res) {
                if (err) {
                  console.error('getCaptcha err: ' + err);
                  cb({status: 0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true' || !res.Body) {
                  console.error('getCaptcha result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status: 0, msg: '校验验证码失败'});
                } else {
                  var failureDate = res.Body.FailureDate.split('T');
                  failureDate = failureDate.join(' ');
                  failureDate = (new Date(failureDate)).getTime();
                  var now = (new Date()).getTime();
                  if (now > failureDate) {
                    cb({status: 0, msg: '验证码已过期'});
                    return;
                  }

                  if (data.captcha !== res.Body.Captcha) {
                    cb({status: 0, msg: '验证码错误'});
                    return;
                  }

                  cb(null);
                }
              });
            },
            function (cb) {
              customerIFS.login(data, function (err, res) {
                if (err) {
                  console.log('login err: ' + err);
                  cb({status:0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true') {
                  console.error('login result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status:0, msg: res.Faults.MessageFault.ErrorDescription});
                } else {
                  if (!res.Body) {
                    cb(null, {status: 0, msg: '用户名或密码错误'});
                  } else {
                    delete res.Body.Agent;
                    delete res.Body.ActionLogs;
                    delete res.Body.CustomerManager;
                    delete res.Body.DeliveryConfiguration;
                    delete res.Body.Sales;
                    cb(null, {status: 1, customer: res.Body});
                  }
                }
              });
            }
          ],
          function (err, msg) {
            if (err) {
              callback(null, err);
            } else {
              callback(null, msg);
            }
          }
      );

    };

    Customer.remoteMethod(
        'login',
        {
          description: ['登录.返回结果-status:操作结果 0 成功 -1 失败, customer:用户信息, msg:附带信息'],
          accepts: [
            {
              arg: 'data', type: 'object', required: true, http: {source: 'body'},
              description: [
                '登录 {"phone":"string", "password":"string", "captcha":"string"}'
              ]
            }
          ],
          returns: {arg: 'repData', type: 'string'},
          http: {path: '/login', verb: 'post'}
        }
    );

    //注册
    Customer.register = function (data, callback) {
      if (!data.phone) {
        callback(null, {status: 0, msg: '参数错误'});
        return;
      }

      async.waterfall(
          [
            function (cb) {
              customerIFS.getCaptcha(data, function (err, res) {
                if (err) {
                  console.error('getCaptcha err: ' + err);
                  cb({status: 0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true'  || !res.Body) {
                  console.error('getCaptcha result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status: 0, msg: '校验验证码失败'});
                } else {
                  var failureDate = res.Body.FailureDate.split('T');
                  failureDate = failureDate.join(' ');
                  failureDate = (new Date(failureDate)).getTime();
                  var now = (new Date()).getTime();
                  if (now > failureDate) {
                    cb({status: 0, msg: '验证码已过期'});
                    return;
                  }

                  if (data.captcha !== res.Body.Captcha) {
                    cb({status: 0, msg: '验证码错误'});
                    return;
                  }

                  cb(null);
                }
              });
            },
            function (cb) {
              customerIFS.register(data, function (err, res) {
                if (err) {
                  console.log('register err: ' + err);
                  cb({status:0, msg: '操作异常'});
                  return;
                }

                if (res.HasError === 'true'  || !res.Body) {
                  console.error('register result err: ' + res.Faults.MessageFault.ErrorDescription);
                  cb({status:0, msg: res.Faults.MessageFault.ErrorDescription});
                } else {
                  cb(null, {status: 1, customer: res.Body});
                }
              });
            }
          ],
          function (err, msg) {
            if (err) {
              callback(null, err);
            } else {
              callback(null, msg);
            }
          }
      );

    };

    Customer.remoteMethod(
        'register',
        {
          description: ['用户注册.返回结果-status:操作结果 0 成功 -1 失败, customer:用户信息 , msg:附带信息'],
          accepts: [
            {
              arg: 'data', type: 'object', required: true, http: {source: 'body'},
              description: [
                '登录 {"phone":"string", "password":"string", "captcha":"string", "address":"string", "IDNo":"string",',
                ' "categoryId":"int", "bossWeixin":"string", "categoryType":"int", "detailCategory":"string", "storeName":"string",',
                ' "storeLink":"string", "email":"string", "name":"string", "pcdCode":"string", "pcd":"string", "qq":"string", "weixin":"string"}'
              ]
            }
          ],
          returns: {arg: 'repData', type: 'string'},
          http: {path: '/register', verb: 'post'}
        }
    );

  });
};
