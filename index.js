require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./lib/logger');
const passport = require('./lib/passport');
const models = require('./models');
const Auth = require('./routes/auth');
const User = require('./routes/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));
app.use(passport.initialize());

app.post('/api/auth/login', Auth.login);
app.get('/api/auth/logout', Auth.logout);
app.post('/api/user/register', User.register);
app.post('/api/user/verifyEmail', Auth.requireLogin(), User.verifyEmailRequest);
app.post('/api/user/verifyEmail/:token', User.verifyEmail);
app.post('/api/user/resetPassword', User.resetPasswordRequest);
app.post('/api/user/resetPassword/:token', User.resetPassword);
app.get('/api/user/me', Auth.requireLogin(), User.getProfile);
app.post('/api/user/me', Auth.requireLogin(), User.updateProfile);

app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), Auth.oauthCallback);


app.use('/', express.static('./public'));
app.use('/:page', express.static('./public'));

models.sequelize.sync({ force: false }).then(() => {
  const server = app.listen(process.env.PORT || 3030);
  server.on('listening', () => logger.info(`Server listening on port ${process.env.PORT || 3030}`));

  process.on('SIGINT', () => server.close(() => process.exit(0)));
});

process.on('unhandledRejection', (r) => {
  logger.error('unhandledRejection', r);
  process.exit(1);
});
