var loopback = require('loopback');
var async = require('async');
var CustomerIFS = require('../../server/cloud-soap-interface/customer-ifs');

module.exports = function(Customer) {
  Customer.getApp(function (err, app) {
    if (err) {
      throw err;
    }
    var app_self = app;
    var customerIFS = new CustomerIFS(app);

    //获取验证码
    Customer.getCaptcha = function (data, cb) {
      if (!data.phone) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      customerIFS.getCaptcha(data, function (err, res) {
        if (err) {
          console.error('getCaptcha err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('getCaptcha result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: '发送失败'});
        } else {
          cb(null, {status: 1, msg: '发送成功'});
        }
      });
    };

    Customer.remoteMethod(
      'getCaptcha',
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
        http: {path: '/get-captcha', verb: 'post'}
      }
    );

    //用户注册
    Customer.register = function (data, cb) {
      if (!data.phone) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      customerIFS.register(data, function (err, res) {
        if (err) {
          console.error('register err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('register result err: ' + res.ErrorDescription);
          cb(null, {status: 0, msg: res.ErrorDescription});
        } else {
          cb(null, {status: 1, userId: res.Customer.SysNo, msg: '注册成功'});
        }
      });
    };

    Customer.remoteMethod(
      'register',
      {
        description: ['用户注册.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '注册信息 {"phone":"string", "password":"string", "code":"string", "inviteCode":"string"}, ',
              'code验证码, inviteCode:邀请码'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/register', verb: 'post'}
      }
    );

    //用户注册(自动登录)
    Customer.registerAndLogin = function (data, regCb) {
      if (!data.phone) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      var user = data.phone,
        myToken = app_self.models.MYToken;

      async.waterfall(
        [
          function (cb) {
            customerIFS.register(data, function (err, res) {
              if (err) {
                console.error('register err: ' + err);
                cb({status: 0, msg: '操作异常'});
                return;
              }

              if (!res.IsSuccess) {
                console.error('register result err: ' + res.ErrorDescription);
                cb({status: 0, msg: res.ErrorDescription});
              } else {
                cb(null);
              }
            });
          },
          function (cb) {
            myToken.destroyAll({userId: user}, function (err) {
              if (err) {
                cb({status:0, msg: '操作异常'});
              } else {
                cb(null);
              }
            });
          },
          function (cb) {
            customerIFS.login(data, function (err, res) {
              if (err) {
                console.error('login err: ' + err);
                cb({status:0, msg: '操作异常'});
                return;
              }

              if (!res.IsSuccess) {
                console.error('login result err: ' + res.ErrorDescription);
                cb({status:0, msg: res.ErrorDescription});
              } else {
                cb(null, {status: 1, customer: res.Customer, msg: ''});
              }
            });
          },
          function (msg, cb) {
            myToken.create({userId: user}, function (err, token) {
              if (err) {
                cb({status:0, msg: '操作异常'});
              } else {
                msg.token = token;
                cb(null, msg);
              }
            });
          }
        ],
        function (err, msg) {
          if (err) {
            regCb(null, err);
          } else {
            regCb(null, msg);
          }
        }
      );
    };

    Customer.remoteMethod(
      'registerAndLogin',
      {
        description: ['用户注册.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '注册信息(注册成功后,自动登录) {"phone":"string", "password":"string", "code":"string", "inviteCode":"string"}, ',
              'code验证码, inviteCode:邀请码'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/register-and-login', verb: 'post'}
      }
    );

    //登录
    Customer.login = function (data, loginCb) {
      if (!data.phone || !data.password) {
        loginCb(null, {status:0, msg: '手机号和密码不能为空'});
        return;
      }

      var user = data.phone,
        myToken = app_self.models.MYToken;

      async.waterfall(
        [
          function (cb) {
            myToken.destroyAll({userId: user}, function (err) {
              if (err) {
                cb({status:0, msg: '操作异常'});
              } else {
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

              if (!res.IsSuccess) {
                console.error('login result err: ' + res.ErrorDescription);
                cb({status:0, msg: res.ErrorDescription});
              } else {
                cb(null, {status: 1, customer: res.Customer, msg: ''});
              }
            });
          },
          function (msg, cb) {
            myToken.create({userId: user}, function (err, token) {
              if (err) {
                cb({status:0, msg: '操作异常'});
              } else {
                msg.token = token;
                msg.service = serviceCfg;
                cb(null, msg);
              }
            });
          }
        ],
        function (err, msg) {
          if (err) {
            loginCb(null, err);
          } else {
            loginCb(null, msg);
          }
        }
      );
    };

    Customer.remoteMethod(
      'login',
      {
        description: ['用户登录.返回结果-status:操作结果 0 失败 -1 成功, customer:用户信息, token:用户token, service:服务集群信息, msg:附带信息'],
        accepts: [
          {
            arg: 'credentials', type: 'object', required: true, http: {source: 'body'},
            description: [
              '用户登录信息(JSON string) {"phone":"string", "password":"string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/login', verb: 'post'}
      }
    );

    //退出登录
    Customer.logout = function (cb) {
      var ctx = loopback.getCurrentContext(),
        token = ctx.get('accessToken'),
        myToken = app_self.models.MYToken;

      var logOutToken = new myToken({id: token.id});
      logOutToken.destroy(function (err) {
        if (err) {
          cb(null, {status: -1, msg: '退出异常'});
        } else {
          cb(null, {status: 0, msg: '退出成功'});
        }
      });

    };

    Customer.remoteMethod(
      'logout',
      {
        description: ['用户退出登录(access token).返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/logout', verb: 'post'}
      }
    );

    //忘记密码
    Customer.forgetPassword = function (data, cb) {
      if (!data.phone) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      customerIFS.forgetPassword(data, function (err, res) {
        if (err) {
          console.error('forgetPassword err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('forgetPassword result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: res.ErrorInfo});
        } else {
          cb(null, {status: 1, msg: '修改成功'});
        }
      });
    };

    Customer.remoteMethod(
      'forgetPassword',
      {
        description: ['忘记密码.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '忘记密码信息 {"phone":"string", "newPassword":"string", "code":"string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/forget-password', verb: 'post'}
      }
    );

    //修改密码
    Customer.modifyPassword = function (data, cb) {
      if (!data.userId) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      customerIFS.modifyPassword(data, function (err, res) {
        if (err) {
          console.error('modifyPassword err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('modifyPassword result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: '旧密码不正确'});
        } else {
          cb(null, {status: 1, msg: '修改成功'});
        }
      });
    };

    Customer.remoteMethod(
      'modifyPassword',
      {
        description: ['修改密码.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '修改密码信息 {"userId":int, "oldPassword":"string", "newPassword":"string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/modify-password', verb: 'post'}
      }
    );

    //判断手机是否已注册
    Customer.isRegistered = function (data, cb) {
      if (!data.phone) {
        cb(null, {status: 0, msg: '参数错误'});
        return;
      }

      customerIFS.isRegistered(data, function (err, res) {
        if (err) {
          console.error('isRegistered err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        cb(null, {status: 1, isRegistered: res})
      });
    };

    Customer.remoteMethod(
      'isRegistered',
      {
        description: ['判断手机是否已注册.返回结果-status:操作结果 0 成功 -1 失败, msg:附带信息'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '判断手机是否已注册 {"phone":"string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/is-registered', verb: 'post'}
      }
    );

  });
};
