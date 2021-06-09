const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { Op } = require("sequelize");

const signUp = async function (req, res) {
  try {
    if (req.method === "GET") {
      let roles = await models.roles.findAll({
        where: { role: { [Op.ne]: "admin" } },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).send({
        message: `Welcome to signUp. Please use phoneNo, password, confirmPassword, roleID as parameters for signUp and select your roleID from the following and then change the request method to POST:`,
        roles: roles && roles.length > 0 ? roles : null,
      });
    } else if (req.method === "POST") {
      const { phoneNo, password, confirmPassword, roleID } = req.body;

      if (!phoneNo || !password || !confirmPassword || !roleID) {
        return res.status(400).send({
          message: "Please fill all mandatory fields",
        });
      }

      let checkUserExist = await models.users.findOne({
        where: { phoneNo: phoneNo },
      });

      if (checkUserExist) {
        return res.status(400).send({
          message: "User already exist, please try login",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).send({
          message: "password and confirm password must be same.",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      let createUser = await models.users.create({
        phoneNo: phoneNo,
        password: hashedPassword,
        roleID: roleID,
      });

      if (createUser) {
        const id = createUser.userID;
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true, //To prevent from hacking
        };
        let checkRole = await models.roles.findOne({
          where: { roleID: createUser.roleID },
        });
        if (checkRole && checkRole.role === "Customer") {
          let getAllItems = await models.items.findAll({
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you have registered with us Successfully. Please select the items from the list provided to add items to your cart. Use itemID and quantity as parameter to add item to your cart.`,
            Catalogue:
              getAllItems && getAllItems.length > 0 ? getAllItems : null,
          });
        } else if (checkRole && checkRole.role === "Admin") {
          let getNewOrder = await models.orders.findAll({
            where: { orderStage: "Task Created" },
          });
          let deliveryPeronRoleID = await models.roles.findOne({
            where: { role: "Delivery Person" },
          });
          let DeliveryPersonList = await models.users.findAll({
            where: { roleID: deliveryPersonRoleID.roleID },
          });
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you are registered with us Successfully. Here is the lists of Order to be picked up and Delivery person.`,
            getNewOrder:
              getNewOrder && getNewOrder.length > 0 ? getNewOrder : null,
            DeliveryPersonList:
              DeliveryPersonList && DeliveryPersonList.length > 0
                ? DeliveryPersonList
                : null,
          });
        } else if (checkRole && checkRole.role === "Delivery Person") {
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you have registered with us Successfully. Please contact admin on '0123456789' so that the orders for delivery can e assigned to you.`,
          });
        }
      }
    } else {
      res.status(400).send({
        message: "Invalid request method",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400);
  }
};

const login = async function (req, res) {
  try {
    if (req.method === "POST") {
      const { phoneNo, password } = req.body;

      if (!phoneNo || !password) {
        return res
          .status(400)
          .send({ message: "Please Provide Phone number and Password" });
      }

      let checkUser = await models.users.findOne({
        where: { phoneNo: phoneNo },
      });
      if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res
          .status(401)
          .send({ message: "Phone Number or Password is Incorrect" });
      } else {
        const id = checkUser.userID;
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true, //To prevent from hacking
        };
        let checkRole = await models.roles.findOne({
          where: { roleID: checkUser.roleID },
        });
        if (checkRole && checkRole.role === "Customer") {
          let getAllItems = await models.items.findAll({
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          });
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you have logged in Successfully. Please select the items from the list provided to add items to your cart. Use itemID and quantity as parameter to add item to your cart.`,
            Catalogue:
              getAllItems && getAllItems.length > 0 ? getAllItems : null,
          });
        } else if (checkRole && checkRole.role === "Admin") {
          let getNewOrder = await models.orders.findAll({
            where: { orderStage: "Task Created" },
          });
          let deliveryPersonRoleID = await models.roles.findOne({
            where: { role: "Delivery Person" },
          });
          let DeliveryPersonList = await models.users.findAll({
            where: { roleID: deliveryPersonRoleID.roleID },
          });
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you are logged in Successfully. Here is the lists of Order to be picked up and Delivery person.`,
            getNewOrder:
              getNewOrder && getNewOrder.length > 0 ? getNewOrder : null,
            DeliveryPersonList:
              DeliveryPersonList && DeliveryPersonList.length > 0
                ? DeliveryPersonList
                : null,
          });
        } else if (checkRole && checkRole.role === "Delivery Person") {
          let getYourOrder = await models.orders.findAll({
            where: {
              orderStage: "Task Created",
              deliveryPerson: checkUser.userID,
            },
            include: { model: models.pickUpLocations },
          });
          res.cookie("jwt", token, cookieOptions);
          return res.status(200).send({
            message: `Wohoo! you have logged in Successfully. Here are your orders to pickUp`,
            Catalogue:
              getYourOrder && getYourOrder.length > 0 ? getYourOrder : null,
          });
        }
      }
    } else {
      res.status(400).send({
        message: "Invalid request method",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400);
  }
};

const signOut = (req, res) => {
  res.clearCookie("jwt");
  res.json({
    message: "User Signout Successfully",
  });
};

module.exports = {
  signUp,
  login,
  signOut,
};
