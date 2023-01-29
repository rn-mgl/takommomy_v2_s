const sgMail = require("@sendgrid/mail");

const url = `http://192.168.1.121:3000`;

const sendMail = async (user, sendToEmail, token) => {
  sgMail.setApiKey(process.env.SENDGRID);

  const msg = {
    to: sendToEmail,
    from: process.env.SENDGRID_USER,
    subject: "Account Verification",
    html: `<div>
            <p>Good day ${user}, please click the link to verify your account ${sendToEmail}.</p>
            <p>This link will expire in a day, and you will need to register again if
                you failed to click the link in time.
                <br />
                <br />
                If you did not register for an account in our website, you may delete this email
                or simply disregard it.
            </p>
            <a href='${url}/auth/verify/${token}'>Account Verification</a>
          </div>`,
  };

  const result = await sgMail.send(msg);

  return result;
};

module.exports = sendMail;
