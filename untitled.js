app.post("/register", (req, res) =>{
 //If someone tries to register with an email that is already in the users object, send back a response with the 400 status code.
 // let receivedEmail = req.body.email.toString();
 //let countOfObject = Object.keys(users).length;
 //console.log(users['user1RandomID']['email']);

 for(let i = 1; i < Object.keys(users).length; i++){
   if(users[`user${i}RandomID`]['email'] == req.body.email){ //checking if email already exists
   res.status(400)
   .send('email already exists');
   }
 }
 //If the e-mail or password are empty strings, send back a response with the 400 status code.
 if(req.body.email == "" || req.body.password == ""){
   res.status(400)        // HTTP status 400: NotFound
  .send('Not found');
 }

 //add a new user object to the global users object
 let userRandomID = `user${Object.keys(users).length + 1}RandomID`;
 req.body[userRandomID] = userRandomID;
 users[userRandomID] = req.body;
 //console.log(users);
 //After adding the user, set a user_id cookie containing the user's newly generated ID
 res.cookie('user_id', userRandomID);
 //users[req.body.username] = ;
 //body is what goes through. params is url. whenever you use : in directory then use params
 res.redirect('/urls');
});





for (i = 1; i <Object.keys(users).length; i++) {
  if users[i]['email'] === req.body.email {
    res.status(404)        // HTTP status 404: NotFound
    .send('Username already exists');
}

}
