const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const Auth = require("../controller/AuthController");

//signUp routes
router.get("/signUp", Auth.signUp);
router.post(
  "/signUp",
  [
    check("phoneNo")
      .isLength({ min: 10 })
      .withMessage("phoneNo must be at least of 10 digits"),
    check("password").isLength({ min: 5 }).withMessage("must contain a number"),
  ],
  Auth.signUp
);

//login route
router.post(
  "/login",
  [
    check("phoneNo")
      .isLength({ min: 10 })
      .withMessage("phoneNo must be at least of 10 digits"),
    check("password").isLength({ min: 5 }),
  ],
  Auth.login
);

//logout
router.get("/signOut", Auth.signOut);

module.exports = router;
