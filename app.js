const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = './data.json';
const REVIEWS_FILE = './reviews.json';

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static("public"));
app.set('view engine', 'pug'); // Set view engine
app.set('views', path.join(__dirname, 'views'));

// Helper functions
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const readReviews = () => {
    try {
        if (!fs.existsSync('./reviews.json')) {
            fs.writeFileSync('./reviews.json', JSON.stringify([])); // Create an empty array
        }
        const data = fs.readFileSync('./reviews.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading reviews.json:', error);
        return [];
    }
};
const writeReviews = (data) => fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));

// 📌 Homepage
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/homepage', (req, res) => {
    const books = readData();
    res.render('homepage', {books});
});
// 📌 Add new book
app.get('/newBook', (req, res) => {
    res.render('newBook');
});

app.post('/newBook', (req, res) => {
    const books = readData();
    const newBook = { id: Date.now(), ...req.body };
    books.push(newBook);
    writeData(books);
    res.redirect('/');
});

// 📌 Edit Book
app.get('/editBook/:id', (req, res) => {
    const books = readData();
    const book = books.find(b => b.id == req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.render('editBook', { book });
});

app.post('/editBook/:id', (req, res) => {
    const books = readData();
    const bookIndex = books.findIndex(b => b.id == req.params.id);
    if (bookIndex === -1) return res.status(404).send('Book not found');
    
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    writeData(books);
    res.redirect('/');
});

// 📌 Delete book
app.post('/deleteBook/:id', (req, res) => {
    let books = readData();
    books = books.filter(b => b.id != req.params.id);
    writeData(books);
    res.redirect('/');
});

// 📌 Add review
app.get('/addReview/:bookId', (req, res) => {
    res.render('addReview', { bookId: req.params.bookId });
});

app.post('/reviews', (req, res) => {
    const reviews = readReviews();
    const newReview = { id: Date.now(), ...req.body };
    reviews.push(newReview);
    writeReviews(reviews);
    res.redirect('/reviews/' + req.body.bookId);
});

// 📌 Read reviews
app.get('/reviews/:bookId', (req, res) => {
    const reviews = readReviews().filter(r => r.bookId == req.params.bookId);
    res.render('reviews', { reviews, bookId: req.params.bookId });
});

// 📌 Delete review
app.post('/deleteReview/:id', (req, res) => {
    let reviews = readReviews();
    reviews = reviews.filter(r => r.id != req.params.id);
    writeReviews(reviews);
    res.redirect('back');
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
