document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', async (event) => {
            const bookId = event.target.dataset.id;
            if (confirm('Are you sure?')) {
                const response = await fetch(`/deleteBook/${bookId}`, {
                    method: 'DELETE',
                });
                if (response.ok) location.reload();
                else alert('Delete failed');
            }
        });
    });
});
