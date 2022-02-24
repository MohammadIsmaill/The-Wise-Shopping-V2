const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3',
  },
  auth: {
    user: 'thewiseshopping@outlook.com',
    pass: 'LHhhs9khMFbZ',
  },
})

function sendEmailValidation(email, uniqueString) {
  const mailOptions = {
    from: 'The Wise Shopping',
    to: email,
    subject: 'Email Verification',
    html: `<a href=http://the-wise-shopping.herokuapp.com/verify/${uniqueString}>Verify Email Here </a>`,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err)
    else console.log('Email sent: ' + info.response)
  })
}
module.exports = sendEmailValidation
