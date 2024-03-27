const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let reviews = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validUsers = users.filter( (user) => {
    return user.name === username;
  });
  return validUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for( user in users ) {
    if( user.name === username && user.password == password )
      return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = res.query.username;
  let password = req.query.password;

  if(!username || !password) 
    res.status(404).send("Error in login");
  if( authenticatedUser(username, password) ) {
    let accessToken = jwt.sign( { data: password } , "access", { expiresIn: 60 *60 });
    req.session.authorization = {
      accessToken, username 
    };
    return res.status(200).send("User successfully logged in");
  } else 
  return res.status(208).json({message:"Invalid login; check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  reviews.forEach( (review, idx) => {
    if(review.username === req.session.user && review.isbn === req.params.isbn) {
        reviews.splice(idx, 1);
    }
  });
  let newReview = {
    isbn: req.params.isbn,
    comment: req.query.review,
    username: req.sesion.user,
  };
  reviews.push(newReview);
  return res.status(200).send(reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
