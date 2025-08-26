// js/perfil.js
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    const elements = {
        profilePicHeader: document.getElementById('profile-picture-header'),
        menuBtn: document.getElementById('menu-btn'),
        sideMenu: document.getElementById('side-menu'),
        overlay: document.getElementById('overlay'),
        logoutBtn: document.getElementById('logout-btn'),
        profilePicProfile: document.getElementById('profile-picture-profile'),
        usernameProfile: document.getElementById('username-profile'),
        postCount: document.getElementById('post-count'),
        postsContainer: document.getElementById('user-posts-container'),
        editProfileBtn: document.getElementById('edit-profile-btn'),
        editModalOverlay: document.getElementById('edit-modal-overlay'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        editForm: document.getElementById('editProfileForm'),
        editUserInput: document.getElementById('editUsuario'),
        editPassInput: document.getElementById('editSenha'),
        editFotoInput: document.getElementById('editFoto'), // NOVO
    };

    function populateUserData() {
        const user = AppState.getUser(sessionStorage.getItem('loggedInUser'));
        if (!user) return; // Segurança extra

        elements.profilePicHeader.src = user.profilePicture;
        elements.profilePicProfile.src = user.profilePicture;
        elements.usernameProfile.textContent = user.usuario;
        elements.editUserInput.value = user.usuario;
        elements.editFotoInput.value = user.profilePicture; // NOVO
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

    const openModal = () => elements.editModalOverlay.classList.add('active');
    const closeModal = () => elements.editModalOverlay.classList.remove('active');
    elements.editProfileBtn.addEventListener('click', openModal);
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.editModalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.editModalOverlay) closeModal();
    });
    elements.editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldUsername = sessionStorage.getItem('loggedInUser');
        const newUsername = elements.editUserInput.value;
        const newPassword = elements.editPassInput.value;
        const newFoto = elements.editFotoInput.value; // NOVO

        if (!newUsername.trim()) return showToast('O nome de utilizador não pode ficar em branco.');
        if (newUsername !== oldUsername && AppState.getUser(newUsername)) return showToast('Este nome de utilizador já está em uso.');
        
        const updatedData = { usuario: newUsername, profilePicture: newFoto };
        if (newPassword) updatedData.senha = newPassword;

        AppState.updateUsernameInPostsAndComments(oldUsername, newUsername);
        const updatedUser = AppState.updateUser(oldUsername, updatedData);

        if (updatedUser) {
            sessionStorage.setItem('loggedInUser', updatedUser.usuario);
            showToast('Perfil atualizado com sucesso!', false);
            closeModal();
            populateUserData();
            renderUserPosts();
        } else {
            showToast('Ocorreu um erro ao atualizar o perfil.');
        }
    });

    function renderUserPosts() {
        elements.postsContainer.innerHTML = '';
        const userPosts = AppState.getUserPosts(loggedInUser);
        elements.postCount.textContent = userPosts.length;

        if (userPosts.length === 0) {
            elements.postsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--cor-texto-secundario);">Ainda não fez nenhuma publicação.</p>';
            return;
        }
        
        userPosts.slice().reverse().forEach(post => {
            const gridItem = document.createElement('div');
            gridItem.className = 'post-grid-item';
            gridItem.innerHTML = `<img src="${post.imageUrl}" alt="Publicação de ${post.user}"><div class="post-grid-overlay"><p>${post.caption || ''}</p></div>`;
            elements.postsContainer.appendChild(gridItem);
        });
    }

    populateUserData();
    renderUserPosts();
});