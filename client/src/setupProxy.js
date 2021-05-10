const createProxyMiddleware = require("http-proxy-middleware");

const target = "http://localhost:5001/";

module.exports = function (app) {
  app.use(
    ["/dev"],
    createProxyMiddleware({
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
