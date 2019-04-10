module.exports = function(sequelize, DataTypes) {
    var fbUser = sequelize.define("fbUser", {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      Authorization: {
        type: DataTypes.accessToken,
        allowNull: false,
        validate: {
          len: [1]
        }
        
      },
    
    });
    var accessToken = response.authResponse.accessToken;
    fbUser.associate = function(){
        fbUser.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              return accessToken;
            } 
          } );
    };
    return fbUser;
  };
  
  var db = {};

  db.session.add(fbUser)
  db.session.commit()