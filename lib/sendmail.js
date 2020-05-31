const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const client = nodemailer.createTransport(sgTransport({
  auth: {
    api_user: process.env.SENDGRID_USER,
    api_key: process.env.SENDGRID_PASS
  }
}));

const noReplyEmail = process.env.MAIL_FROM;

const emailTemplate = (params) => `
  Click the link to ${params.action}: ${params.url}
`;

function verifyEmail(params) {
  const url = `${process.env.BASE_URL}/verifyEmail?token=${params.token}`;
  const emailParams = {
    from: noReplyEmail,
    to: params.email,
    subject: 'Verify Email',
    html: emailTemplate({
      action: 'activate account',
      url
    })
  };
  return _send(emailParams);
}

function resetPassword(params) {
  const url = `${process.env.BASE_URL}/resetPassword?token=${params.token}`;
  const emailParams = {
    from: noReplyEmail,
    to: params.email,
    subject: 'Reset Password',
    html: emailTemplate({
      action: 'reset password',
      url
    })
  };
  return _send(emailParams);
}

function _send(params) {
  return new Promise((resolve, reject) => {
    client.sendMail(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('sent');
      }
    });
  });
}

module.exports = {
  verifyEmail, resetPassword
};
