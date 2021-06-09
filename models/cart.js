module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define("cart", {
    cartID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userID",
      },
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

  return cart;
};
