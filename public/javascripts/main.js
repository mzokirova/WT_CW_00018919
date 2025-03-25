document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const bookCards = document.querySelectorAll(".book-card");
  
    searchBar.addEventListener("input", function () {
      const searchTerm = searchBar.value.toLowerCase();
  
      bookCards.forEach(card => {
        const title = card.getAttribute("data-title");
        if (title.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
  
  
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".inline-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission
            if (confirm("Are you sure you want to delete this book?")) {
                fetch(this.action, { method: "POST" }) // Use form's action URL
                    .then(response => {
                        if (response.ok) {
                            location.reload(); // Reload page after deletion
                        } else {
                            return response.text().then(text => { throw new Error(text); });
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-review").forEach(button => {
        button.addEventListener("click", async function (event) {
            event.preventDefault();

            const reviewId = this.getAttribute("data-id");
            const bookId = this.getAttribute("data-book-id");

            const response = await fetch(`/deleteReview/${reviewId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ bookId })
            });

            if (response.ok) {
                // Remove the deleted review from the DOM without refreshing
                document.querySelector(`.review-card[data-id="${reviewId}"]`).remove();
            } else {
                alert("Failed to delete the review. Please try again.");
            }
        });
    });
});
