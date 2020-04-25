const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount;
  if(!('EMAIL_HOST' in process.env)){
    testAccount = await nodemailer.createTestAccount();
    console.log(testAccount)
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_AUTH_USER || testAccount.user, // generated ethereal user
      pass: process.env.EMAIL_AUTH_PASS || testAccount.pass // generated ethereal password
    }
  });
  return transporter;
}

// main().catch(console.error);
module.exports = main()
