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
  // //ES8
  // ;(async () => {
  //   try {
  //     await sgMail.send(msg)
  //   } catch (error) {
  //     console.error(error)

  //     if (error.response) {
  //       console.error(error.response.body)
  //     }
  //   }
  // })()
}
module.exports = sendEmailValidation
