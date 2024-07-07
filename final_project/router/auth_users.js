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
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    //return res.status(200).send("Login success");
    return res.status(200).json(accessToken);
  }
  return res.status(300).json({message: "Error"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", function(req, res) {
  // User is now logged, we will fetch the ISBN
  let requestISBN = req.params.isbn;
  let returnBook = Object.values(books).filter((book) => {
    return book.ISBN === requestISBN;
  });

  if(returnBook.length > 0) {
    // Book is found, we need to check if review is existing
    let potentialExistingReview = returnBook[0].reviews.filter((review) => {
      if(review.user === req.user.data) {
        // Edit the review
        review.comment = req.body.comment;
        return review.user;
      }
    });

    if(!potentialExistingReview.length > 0){
      // We need to add review here
      returnBook[0].reviews.push({"user": req.user.data, "comment": req.body.comment});
      return res.status(201).end();
    }
    else{
      return res.status(200).end();
    }
  }
  else{
    return res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
