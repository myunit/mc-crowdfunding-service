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

  app.datasources.CustomerMgSoap.once('connected', function () {
    console.log('CustomerMg interface is connected');
    app.datasources.CustomerMgSoap.createModel('CustomerMg', {});
  });

  app.datasources.FundingQuerySoap.once('connected', function () {
    console.log('FundingQuery interface is connected');
    app.datasources.FundingQuerySoap.createModel('FundingQuery', {});
  });

  app.datasources.CustomerQuerySoap.once('connected', function () {
    console.log('CustomerQuery interface is connected');
    app.datasources.CustomerQuerySoap.createModel('CustomerQuery', {});
  });

  app.datasources.ImgQuerySoap.once('connected', function () {
    console.log('ImgQuery interface is connected');
    app.datasources.ImgQuerySoap.createModel('ImgQuery', {});
  });

  app.datasources.SupplierSoap.once('connected', function () {
    console.log('Supplier interface is connected');
    app.datasources.SupplierSoap.createModel('Supplier', {});
  });
};
