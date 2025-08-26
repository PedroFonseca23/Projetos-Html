// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa um utilizador admin se não existir (melhor que hardcoded)
    const inicializarAdmin = () => {
        const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]');
        const adminExiste = cadastros.some(c => c.usuario === 'admin');
        if (!adminExiste) {
            cadastros.push({ usuario: 'admin', cpf: '000.000.000-00', senha: 'admin1234' });
            localStorage.setItem('cadastros', JSON.stringify(cadastros));
        }
    };
    
    inicializarAdmin();

    const loginContainer = document.getElementById('login-container');
    const cadastroContainer = document.getElementById('cadastro-container');
    const showCadastroLink = document.getElementById('show-cadastro');
    const showLoginLink = document.getElementById('show-login');
    const cadCpfInput = document.getElementById('cadCpf');

    // Funções para trocar de formulário
    showCadastroLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        cadastroContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        cadastroContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Máscara e Validação de CPF em tempo real
    cadCpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Lógica do formulário de Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        
        const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]');
        const usuarioEncontrado = cadastros.find(c => c.usuario === usuario && c.senha === senha);

        if (usuarioEncontrado) {
            sessionStorage.setItem('loggedInUser', usuario);
            showToast('Login realizado com sucesso!', false);
            const redirectUrl = usuario === 'admin' ? 'admin.html' : 'interface.html';
            setTimeout(() => { window.location.href = redirectUrl; }, 1500);
        } else {
            showToast('Utilizador ou senha incorretos!');
        }
    });

    // Lógica do formulário de Cadastro
    document.getElementById('cadastroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('cadUsuario').value;
        const cpf = document.getElementById('cadCpf').value;
        const senha = document.getElementById('cadSenha').value;
        const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]');
        
        if (cadastros.some(c => c.usuario === usuario)) {
            showToast('Este nome de utilizador já existe.');
            return;
        }
        
        if (cadastros.some(c => c.cpf === cpf)) {
            showToast('Este CPF já está cadastrado.');
            return;
        }

        cadastros.push({ usuario, cpf, senha });
        localStorage.setItem('cadastros', JSON.stringify(cadastros));
        
        showToast('Cadastro realizado com sucesso!', false);
        
        setTimeout(() => {
            showLoginLink.click(); // Simula o clique para voltar ao login
            document.getElementById('cadastroForm').reset();
        }, 2000);
    });

    // Função de notificação (Toast)
    function showToast(message, isError = true) {
        const toastContainer = document.getElementById('toast-container');
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
});
