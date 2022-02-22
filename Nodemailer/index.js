const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
    html: `<a href=http://localhost:3000/verify/${uniqueString}>Verify Email Here </a>`,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err)
    else console.log('Email sent: ' + info.response)
  })
}
module.exports = sendEmailValidation
