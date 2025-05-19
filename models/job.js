module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true
    },
    jobUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: {
      type: DataTypes.ENUM('indeed', 'linkedin'),
      allowNull: false
    },
    relevanceScore: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'analyzed', 'applying', 'applied', 'rejected'),
      defaultValue: 'new'
    }
  });
  
  Job.associate = models => {
    Job.hasMany(models.Application);
  };
  
  return Job;
};