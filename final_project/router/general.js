const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password) {
    return res.status(404).json({message:"Enter username and password"});
  }
  if( isValid(username) ) {
    res.json({message:"User already exists"});
    res.redirect("../customer/login");
  }
  
  users.push({"name":username,"password":password});
  console.log(users);
  res.status(200).json({message: "User successfully registred. Now you can login"});
  res.redirect( "../customer/login");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  return res.status(200).send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  for( key in books) {
    if (books[key].author === req.params.author ) 
       return res.send(books[key]);
  }
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for( key in books) {
    if(books[key].title === req.params.title ) {
        res.send(JSON.stringify(books[key])) ;
    }
  }
  return res.status(300).json({message: "No book found with given title."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
  return res.status(200).send(books[req.params.isbn ].reviews );
});

module.exports.general = public_users;
