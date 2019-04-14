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
  b6UTxQ: { longURL: "https://www.tsn.ca",
            userID: "userRandomID" },

  i3BoGr: { longURL: "https://www.google.ca",
            userID: "user2RandomID" }
};

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "abc@d.com",
    password: "1234"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "abc@e.com",
    password: "12345"
  }
}
// email match function
function emailMatch (email) {
  for (id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return false;
}

function passMatch (password) {
  for (id in users) {
    if (users[id].password === password) {
      return users[id];
    }
  }
  return false;
}


function urlsForUser (userID) {
  let urls = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      urls[shortURL] = urlDatabase[shortURL];
    }
  }
  return urls;
}


app.get("/", (req, res) => {
  res.send("Hello!");

});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {                ///user id cookies
  let userID = req.cookies["user_id"]
    if (!userID){
      res.redirect("/login"); }

      let user = users[userID]
      let templateVars = { urls: urlsForUser(userID), user: user};
      res.render("urls_index",templateVars);
 });


app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user_id"]

  if (!userID){
  res.redirect("/login")
 } else {
  let user = users[userID]
  let templateVars = {user: user };}
  res.render("urls_new")
 });

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
   let shortURL = req.params.shortURL;
   const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.get("/urls/:id" , (req, res) => {
     let short = req.params.id;
   const longURL = urlDatabase[short];

  let userID = req.cookies["user_id"]
  let user = users[userID]
  let templateVars = { user: user, shortURL:short };
  res.render("urls_show",templateVars);

});

app.post("/urls/:id", (req, res) => {
  let add = req.body.longURL;
  urlDatabase[req.params.id] = add
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {                     //Logout
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/login", (req,res) => {
  email = req.body.email;
  password =req.body.password;

  let user = emailMatch(email, users);
  if (user && passMatch(password,users)) {
    let user_id = user.id;
  res.cookie("user_id", user_id);
  // console.log(req.body.email);
  res.redirect("/urls");
} else {
  res.status(403).send("Username or password incorrect")
}
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
   let shortURL = req.params.shortURL;
   const longURL = urlDatabase[short];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});