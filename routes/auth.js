const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const logger = require('../lib/logger');
const { User } = require('../models');

const cookieAge = 60 * 60 * 1000; // 1 hour

function requireLogin() {
  const secret = process.env.JWT_SECRET;
  return expressJWT({
    secret,
    getToken: (req) => {
      if (req.headers.authorization && ['bearer', 'jwt'].includes(req.headers.authorization.split(' ')[0].toLowerCase())) {
        return req.headers.authorization.split(' ')[1];
      } if (req.query && req.query.token) {
        return req.query.token;
      } if (req.cookies && req.cookies.jwt) {
        return req.cookies.jwt;
      }
      return null;
    }
  });
}

async function _authenticate({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (user && user.validatePassword(password)) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { id, name, email: e } = user.get({ plain: true });
    return { token, id, name, email: e };
  }
  return null;
}

async function login(req, res) {
  const user = await _authenticate(req.body);

  try {
    if (user) {
      res.cookie('jwt', user.token, { httpOnly: true, maxAge: cookieAge });
      res.send(user);
    } else {
      res.status(400).send({ message: 'Username or password is incorrect' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: 'Error loggin in' });
  }
}

function logout(req, res) {
  res.clearCookie('jwt');
  res.send({ status: 'OK' });
}

function oauthCallback(req, res) {
  const { jwtToken } = req.user;
  res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: cookieAge });
  res.redirect('/');
}

module.exports = {
  requireLogin,
  login,
  logout,
  oauthCallback
};
