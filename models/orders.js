module.exports = (sequelize, DataTypes) => {
  const orders = sequelize.define("orders", {
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryPerson: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "userID",
      },
    },
    orderStage: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        "Task Created",
        "Reached Store",
        "Items Picked",
        "Enroute",
        "Delivered",
        "Canceled",
      ],
    },
    itemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "items",
        key: "itemID",
      },
    },
  });
  orders.associate = (models) => {
    orders.belongsTo(models.pickUpLocations, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: "pickUpLocationID",
      targetKey: "pickUpLocationID",
    });
    orders.belongsToMany(models.items, { through: "OrderItems" });
  };
  return orders;
};
