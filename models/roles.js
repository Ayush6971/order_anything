module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define("roles", {
    roleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // roles.associate = (models) => {
  //   roles.belongsTo(models.users, {
  //     foreignKey: "roleID",
  //   });
  // };
  return roles;
};
