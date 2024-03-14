const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const fetchBooks = () => {
  return books
}

public_users.get("/", async  (req, res) => {
  try {
    const books = await fetchBooks(); // Implement fetchBooks function to fetch books from the database or another data source

    // Return the list of books as a JSON response
    return res.status(200).json({ books });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// public_users.get('/', (req, res) => {
//     // Send the updated books as a response
//     return res.send(books);
// });

// Function to get book details by ISBN
function getBookDetailsByISBN(isbn) {
  // Search for the book in the mock database
  const book = Object.values(books).find(book => book.isbn === isbn);

  // Return the book details if found, otherwise return null
  return book || null;
}
// Export the function
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  console.log(Object.values(books))
  // Implement the logic to get book details based on the ISBN
  // This is just a placeholder, you need to replace it with your actual implementation
  const bookDetails = await getBookDetailsByISBN(isbn);
  // Check if book details were found
  if (bookDetails) {
    // Send the book details as a JSON response
    res.json(bookDetails);
  } else {
    // If no book details were found, send a 404 Not Found response
    res.status(404).json({ error: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const author = req.params.author;

  const bookDetails = await Object.values(books).find(book => book.author === author);
  // Check if book details were found
  if (bookDetails) {
    // Send the book details as a JSON response
    res.json(bookDetails);
  } else {
    // If no book details were found, send a 404 Not Found response
    res.status(404).json({ error: 'Book not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  const title = req.params.title;

  const bookDetails = await Object.values(books).find(book => book.title === title);
  // Check if book details were found
  if (bookDetails) {
    // Send the book details as a JSON response
    res.json(bookDetails);
  } else {
    // If no book details were found, send a 404 Not Found response
    res.status(404).json({ error: 'Book not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const bookDetails = getBookDetailsByISBN(isbn);
  // Check if book details were found
  if (bookDetails) {
    // Send the book details as a JSON response
    res.json(bookDetails.reviews);
  } else {
    // If no book details were found, send a 404 Not Found response
    res.status(404).json({ error: 'Book not found' });
  };
});

module.exports.general = public_users;
