// js/interface.js
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    // CORREÇÃO: Seleciona os elementos corretos
    const elements = {
        profilePicHeader: document.getElementById('profile-picture-header'),
        username: document.getElementById('username'),
        menuBtn: document.getElementById('menu-btn'),
        sideMenu: document.getElementById('side-menu'),
        overlay: document.getElementById('overlay'),
        logoutBtn: document.getElementById('logout-btn'),
        newPostForm: document.getElementById('newPostForm'),
        postsContainer: document.getElementById('posts-container'),
        imageFileInput: document.getElementById('imageFile'),
        imagePreview: document.getElementById('image-preview'),
        fileInputLabel: document.querySelector('.file-input-label')
    };

    // CORREÇÃO: Carrega os dados completos do utilizador no cabeçalho
    function populateHeader() {
        const user = AppState.getUser(loggedInUser);
        if (user) {
            elements.profilePicHeader.src = user.profilePicture;
            elements.username.textContent = user.usuario;
        }
    }

    const toggleMenu = () => {
        elements.sideMenu.classList.toggle('active');
        elements.overlay.classList.toggle('active');
    };
    elements.menuBtn.addEventListener('click', toggleMenu);
    elements.overlay.addEventListener('click', toggleMenu);

    elements.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    elements.imageFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.imagePreview.src = e.target.result;
                elements.imagePreview.style.display = 'block';
                elements.fileInputLabel.textContent = this.files[0].name;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    elements.newPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = elements.imageFileInput.files[0];
        const caption = document.getElementById('post-caption').value;

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPost = {
                    id: Date.now(),
                    user: loggedInUser,
                    imageUrl: reader.result,
                    caption: caption,
                    likes: [],
                    comments: []
                };
                AppState.addPost(newPost);
                this.reset();
                elements.imagePreview.style.display = 'none';
                elements.fileInputLabel.textContent = 'Clique para selecionar uma imagem';
                renderPosts();
            };
            reader.readAsDataURL(file);
        }
    });

    function renderPosts() {
        const posts = AppState.getPosts();
        elements.postsContainer.innerHTML = '';
        if (posts.length === 0) {
            elements.postsContainer.innerHTML = '<div class="no-posts-message">Ainda não há publicações. Seja o primeiro!</div>';
            return;
        }
        posts.slice().reverse().forEach(post => {
            elements.postsContainer.appendChild(createPostCard(post, loggedInUser));
        });
    }

    elements.postsContainer.addEventListener('click', function(e) {
        const action = e.target.dataset.action;
        if (!action) return;

        const card = e.target.closest('.post-card');
        if (!card) return;

        const postId = Number(card.dataset.id);

        if (action === 'like') {
            AppState.toggleLike(postId, loggedInUser);
        }

        if (action === 'comment') {
            const commentText = prompt("Escreva o seu comentário:");
            if (commentText) {
                const comment = { user: loggedInUser, text: commentText };
                AppState.addComment(postId, comment);
            }
        }
        
        renderPosts();
    });

    // Inicia a página carregando os dados
    populateHeader();
    renderPosts();
});