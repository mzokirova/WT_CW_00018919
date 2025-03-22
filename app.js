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
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Helper functions
const readData = () => {
    try{
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }catch (error){
        return[];
    }
};
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
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
    res.render('newBook', { layout: false });
});

app.post('/newBook', (req, res) => {
    const books = readData();
    const newBook = { id: Date.now(), ...req.body };
    books.push(newBook);
    writeData(books);
    res.redirect('/homepage');
});

// 📌 Edit Review
app.get('/editReview/:id', (req, res) => {
    const reviews = readReviews();
    const review = reviews.find(r => r.id == req.params.id);
    if (!review) return res.status(404).send('Review not found');
    res.render('editReview', { review });
});

app.post('/editReview/:id', (req, res) => {
    const reviews = readReviews();
    const reviewIndex = reviews.findIndex(r => r.id == req.params.id);
    if (reviewIndex === -1) return res.status(404).send('Review not found');
    
    reviews[reviewIndex] = { ...reviews[reviewIndex], ...req.body };
    writeReviews(reviews);
    res.redirect('/reviews' + reviews[reviewIndex].bookId);
});

app.delete('/deleteBook/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const result = await Book.findByIdAndDelete(bookId);

        if (!result) {
            return res.status(404).send('Book not found');
        }

        res.status(200).send('Book deleted successfully');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Error deleting book');
    }
});


// 📌 Add review
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
        id: Date.now(),
        bookId: req.body.bookId.toString(), // Convert book ID to string for consistency
        rate: req.body.rate,
        message: req.body.message
    };
    reviews.push(newReview);
    writeReviews(reviews);
    res.redirect("/reviews/" + req.body.bookId); // Redirect to the correct book's reviews
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
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
