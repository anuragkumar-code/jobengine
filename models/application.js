module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customizedResume: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'ready', 'submitted', 'failed'),
      defaultValue: 'draft'
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    applicationMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    applicationFeedback: {
      type: DataTypes.TEXT,
      allowNull: true  
    }
  });
  
  Application.associate = models => {
    Application.belongsTo(models.User);
    Application.belongsTo(models.Job);
  };
  
  return Application;
};