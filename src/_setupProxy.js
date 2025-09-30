const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use("/st", (req, res, next) => {
    res.header("Content-type", "multipart/form-data");
    next();
  });
  app.use("/st", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use(
    '/st',
    createProxyMiddleware({
      target: 'https://x-st1.justlaw.online',
      //target: 'http://69.167.186.207:9050',
      changeOrigin: true,
      secure: true,
      //headers: {
      //  'Access-Control-Allow-Origin': '*',
      //  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      //  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      //}
    })
  );
};