var express = require('express');
var router = express.Router();
var https = require("https")
var bodyParser = require("body-parser")
var mailchimp = require("@mailchimp/mailchimp_marketing")

mailchimp.setConfig({
  apiKey: "5cf257b41a420bd026e10c438ec51078-us6",
  server: "us6",
});

router.use(bodyParser.urlencoded({extended: true}))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/signup.html")
});

router.post("/", function (req, res) {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
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
      console.log(err.status);
      // console.log("====== ERROR ======");
      // console.log(JSON.parse(err.response.error.text).detail)
      res.sendFile(__dirname + "/failure.html")
    }
  };

  run()
})

router.post("/failure", function(req, res) {
  res.redirect("/");
});


module.exports = router;
