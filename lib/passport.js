const passport = require('passport');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { LINKEDIN_CLIENT_ID: clientID, LINKEDIN_CLIENT_SECRET: clientSecret } = process.env;
const callbackURL = process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3030/api/auth/linkedin/callback';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LinkedinStrategy({
    clientID,
    clientSecret,
    callbackURL,
    scope: ['r_emailaddress', 'r_liteprofile']
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      const name = profile.displayName;
      const email = profile.emails[0].value;

      User.findOne({ where: { email } })
        .then((u) => {
          if (u) return u;
          return User.create({ name, email, password: '' });
        })
        .then((u) => {
          const jwtToken = jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          done(null, { jwtToken });
        });
    });
  })
);

module.exports = passport;
