var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
app.use(cookieParser())


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  var randString = "";
  const length = 6;
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
  randString += possible.charAt(Math.floor(Math.random() * possible.length));

  console.log(randString);
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
// email match function
// function emailMatch (email) {
//   for (id in users) {
//     if (users[id].email === req.body.email) {
//       return true;
//   }
//   }
//     return false;

// }


app.get("/", (req, res) => {
  res.send("Hello!");

});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userName: req.cookies["username"], };
  // console.log(userID);
  res.render("urls_index",templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {userName: req.cookies["username"], };
  res.render("urls_new",templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.get("/urls/:id" , (req, res) => {

  let templateVars = {
    userName: req.cookies["username"],
    shortURL: req.params.id
  };
  res.render("urls_show",templateVars);

});

app.post("/urls/:id", (req, res) => {
  let add = req.body.longURL;
  urlDatabase[req.params.id] = add
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {                     //Logout
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/login", (req,res) => {                      //http://localhost:8080/urls/login
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
res.render("urls_login");
});

app.get("/register", (req, res) => {
res.render("urls_register");
});

app.post("/register", (req,res) => {

for(i in users){
   if(users[i].email == req.body.email){ //checking if email already exists
   res.status(400)
   .send('email already exists');
   }
 }

 if(req.body.email == "" || req.body.password == "") {
   res.status(400)        // HTTP status 400: NotFound
  .send('Not found');}



  const id = Object.keys(users).length + 1;
  const {email, password} = req.body;
  users[id] = { id : id,
                     email : email,
                     password : password };

  res.cookie("user_id", id);
  res.redirect("/urls");

});




app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
   let short = req.params.shortURL;
   const longURL = urlDatabase[short];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});