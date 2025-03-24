document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookForm");
    const yearInput = document.getElementById("year");
    const pagesInput = document.getElementById("pages");
    const yearError = document.getElementById("yearError");
    const pagesError = document.getElementById("pagesError");

    form.addEventListener("submit", function (event) {
        let isValid = true;

        // Validate Published Year (between 1000 and 2099)
        const year = parseInt(yearInput.value, 10);
        if (isNaN(year) || year < 1000 || year > 2099) {
            yearError.style.display = "block";
            isValid = false;
        } else {
            yearError.style.display = "none";
        }

        // Validate Pages (must be at least 1)
        const pages = parseInt(pagesInput.value, 10);
        if (isNaN(pages) || pages < 1) {
            pagesError.style.display = "block";
            isValid = false;
        } else {
            pagesError.style.display = "none";
        }

        if (!isValid) {
            event.preventDefault(); // Stop form submission if validation fails
        }
    });
});
