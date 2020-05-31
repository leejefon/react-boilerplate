const crypto = require('crypto');
const { User } = require('../models');
const logger = require('../lib/logger');
const sendmail = require('../lib/sendmail');

const tokenExpireTime = 24 * 60 * 60 * 1000; // 1 day

function _hmac(key, inData, algo = 'sha256') {
  const stringToken = typeof inData === 'string' ? inData : JSON.stringify(inData);
  return crypto.createHmac(algo, key).update(stringToken, 'utf8').digest('hex');
}

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const timeToken = Math.floor(new Date().getTime() / tokenExpireTime).toString(16);
    const token = _hmac(user.salt, timeToken);

    user.update({ emailVerifyToken: token });
    sendmail.verifyEmail({ email, token });
    res.send({ message: 'Registered' });
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'user already exists' });
  }
}

async function resetPasswordRequest(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    const timeToken = Math.floor(new Date().getTime() / tokenExpireTime).toString(16);
    const token = _hmac(user.salt, timeToken);

    user.update({ password_reset_token: token });
    sendmail.resetPassword({ email, token });
    res.send({ message: 'Email is sent' }); // Always said email sent, so ppl can't use this to check registration
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error resquesting password reset' });
  }
}

async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ where: { password_reset_token: token } });
    if (user) {
      const timeToken = Math.floor(new Date().getTime() / tokenExpireTime).toString(16);
      const latestToken = _hmac(user.salt, timeToken);
      if (latestToken !== token) {
        res.status(400).send({ message: 'Token has expired' });
      } else {
        await user.update({ password, password_reset_token: null });
        res.send({ message: 'Password updated' });
      }
    } else {
      res.status(400).send({ message: 'Invalid token' });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error resetting password' });
  }
}

async function verifyEmailRequest(req, res) {
  const { id } = req.user;

  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      const timeToken = Math.floor(new Date().getTime() / tokenExpireTime).toString(16);
      const token = _hmac(user.salt, timeToken);
      user.update({ emailVerifyToken: token });
      sendmail.verifyEmail({ email: user.email, token });
      res.send({ message: 'Email Sent' });
    } else {
      res.send({ message: 'Something is wrong, no user found' });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error resquesting email verify' });
  }
}

async function verifyEmail(req, res) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { emailVerifyToken: token } });
    if (user) {
      const timeToken = Math.floor(new Date().getTime() / tokenExpireTime).toString(16);
      const latestToken = _hmac(user.salt, timeToken);
      if (latestToken !== token) {
        res.status(400).send({ message: 'Token has expired' });
      } else {
        await user.update({ emailVerifyToken: null });
        res.send({ message: 'Email verified' });
      }
    } else {
      res.status(400).send({ message: 'Invalid token' });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error verifying email' });
  }
}

async function getProfile(req, res) {
  const { id } = req.user;

  try {
    const user = await User.scope('withoutPassword').findOne({ where: { id } });
    if (user) {
      const { emailVerifyToken, phoneVerifyToken, ...u } = user.get({ plain: true });
      res.send({ ...u, emailVerified: !user.emailVerifyToken });
    } else {
      res.status(400).send({ message: 'User not found' });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error getting profile' });
  }
}

async function updateProfile(req, res) {
  const { id } = req.user;
  const { name } = req.body;

  try {
    await User.update({ name }, { where: { id } });
    res.send({ message: 'Updated' });
  } catch (err) {
    logger.error(err);
    res.status(400).send({ message: 'Error updating profile' });
  }
}

module.exports = {
  register,
  resetPasswordRequest,
  resetPassword,
  verifyEmailRequest,
  verifyEmail,
  getProfile,
  updateProfile
};
