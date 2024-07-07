const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop: Task 1
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN: Task 2
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestISBN = req.params.isbn;
  let returnBook = Object.values(books).filter((book) => {
    return book.ISBN === requestISBN;
  });

  if(returnBook.length > 0) {
    return res.status(200).json(returnBook);
  }
  else{
    return res.status(404).json({ message: "ISBN not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestAuthor = req.params.author;
  let returnBooks = Object.values(books).filter((book) => {
    return book.author === requestAuthor;
  });

  if(returnBooks.length > 0) {
    return res.status(200).json(returnBooks);
  }
  else{
    return res.status(404).json({ message: "Author not found" });
}});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const requestTitle = req.params.title;
  let returnBooks = Object.values(books).filter((book) => {
    return book.title === requestTitle;
  });

  if(returnBooks.length > 0) {
    return res.status(200).json(returnBooks);
  }
  else{
    return res.status(404).json({ message: "Title(s) not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const requestISBN = req.params.isbn;
  let returnBook = Object.values(books).filter((book) => {
    return book.ISBN === requestISBN;
  });

  if(returnBook.length > 0) {
    let reviews = returnBook[0].reviews;
    if(reviews === undefined) {
      return res.status(204).end();
    }
    else return res.status(200).json(reviews);
  }
  else{
    return res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.general = public_users;
