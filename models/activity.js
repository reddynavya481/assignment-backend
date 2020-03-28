'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    activity: DataTypes.STRING,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    date: DataTypes.DATEONLY,
    userId:DataTypes.INTEGER
  }, {});
  Activity.associate = function(models) {
    // associations can be defined here
    
  };
  return Activity;
};