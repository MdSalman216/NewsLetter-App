const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const secret = require(__dirname + "/secrets.js");

const app = express();

app.use(express.static("public")) // used to render static elements like css, images, etc.
// "public" is the name of the Folder where CSS and images are present.

app.use(bodyParser.urlencoded({extended: true})); // use bodyParser

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
  
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

 var data = {
    members : [
                {
                  email_address: email,
                  status : "subscribed",
                  merge_fields : {
                                    FNAME : fname,
                                    LNAME : lname
                                }
                }
              ]
 }
var jsonData = JSON.stringify(data);

const KEYS = secret(); // data imported from secret.js

// const url = "https://us1.api.mailchimp.com/3.0/lists/c842dae987"  
const url = KEYS.URL;

const options = {
  method: "POST",
  auth: KEYS.ApiKey  
  // authentication is "anystring:API key"
}

  // https.request() used to post the data to the API
  const request = https.request(url, options, function(response){
          //Here response sent by the Mailchimp API

          if(response.statusCode === 200)
              res.sendFile(__dirname + "/success.html");
          else
              res.sendFile(__dirname + "/failure.html");
          
          response.on("data", function(data){
            console.log(JSON.parse(data));
          });
  })//https.request()

  request.write(jsonData); // send our data to mailchimp server
  request.end();

});//app.post()


// on failure in signing Up redirect to home page on clicking the button.
app.post("/failure", function(req,res){
  res.redirect("/");
});


// this is for localhost server => localhost:3000
// app.listen(3000, function(){
//   console.log("Server running on port 3000.")
// });


// Below one is used for Heroku Deployment
// "process" is the method of Heroku
// app.listen(process.env.PORT, function(){
//   console.log("Server running on port 3000.")
// });

// In order to deploy our app in Heroku as well
// as check in the localhost:3000

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000....")
});
  