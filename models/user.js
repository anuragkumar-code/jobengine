module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    resumeData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: false
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });
  
  User.associate = models => {
    User.hasMany(models.Application);
  };
  
  return User;
};