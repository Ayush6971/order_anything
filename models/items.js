module.exports = (sequelize, DataTypes) => {
  const items = sequelize.define("items", {
    itemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    itemName: {
      type: DataTypes.STRING,
    },
    itemCategory: {
      type: DataTypes.STRING,
    },
  });
  items.associate = (models) => {
    items.hasMany(models.pickUpLocations, {
      foreignKey: "itemID",
    });
    items.belongsToMany(models.orders, { through: "OrderItems" });
  };
  return items;
};
