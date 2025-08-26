// js/components.js
function createPostCard(post, currentUser) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.id = post.id;
    
    // CORREÇÃO: Pega os dados do autor da publicação para usar a sua foto
    const author = AppState.getUser(post.user);
    const authorProfilePic = author ? author.profilePicture : AppState.defaultProfilePic;

    const isLiked = post.likes.includes(currentUser);
    const likeCount = post.likes.length;
    
    const captionHTML = post.caption ? `<div class="post-caption"><strong>${post.user}</strong> ${post.caption}</div>` : '';
    let commentsHTML = post.comments.map(comment => {
        const commentAuthor = AppState.getUser(comment.user);
        const commentAuthorPic = commentAuthor ? commentAuthor.profilePicture : AppState.defaultProfilePic;
        return `<div class="comment">
                    <img src="${commentAuthorPic}" alt="Foto de ${comment.user}" class="comment-author-pic">
                    <span><strong>${comment.user}:</strong> ${comment.text}</span>
                </div>`;
    }).join('');

    postCard.innerHTML = `
        <div class="post-header">
            <img src="${authorProfilePic}" alt="Foto de ${post.user}" class="profile-icon">
            <span class="username-display">${post.user}</span>
        </div>
        <div class="post-image">
            <img src="${post.imageUrl}" alt="Imagem da publicação">
        </div>
        ${captionHTML}
        <div class="post-actions">
            <span class="icon like-btn ${isLiked ? 'liked' : ''}" data-action="like">&#10084;</span>
            <span class="icon comment-btn" data-action="comment">&#128172;</span>
        </div>
        <div class="post-stats">
            <span>${likeCount} gostos</span>
        </div>
        <div class="post-comments">${commentsHTML}</div>
    `;
    return postCard;
}

// Função de notificação (pode ser usada em várias páginas)
function showToast(message, isError = true) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.innerHTML = `<span class="toast-icon">${isError ? '✖' : '✔'}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}