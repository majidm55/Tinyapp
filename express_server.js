//variables and requirements//
var cookieSession = require('cookie-session');
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(cookieSession({
  name: 'session',
  keys: ["id", "user_id"]
}))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");



//user database//
var urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },

  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID"
  }
};

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "abc@d.com",
    password: bcrypt.hashSync("1234", 10),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "abc@e.com",
    password: bcrypt.hashSync("12345", 10)

  }
}

//callback fucntions//
function generateRandomString() {
  var randString = "";
  const length = 6;
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    randString += possible[Math.floor(Math.random() * possible.length)];
  return randString;
}
// user match function//
function userMatch(email, password) {
  for (let id in users) {

    if (users[id].email === email) {
      if (bcrypt.compareSync(password, users[id].password)) {
        return users[id];
      }
    }
  }
  return false;
}
//finding url in the database//
function urlsForUser(id) {
  let urls = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urls[shortURL] = urlDatabase[shortURL];
    }
  }
  return urls;
}


//routes begin here///

//homepage route

app.get("/", (req, res) => {
  res.redirect("/urls");

});

//route for going to homepage using "/urls"  //
app.get("/urls", (req, res) => { ///user id cookies
  let user_id = req.session.user_id
  if (!user_id) {
    res.redirect("/login");
  } else {
    let templateVars = {
      'user_id': user_id,
      'urls': urlsForUser(user_id),
      'email': (users[user_id] ? users[user_id].email : users[user_id])
    };
    res.render("urls_index", templateVars);
  };
});

// route to add new url//
app.get("/urls/new", (req, res) => {
  let user_id = req.session.user_id
  if (!user_id) {
    res.redirect("/login");
  } else {
    let templateVars = {
      'user_id': user_id,
      'urls': urlsForUser(user_id),
      'email': (users[user_id] ? users[user_id].email : users[user_id])
    };
    res.render("urls_new", templateVars);
  };
});

// posting to url//
app.post("/urls", function (req, res) {
  let newURL = generateRandomString();
  urlDatabase[newURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  res.redirect(`/urls`);
});

//delete url route//
app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

// going to edit short URL//
app.get("/urls/:id", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      user_id: req.session.user_id,
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      email: (users[req.session.user_id] ? users[req.session.user_id].email : users[req.session.user_id])
    };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login")

  };
});
//posting a long url//
app.post("/urls/:id", (req, res) => {
  let user_id = req.session.user_id;
  if (!user_id) {
    res.send("Please login first")
  } else {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls")
  }

});

//logout route//
app.post("/logout", (req, res) => { //Logout
  req.session = null;
  res.redirect("/urls");
});

//login route takes you to main page//
app.post("/login", (req, res) => {
  email = req.body.email;
  password = req.body.password;
  let user = userMatch(email, password)
  if (user) {
    let userID = user.id;
    req.session.user_id = userID;
    res.redirect("/urls");
  };
  res.status(403).send("Username or password incorrect");
});

//register route//
app.post("/register", (req, res) => {

  for (i in users) {
    if (users[i].email == req.body.email) { //checking if email already exists
      res.status(400)
        .send('email already exists');
    }
  }
  const email = req.body.email;
  const password = req.body.password;
  const newUserID = generateRandomString();
  users[newUserID] = {};

  if (email === "" || password === "") {
    res.status(400) // HTTP status 400: NotFound
    res.send('Not found');
  } else {
    const id = Object.keys(users).length + 1;
    const {
      email,
      password
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    users[id] = {
      id: id,
      email: email,
      password: hashedPassword
    };

    req.session.user_id = id;
    res.redirect("/urls");
  }
});

//login page route//
app.get("/login", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
    email: (users[req.session.user_id] ? users[req.session.user_id].email : users[req.session.user_id])
  }
  res.render("urls_login", templateVars);
});

//regitser page get route//
app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
  }
  res.render("urls_register", templateVars);
});


//redirecting to the corresponding long url using a short url//
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send(shortURL, "is not a valid URL");
  };
});

//assigning a port to the server //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});