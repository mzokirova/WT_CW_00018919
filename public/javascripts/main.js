document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-book").forEach(button => {
        button.addEventListener("click", function () {
            const bookId = this.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this book?")) {
                fetch(`/deleteBook/${bookId}`, {
                    method: "POST",
                })
                .then(() => location.reload()) // Reload page after deletion
                .catch(error => console.error("Error:", error));
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-review").forEach(button => {
        button.addEventListener("click", function () {
            const reviewId = this.getAttribute("data-id");
            const bookId = this.getAttribute("data-book-id"); // Get book ID for redirecting

            if (confirm("Are you sure you want to delete this review?")) {
                fetch(`/deleteReview/${reviewId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ bookId })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Failed to delete review");
                })
                .then(() => location.reload()) // Reload page to reflect changes
                .catch(error => console.error("Error:", error));
            }
        });
    });
});