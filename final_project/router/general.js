const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password);
  if(!username || !password) {
    return res.status(404).json({message:"Enter username and password"});
  }
  if( isValid(username) ) {
    res.json({message:"User already exists"});
    // res.redirect("/customer/login");
  }
  
  users.push({"name":username,"password":password});
  console.log(users);
  res.status(200).json({message: "User successfully registred. Now you can login"});
//   res.redirect( "/customer/login");
});

// Get the book list available in the shop
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}
public_users.get('/', async function (req, res) {
  //Write your code here
  getBooks().then((books) => res.send(JSON.stringify(books)));
});

// Get book details based on ISBN
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
  }
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result),
      error => res.status(error.status).json({message: error.message})
  );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    public_users.get('/author/:author',function (req, res) {
        const author = req.params.author;
        getBooks()
        .then((bookEntries) => Object.values(bookEntries))
        .then((books) => books.filter((book) => book.author === author))
        .then((filteredBooks) => res.send(filteredBooks));
      });
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
    const isbn = req.params.isbn;
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;
