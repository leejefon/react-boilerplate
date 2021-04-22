const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    emailVerifyToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: DataTypes.STRING,
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: DataTypes.STRING
  }, {
    scopes: {
      withoutPassword: {
        attributes: { exclude: [
          'password', 'password_reset_token', 'salt'
        ] }
      }
    }
  });

  // User.associate = (models) => {
  //
  // };

  User.beforeCreate(async (user) => {
    user.salt = crypto.randomBytes(16).toString('hex');
    user.password = crypto.pbkdf2Sync(user.password, user.salt, 1000, 64, 'sha512').toString('hex');
  });

  User.beforeUpdate(async (user) => {
    if (user._changed.has('password')) {
      user.password = crypto.pbkdf2Sync(user.password, user.salt, 1000, 64, 'sha512').toString('hex');
    }
  });

  User.prototype.validatePassword = function validatePassword(password) {
    return this.password === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  };

  return User;
};
