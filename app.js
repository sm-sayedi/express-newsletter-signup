const express = require("express");
const bodyParser = require("body-parser");
const https = require("node:https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server is running on port ${port}.`);
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us16.admin.mailchimp.com/3.0/lists/b648b2c1ec";
  const options = {
    method: "POST",
    auth: "sm-sayedi:45a04991cfde1b3b7ce4b7e9fae95a6d-us16",
  };
  // auth: "angela1:1cc50cfe33cd2bb4e7f63805ef1ba97c-us16"

  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);

    var data;
    response.on("data", function (chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    response.on("end", function () {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
