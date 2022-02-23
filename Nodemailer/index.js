const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'mohammad2002ismail@gmail.com',
    pass: 'LHhhs9khMFbZ',
  },
})

function sendEmailValidation(email, uniqueString) {
  const mailOptions = {
    from: 'mohammad2002ismail@gmail.com',
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
