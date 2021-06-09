module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleID: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "roleID",
      },
    },
  });

  users.associate = (models) => {
    // users.hasOne(models.roles, {
    //   foreignKey: "roleID",
    // });
    users.hasMany(models.orders, {
      foreignKey: "customer",
    });
  };
  return users;
};
