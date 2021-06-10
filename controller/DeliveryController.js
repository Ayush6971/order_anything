const models = require("../models");

const assignDeliveryperson = async function (req, res) {
  try {
    if (req.method === "POST") {
      const userID = req.user.id;
      const { orderID, deliveryPersonID } = req.body;
      if (!orderID || !deliveryPersonID) {
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
      if (checkRole.role !== "Admin") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let assignPerson = await models.orders.update(
        {
          deliveryPerson: deliveryPersonID,
        },
        { where: { orderID: orderID } }
      );
      if (assignPerson.length < 1) {
        return res.status(400).send({
          message: "Unable to assign delivery person",
        });
      }
      return res.status(200).send({
        message: "Order updated, Delivery Person Assigned",
        orderDetail: assignPerson.length > 0 ? assignPerson : null,
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

const getOrdersAndDeliveryPersonList = async function (req, res) {
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
      if (checkRole.role !== "Admin") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let findAllOrders = await models.orders.findAll({});
      if (findAllOrders.length < 1) {
        return res.status(400).send({
          message: "No orders placed yet",
        });
      }
      let deliveryPersonRoleID = await models.roles.findOne({
        where: { role: "Delivery Person" },
      });
      let DeliveryPersonList = await models.users.findAll({
        where: { roleID: deliveryPersonRoleID.roleID },
      });
      return res.status(200).send({
        message: `Orders and delivery persons list fetched succesfully.`,
        findAllOrders: findAllOrders.length > 0 ? findAllOrders : null,
        DeliveryPersonList:
          DeliveryPersonList && DeliveryPersonList.length > 0
            ? DeliveryPersonList
            : null,
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

const getOrderByFilter = async function (req, res) {
  try {
    if (req.method === "GET") {
      const userID = req.user.id;
      const { filterKey } = req.body;
      if (!filterKey) {
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
      if (checkRole.role !== "Admin") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let findFilteredOrder = await models.orders.findAll({
        where: { orderStage: filterKey },
      });
      if (findFilteredOrder.length < 1) {
        return res.status(400).send({
          message: "Unable to assign delivery person",
        });
      }
      return res.status(200).send({
        message: `Orders with Stage ${filterKey} fetched successfully`,
        fidnOrder: findFilteredOrder.length > 0 ? findFilteredOrder : null,
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

const updateOrderStage = async function (req, res) {
  try {
    if (req.method === "POST") {
      const userID = req.user.id;
      const { orderID, orderStage } = req.body;
      if (!orderID || !orderStage) {
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
      if (checkRole.role !== "Delivery Person") {
        return res.status(400).send({
          message: "You are not authorized",
        });
      }
      let updateOrder = await models.orders.update(
        { orderStage: orderStage },
        {
          where: { orderID: orderID },
        }
      );
      if (updateOrder.length < 1) {
        return res.status(400).send({
          message: "Unable to assign delivery person",
        });
      }
      return res.status(200).send({
        message: "Order Status updated successfully",
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
  assignDeliveryperson,
  getOrderByFilter,
  updateOrderStage,
  getOrdersAndDeliveryPersonList,
};
