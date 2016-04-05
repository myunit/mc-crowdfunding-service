/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
module.exports = function (app) {
  app.datasources.CustomerSoap.once('connected', function () {
    console.log('Customer interface is connected');
    app.datasources.CustomerSoap.createModel('Customer', {});
  });

  app.datasources.FundingSoap.once('connected', function () {
    console.log('Funding interface is connected');
    app.datasources.FundingSoap.createModel('Funding', {});
  });

  app.datasources.SMSSoap.once('connected', function () {
    console.log('SMS interface is connected');
    app.datasources.SMSSoap.createModel('SMS', {});
  });
};
