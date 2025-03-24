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