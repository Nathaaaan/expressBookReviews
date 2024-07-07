const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Array for storing users
let users = [{"username" : "ntxk", "password": "superpass"}];

const isValid = (username)=>{ //returns boolean
  // Write code to check is the username is valid
  // Filter the users array for any user with the same username
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  // If exists return true
  return usersWithSameName.length > 0;
}

const authenticatedUser = (username, password)=>{ //returns boolean
// write code to check if username and password match the one we have in records.
  let usersWithSameNameAndPassword = users.filter(user => user.username === username && user.password === password);
  return usersWithSameNameAndPassword.length > 0;
}

// Only registered users can log in
regd_users.post("/login", (req,res) => {
  // Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(isValid(req.body.username) && authenticatedUser(username, password)){
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: req.body.username,
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Login success");
  }
  return res.status(300).json({message: "Error"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
