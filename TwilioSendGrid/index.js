// const nodemailer = require('nodemailer')
// const transporter = nodemailer.createTransport({
//   host: 'smtp-mail.outlook.com',
//   port: 587,
//   secureConnection: false,
//   tls: {
//     ciphers: 'SSLv3',
//   },
//   auth: {
//     user: 'thewiseshopping@outlook.com',
//     pass: 'LHhhs9khMFbZ',
//   },
// })

// function sendEmailValidation(email, uniqueString) {
//   const mailOptions = {
//     from: 'The Wise Shopping',
//     to: email,
//     subject: 'Email Verification',
//     html: `<a href=http://the-wise-shopping.herokuapp.com/verify/${uniqueString}>Verify Email Here </a>`,
//   }
//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) console.error(err)
//     else console.log('Email sent: ' + info.response)
//   })
// }
// module.exports = sendEmailValidation
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmailValidation(email, uniqueString) {
  const msg = {
    to: email,
    from: 'mohammad2002ismail@gmail.com', // Use the email address or domain you verified above
    subject: 'Email Verification',
    text: 'Please verify your email here',
    html: `<a href="http://the-wise-shopping.herokuapp.com/verify/${uniqueString}">Verify Email Here </a>`,
  }
  //ES6
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.body)
      }
    }
  )
  //ES8
  ;(async () => {
    try {
      await sgMail.send(msg)
    } catch (error) {
      console.error(error)

      if (error.response) {
        console.error(error.response.body)
      }
    }
  })()
}
module.exports = sendEmailValidation
