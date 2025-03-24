const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = './data.json';
const REVIEWS_FILE = './reviews.json';

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON data
app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Helper functions
const readData = () => {
    try{
        if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }catch (error){
        console.error("Error reading data.json:", error);
        return[];
    }
};
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data.json:", error);
    }
}
const readReviews = () => {
    try {
        if (!fs.existsSync(REVIEWS_FILE)) {
            fs.writeFileSync(REVIEWS_FILE, JSON.stringify([])); // Create an empty array
        }
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading reviews.json:', error);
        return [];
    }
};
const writeReviews = (data) => fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));
    

//  Homepage
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/homepage', (req, res) => {
    const books = readData();
    res.render('homepage', {books});
});

app.get('/editBook/:id',(req, res) =>{
    const books = readData();
    const book = books.find(b => b.id.toString() === req.params.id);
    if(!book) 
        {
            return res.status(404).send('Book not found');
        }
    res.render('editBook', {book});
});

app.post('/editBook/:id', (req, res) => {
    const books = readData();
    const bookIndex = books.findIndex(b => b.id.toString() === req.params.id);

    if(bookIndex === -1) return res.status(404).send('Book not found');

    books[bookIndex] = { ...books[bookIndex], ...req.body};
    writeData(books);

    res.redirect('homepage');
})

app.post("/updateBook/:id", (req, res) => {
    const books = readData();
    const bookIndex = books.findIndex(b => b.id.toString() === req.params.id);

    if(bookIndex === -1) return res.status(404).send("Book not found");

    books[bookIndex] = { ...books[bookIndex], ...req.body};
    writeData(books);

    res.redirect("/homepage");
});
// 📌 Add new book
app.get('/newBook', (req, res) => {
    res.render('newBook', { layout: false });
});

app.post('/newBook', (req, res) => {
    const books = readData();
    const newBook = { id: Date.now(), ...req.body };
    books.push(newBook);
    writeData(books);
    res.redirect('/homepage');
});

// Edit Review
app.get('/editReview/:id', (req, res) => {
    const reviews = readReviews();
    const review = reviews.find(r => r.id.toString() === req.params.id);
    if (!review) {
        return res.status(404).send('Review not found');
    }
    res.render('editReview', { review });
});

app.post('/editReview/:id', (req, res) => {
    const reviews = readReviews();
    const reviewIndex = reviews.findIndex(r => r.id == req.params.id);
    if (reviewIndex === -1) return res.status(404).send('Review not found');
    
    reviews[reviewIndex] = { ...reviews[reviewIndex], ...req.body };
    writeReviews(reviews);
    res.redirect('/reviews/' + reviews[reviewIndex].bookId);
});
app.post("/deleteBook/:id", (req, res) => {
    let books = readData();
    books = books.filter(book => book.id.toString() !== req.params.id); 
    writeData(books);
    res.redirect('/homepage'); 
})
// Add review
app.get('/addReview/:bookId', (req, res) => {
    if (!req.params.bookId) {
        return res.status(400).send("Invalid book ID");
    }
    console.log("Opening Review Form for Book ID:", req.params.bookId);
    res.render('addReview', { bookId: req.params.bookId, layout: false });
});

app.post("/reviews", (req, res) => {
    const reviews = readReviews();
    const newReview = {
        id: Date.now().toString(),
        bookId: req.body.bookId.toString(), // Convert book ID to string for consistency
        rate: req.body.rate,
        message: req.body.message
    };
    reviews.push(newReview);
    writeReviews(reviews);
    res.redirect("/reviews/" + req.body.bookId); // Redirect to the correct book's reviews
});

//  Read reviews
app.get('/reviews/:bookId', (req, res) => {
    const reviews = readReviews().filter(r => r.bookId == req.params.bookId);
    res.render('reviews', { reviews, bookId: req.params.bookId });
});

//  Delete review
app.post('/deleteReview/:id', (req, res) => {
    let reviews = readReviews();
    reviews = reviews.filter(r => r.id != req.params.id);
    writeReviews(reviews);
    res.redirect('back');
});

// Start server
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
