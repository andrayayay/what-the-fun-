module.exports = function(sequelize, DataTypes) {
  var Favorites = sequelize.define(
    "Favorites",
    {
      userID: DataTypes.STRING,
      username: DataTypes.STRING,
      title: DataTypes.STRING,
      eventDate: DataTypes.DATE,
      address: DataTypes.STRING,
      placeId: DataTypes.STRING,
      startTime: DataTypes.STRING,
      timeZone: DataTypes.STRING,
      eventID: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return Favorites;
};