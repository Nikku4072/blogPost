
let contentFetched = false;

async function fetchAndDisplay() {
    if (!contentFetched) {
        const response = await fetch('/');
        const content = await response.text();
        document.getElementById('blogList').innerHTML = content;

    
        const commentForms = document.querySelectorAll('.commentForm');
        commentForms.forEach((form, postId) => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const formData = new FormData(form);
                const comment = formData.get('comment');

                if (comment.trim() !== '') {
                    const commentResponse = await fetch(`/comment/${postId}`, {
                        method: 'POST',
                        body: new URLSearchParams({ comment }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    if (commentResponse.ok) {
                        fetchAndDisplay(); 
                    }
                }
            });
        });

        contentFetched = true;
    }
}

// Call the fetchAndDisplay function when the page loads
window.onload = fetchAndDisplay;
