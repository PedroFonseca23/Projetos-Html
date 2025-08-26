// js/state.js
const AppState = {
    users: [],
    posts: [],
    defaultProfilePic: 'https://i.imgur.com/V4RclNb.png', // URL da foto de perfil padrão

    initState() {
        this.users = JSON.parse(localStorage.getItem('cadastros') || '[]');
        this.posts = JSON.parse(localStorage.getItem('posts') || '[]');
        
        // Garante que todos os utilizadores, incluindo os antigos, tenham o campo da foto
        this.users.forEach(user => {
            if (!user.profilePicture) {
                user.profilePicture = this.defaultProfilePic;
            }
        });

        this.initAdmin();
        this.commitUsers(); // Salva as alterações (caso algum user antigo tenha sido atualizado)
    },

    initAdmin() {
        const admin = this.users.find(u => u.usuario === 'admin');
        if (!admin) {
            this.users.push({ 
                usuario: 'admin', 
                cpf: '000.000.000-00', 
                senha: 'admin1234', 
                profilePicture: this.defaultProfilePic 
            });
        } else if (!admin.profilePicture) {
            admin.profilePicture = this.defaultProfilePic;
        }
    },

    commitUsers() {
        localStorage.setItem('cadastros', JSON.stringify(this.users));
    },
    commitPosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    },

    getUsers() {
        return this.users;
    },
    getUser(username) {
        return this.users.find(u => u.usuario === username);
    },
    addUser(newUser) {
        if (this.users.some(u => u.usuario === newUser.usuario || u.cpf === newUser.cpf)) {
            return false;
        }
        newUser.profilePicture = this.defaultProfilePic; // Adiciona a foto padrão no cadastro
        this.users.push(newUser);
        this.commitUsers();
        return true;
    },
    updateUser(username, updatedData) {
        const userIndex = this.users.findIndex(u => u.usuario === username);
        if (userIndex === -1) return false;
        
        this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
        this.commitUsers();
        return this.users[userIndex];
    },

    updateUsernameInPostsAndComments(oldUsername, newUsername) {
        this.posts.forEach(post => {
            if (post.user === oldUsername) post.user = newUsername;
            post.comments.forEach(comment => {
                if (comment.user === oldUsername) comment.user = newUsername;
            });
            const likeIndex = post.likes.indexOf(oldUsername);
            if (likeIndex > -1) post.likes[likeIndex] = newUsername;
        });
        this.commitPosts();
    },

    getPosts() {
        return this.posts;
    },
    getUserPosts(username) {
        return this.posts.filter(p => p.user === username);
    },
    addPost(post) {
        this.posts.push(post);
        this.commitPosts();
    },
    deletePost(postId) {
        this.posts = this.posts.filter(p => p.id !== postId);
        this.commitPosts();
    },
    toggleLike(postId, username) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const likeIndex = post.likes.indexOf(username);
        if (likeIndex === -1) post.likes.push(username);
        else post.likes.splice(likeIndex, 1);
        this.commitPosts();
    },
    addComment(postId, comment) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(comment);
            this.commitPosts();
        }
    }
};

AppState.initState();