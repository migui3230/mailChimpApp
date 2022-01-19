var express = require('express');
var router = express.Router();
var https = require("https")
var bodyParser = require("body-parser")
var mailchimp = require("@mailchimp/mailchimp_marketing")

// config for the mailchimp api object
mailchimp.setConfig({
  apiKey: "",
  server: "",
});

// parses incoming requests from the express middleware (json)
router.use(bodyParser.urlencoded({extended: true}))


/* GET home page. */
router.get('/', function(req, res, next) {
  // sends the signup file to this path
  res.sendFile(__dirname + "/signup.html")
});

// saves the user input into the variables
router.post("/", function (req, res) {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  // creates a subscribing user from the variables
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      // waits for the response of input from the user then sends them to the success signup page
      const response = await mailchimp.lists.addListMember("484c96ad6e", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html")
    } catch (err) {
      // sends the user to the failure signup page
      console.log(err.status);
      // console.log("====== ERROR ======");
      // console.log(JSON.parse(err.response.error.text).detail)
      res.sendFile(__dirname + "/failure.html")
    }
  };

  run()
})

// once the user clicks the button in the failure page, they are sent to the hoome page which is the signup page
router.post("/failure", function(req, res) {
  res.redirect("/");
});


module.exports = router;
