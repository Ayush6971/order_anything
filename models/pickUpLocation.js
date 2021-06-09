module.exports = (sequelize, DataTypes) => {
  const pickUpLocations = sequelize.define("pickUpLocations", {
    pickUpLocationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pickUpLocationAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  pickUpLocations.associate = (models) => {
    pickUpLocations.hasMany(models.orders, {
      foreignKey: "pickUpLocationID",
    });
    pickUpLocations.belongsTo(models.items, {
      foreignKey: "itemID",
    });
  };

  return pickUpLocations;
};
