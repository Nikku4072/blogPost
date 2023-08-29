// public/script.js
document.addEventListener('DOMContentLoaded', function () {
    const blogForm = document.getElementById('blogForm');
    const blogList = document.getElementById('blogList');
    const clearAllButton = document.getElementById('clearAllButton');

    // Load blogs from local storage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    savedBlogs.forEach(blog => {
        const blogItem = createBlogItem(blog.title, blog.content, blog.comments);
        blogList.appendChild(blogItem);
    });

    blogForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        const blogItem = createBlogItem(title, content, []);
        blogList.appendChild(blogItem);

        // Save blog to local storage
        savedBlogs.push({ title, content, comments: [] });
        localStorage.setItem('blogs', JSON.stringify(savedBlogs));

        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
    });

    clearAllButton.addEventListener('click', () => {
        // Clear the 'blogs' key from local storage
        localStorage.removeItem('blogs');

        // Clear the displayed blog list
        blogList.innerHTML = '';
    });

    function createBlogItem(title, content, comments) {
        const blogItem = document.createElement('div');
        blogItem.classList.add('blog-block');
        blogItem.innerHTML = `
            <div class="blog-title">${title}</div>
            <div class="blog-content">${content}</div>
            <div class="comment-section">
                <h3>Add Your Review</h3>
                <form class="commentForm" action="/comment" method="post">
                    <input type="text" name="comment" placeholder="Add a comment" required>
                    <button type="submit">Add Comment</button>
                </form>
                <h3>Comments</h3>
                <ul class="existingComments"></ul>
            </div>
        `;

        const commentForm = blogItem.querySelector('.commentForm');
        const existingCommentsList = blogItem.querySelector('.existingComments');

        // Toggle content visibility on title click
        const titleElement = blogItem.querySelector('.blog-title');
        titleElement.addEventListener('click', () => {
            const contentElement = blogItem.querySelector('.blog-content');
            const commentsSection = blogItem.querySelector('.comment-section');
            if (contentElement.style.display === 'none') {
                contentElement.style.display = 'block';
                commentsSection.style.display = 'block';
            } else {
                contentElement.style.display = 'none';
                commentsSection.style.display = 'none';
            }
        });

        comments.forEach(comment => {
            addComment(blogItem, comment);
        });

        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const commentInput = commentForm.querySelector('input[name="comment"]');
            const comment = commentInput.value;
            if (comment.trim() !== '') {
                addComment(blogItem, comment);

                // Save comment to local storage
                const blogIndex = savedBlogs.findIndex(blog => blog.title === title);
                savedBlogs[blogIndex].comments.push(comment);
                localStorage.setItem('blogs', JSON.stringify(savedBlogs));

                commentInput.value = ''; // Clear the input field
            }
        });

        return blogItem;
    }

    function addComment(blogItem, comment) {
        const existingCommentsList = blogItem.querySelector('.existingComments');
        const listItem = document.createElement('li');
        listItem.textContent = comment;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            const blogIndex = savedBlogs.findIndex(blog => blog.title === title);
            const commentIndex = savedBlogs[blogIndex].comments.indexOf(comment);
            if (commentIndex !== -1) {
                savedBlogs[blogIndex].comments.splice(commentIndex, 1);
                localStorage.setItem('blogs', JSON.stringify(savedBlogs));
            }
        });
        listItem.appendChild(deleteButton);
        existingCommentsList.appendChild(listItem);
    }
});
