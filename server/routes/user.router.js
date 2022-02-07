const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const nodemailer = require("nodemailer");
const { getImageListItemBarUtilityClass } = require('@mui/material');
const { config } = require('dotenv');
const router = express.Router();
const xoauth2 = require('xoauth2');

const gconfig = {
  mailUser: 'priumni.devs@gmail.com',
  clientId: '650563796542-r9t62jarb07gvm5aif5ggd6vf4pm1drv.apps.googleusercontent.com',
  mailPass: 'testapp1234',
  clientSecret: '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',
  refreshToken: '1//044u4_ahSxEroCgYIARAAGAQSNwF-L9Ir_g9HblFmN25WbNSvJ0oqNLnXMwsTXH_3_ypWs-xtzlyj-zR8YblUeL4z2MtEn5z7tB0',
  accessToken: 'ya29.A0ARrdaM_qsBRLIKU4fa8iO2iCqTEXMADA_pbaID__i1KgPY9EfFRlMxhSTMO_Os2myYZuOsk3z__CLiuGHIfnwp60Kuq-v5XCAT8bfSZ2XbX5HFVBkMXuH6QpQuSrzy-PWL6Qsla2GahNAH3grEGmoXCg1Mtv'
}

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

router.get('/username', (req, res) => {
  console.log(req.query);
  const queryText = `SELECT * FROM "user" WHERE "email"='${req.query.email}'`;
  pool
    .query(queryText)
    .then(
      async (result) => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            type: 'OAuth2',
            user: gconfig.mailUser, // generated ethereal user
            clientId: gconfig.clientId,
            clientSecret: gconfig.clientSecret,
            refeshToken: gconfig.refreshToken,
            accessToken: gconfig.accessToken
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Priumni App"', // sender address
          to: `${req.query.email}`, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: `<b>Hello world?</b> ${result.rows[0].username}`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
    ).catch((err) => {
      console.log('Username email failed: ', err);
      res.sendStatus(500);
    });
    res.sendStatus(201);
})

router.put('/password', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const email = req.body.email;
  
  const queryText = `UPDATE "user" SET password=$1 WHERE username=$2 AND user_email=$3`;
  pool
    .query(queryText, [password, username, email])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});
// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const role = 'admin';
  
  const queryText = `INSERT INTO "user" (username, password, firstname, lastname, role)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  pool
    .query(queryText, [username, password, firstname, lastname, role])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
