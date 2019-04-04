module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    userid: DataTypes.STRING,
    favorites: DataTypes.TEXT,
    name: DataTypes.STRING
  });
  return Example;
};
