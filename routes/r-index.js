const jwt = require("jsonwebtoken");
const rAuth = require("./r-auth");
const rCart = require("./r-cart");
const rDelivery = require("./r-delivery");

module.exports = (app) => {
  //middleware
  function isAuthenticated(req, res, next) {
    const authHeader = req.headers["cookie"];
    const token = authHeader && authHeader.split("=")[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;

      next();
    });
  }
  app.use("/", rAuth);
  app.use("/cart/", isAuthenticated, rCart);
  app.use("/delivery/", isAuthenticated, rDelivery);
};
