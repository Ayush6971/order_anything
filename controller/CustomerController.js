const models = require("../models");

const addToCart = async function (req, res) {
  try {
    if (req.method === "POST") {
      const userID = req.user.id;
      const { itemID, quantity } = req.body;
      if (!itemID || !quantity) {
        return res.status(400).send({
          message: "Please fill all mandatory field",
        });
      }
      let findUser = await models.users.findOne({
        where: { userID: userID },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      let checkRole = await models.roles.findOne({
        where: { roleID: findUser.roleID },
      });
      if (checkRole.role !== "Customer") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let findItem = await models.items.findOne({
        where: { itemID: itemID },
      });
      if (!findItem) {
        return res.status(400).send({
          message: "item not found",
        });
      }
      let addNewItemToCart = await models.cart.create({
        quantity: quantity,
        itemID: itemID,
        userID: userID,
      });
      if (addNewItemToCart) {
        return res.status(200).send({
          message: `Wohoo! ${findItem.itemName} added to cart Successfully. If you want to place order then use /cart/placeOrder with "POST" method`,
          itemAddedToCart: addNewItemToCart,
        });
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

const getMyCart = async function (req, res) {
  try {
    if (req.method === "GET") {
      const userID = req.user.id;
      let findUser = await models.users.findOne({
        where: { userID: userID },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      let checkRole = await models.roles.findOne({
        where: { roleID: findUser.roleID },
      });
      if (checkRole.role !== "Customer") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let getAllItemsInCart = await models.cart.findAll({
        where: { userID: userID },
      });
      return res.status(200).send({
        message: `Your cart items are listed below:`,
        getAllItemsInCart: getAllItemsInCart ? getAllItemsInCart : null,
      });
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

const placeOrder = async function (req, res) {
  try {
    if (req.method === "POST") {
      const userID = req.user.id;
      let getPickUplocationID, placeNewOrder;
      let index = Math.random();
      if (index < 0.5) index = 0;
      else index = 1;
      let findUser = await models.users.findOne({
        where: { userID: userID },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      let checkRole = await models.roles.findOne({
        where: { roleID: findUser.roleID },
      });
      if (checkRole.role !== "Customer") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let findItemsFromCart = await models.cart.findAll({
        where: { userID: userID },
      });
      if (findItemsFromCart && findItemsFromCart.length < 1) {
        res.status(400).send({
          message: "First add items to cart",
        });
      }

      let itemIds = findItemsFromCart.map((data) => data.itemID);
      let findItem = await models.items.findAll({
        where: { itemID: itemIds },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (findItem && findItem.length < 1) {
        return res.status(400).send({
          message: "Items are out of stock",
        });
      }

      let findPickUpLocation = await models.pickUpLocations.findAll({
        where: { itemID: itemIds },
      });
      if (findPickUpLocation && findPickUpLocation.length < 1) {
        res.status(400).send({
          message: "Items are not available",
        });
      }

      if (findItemsFromCart.length === 1) {
        findPickUpLocation.filter((data) => {
          data.itemID === itemIds[0];
        });
        getPickUplocationID =
          findPickUpLocation && findPickUpLocation.length > 1
            ? findPickUpLocation[index].pickUpLocationID
            : findPickUpLocation[0].pickUpLocationID;
        let orderObject = {
          itemID: itemIds[0],
          customer: userID,
          quantity: findItemsFromCart[0].quantity,
          orderStage: "Task Created",
          pickUpLocationID: getPickUplocationID,
        };
        placeNewOrder = await models.orders.create(orderObject);
        if (!placeNewOrder) {
          res.status(400).send({
            message: "Something went wrong, order not placed. Please try again",
          });
        }
        await models.cart.destroy({ where: { itemID: itemIds } });
        return res
          .status(200)
          .send(
            `Wohoo! order placed succesfully.Your order id is ${placeNewOrder.orderID}`
          );
      } else if (findItemsFromCart.length > 1) {
        let orderIds = [],
          orderArray = findItemsFromCart.map((data) => {
            return {
              itemID: data.itemID,
              customer: userID,
              quantity: data.quantity,
              orderStage: "Task Created",
              pickUpLocationID: findPickUpLocation.filter(
                (locID) => locID.itemID === data.itemID
              )[index].pickUpLocationID,
            };
          });
        placeNewOrder = await models.orders.bulkCreate(orderArray);

        if (!placeNewOrder) {
          res.status(400).send({
            message: "Something went wrong, order not placed. Please try again",
          });
        }
        placeNewOrder.forEach((ids) => {
          orderIds.push(ids.orderID);
        });
        return res
          .status(200)
          .send(`Wohoo! order placed succesfully.Your order id is ${orderIds}`);
      } else {
        return res.status(400).send({
          message: "your cart is empty",
        });
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

const getOrderById = async function (req, res) {
  try {
    if (req.method === "GET") {
      const userID = req.user.id;
      const { orderID } = req.body;
      if (!orderID) {
        return res.status(400).send({
          message: "Please fill all mandatory field",
        });
      }
      let findUser = await models.users.findOne({
        where: { userID: userID },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      let getOrderById = await models.orders.findAll({
        where: { orderID: orderID },
        include: { model: models.pickUpLocations },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getOrderById) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      return res.status(200).send({
        message: `Your details are:`,
        orderDetails: getOrderById ? getOrderById : null,
      });
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

const cancelOrder = async function (req, res) {
  try {
    if (req.method === "POST") {
      const userID = req.user.id;
      const { orderID } = req.body;
      if (!orderID) {
        return res.status(400).send({
          message: "Please fill all mandatory field",
        });
      }
      let findUser = await models.users.findOne({
        where: { userID: userID },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "current user not found",
        });
      }
      let checkRole = await models.roles.findOne({
        where: { roleID: findUser.roleID },
      });
      if (checkRole.role !== "Customer") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let checkOrder = await models.orders.findOne({
        where: { orderID: orderID },
      });
      if (!checkOrder || checkOrder.orderStage === "Delivered") {
        return res.status(400).send({
          message: "You can not cancel delivered order",
        });
      }
      let updateOrder = await models.orders.update(
        { orderStage: "Canceled" },
        { where: { orderID: orderID } }
      );
      if (updateOrder.length < 1) {
        return res.status(400).send({
          message: "Unable to cancel order",
        });
      }
      return res.status(200).send({
        message: "Order Canceled successfully",
        orderDetail: updateOrder.length > 0 ? updateOrder : null,
      });
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

module.exports = {
  addToCart,
  getMyCart,
  placeOrder,
  getOrderById,
  cancelOrder,
};
