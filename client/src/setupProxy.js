const createProxyMiddleware = require("http-proxy-middleware");

const target = "http://localhost:5001/";

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target,
    }),
  );

  app.use(
    createProxyMiddleware("/socket.io/", {
      target,
      ws: true,
    }),
  );
};
