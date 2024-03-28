const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validUsers = users.filter( (user) => {
    return user.name === username;
  });
  return validUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user;
  for( user in users ) {
    console.log( users[user].name , username , users[user].password.toString() , (password));
    if( users[user].name === username && (users[user].password).toString() === (password) )
      return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;
//   console.log( "user details:", username , password);
  if(!username || !password) 
    res.status(404).send("Error in login");
//   console.log( "users[]: " , users);
  if( authenticatedUser(username, password) ) {
    let accessToken = jwt.sign( { data: password } , "access", { expiresIn: 60 *60 });
    req.session.authorization = {
      "accessToken": accessToken,
      "username": username 
    };
    return res.status(200).send("User successfully logged in");
  } else 
  return res.status(208).json({message:"Invalid login; check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // books[3].reviews[3001] = "masta";
  let username = req.session.authorization["username"];

  console.log( "user: ", req.user);
  console.log( "username: " , username );
  books[req.params.isbn ].reviews[username] = req.query.review ;
  console.log(books[req.params.isbn ].reviews[username]);
  res.status(200).json({message:" Review added"});
  
  // reviews.forEach( (review, idx) => {
  //   if(review.username === req.session.user && review.isbn === req.params.isbn) {
  //       reviews.splice(idx, 1);
  //   }
  // });
  // let newReview = {
  //   isbn: req.params.isbn,
  //   comment: req.query.review,
  //   username: req.sesion.user,
  // };
  // reviews.push(newReview);
  // return res.status(200).send(reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization["username"];
    delete books[req.params.isbn ].reviews[username];
    res.status(200).json({message: "Review is removed"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
