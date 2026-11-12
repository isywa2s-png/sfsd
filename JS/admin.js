/* =========================================================
   FIFA WORLD FOOTBALL
   ADMIN.JS - GESTÃO ADMINISTRATIVA E AUTENTICAÇÃO
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Estado do Administrador
    window.isAdminAuthenticated = localStorage.getItem('fifa_admin_auth') === 'true';

    // Elementos da UI
    const openLoginBtn = document.getElementById('open-login');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const adminLogoutBtn = document.getElementById('admin-logout');
    const adminMenuSection = document.getElementById('admin-menu-section');

    // Garante que o input seja do tipo email e tenha o placeholder correto
if (loginEmailInput) {
    loginEmailInput.setAttribute('type', 'email');
    loginEmailInput.setAttribute('placeholder', 'Digite seu e-mail');
}

    // Como você optou por não usar senha na validação, ocultamos a obrigatoriedade do input de senha se necessário
    if (loginPasswordInput) {
        loginPasswordInput.removeAttribute('required');
        const passwordFieldWrapper = loginPasswordInput.closest('.form-field');
        if (passwordFieldWrapper) {
            passwordFieldWrapper.style.display = 'none';
        }
    }

    // Atualiza visibilidade do menu de administração com base na autenticação
    updateAdminAccess();

    // Abrir Modal de Login
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            if (window.isAdminAuthenticated) {
                window.navigateToPage('administracao');
            } else {
                if (loginModal) loginModal.classList.add('active');
                if (loginEmailInput) loginEmailInput.focus();
            }
        });
    }

    // Fechar Modal ao clicar no botão de fechar ou fora
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('active');
        });
    });

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // Processo de Login do Administrador (Lemos)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailValue = loginEmailInput.value.trim();

            // Validação exata do e-mail de acesso administrativo
            if (emailValue.toLowerCase() === 'lemos11@gmail.com') {
                window.isAdminAuthenticated = true;
                localStorage.setItem('fifa_admin_auth', 'true');

                if (loginError) loginError.classList.remove('active');
                if (loginModal) loginModal.classList.remove('active');

                showToast('Login realizado com sucesso! Bem-vindo, Lemos.', 'success');
                updateAdminAccess();
                window.navigateToPage('administracao');
                loginForm.reset();
            } else {
                if (loginError) {
                    loginError.textContent = 'E-mail incorreto.';
                    loginError.classList.add('active');
                }
            }
        });
    }

    // Logout do Administrador
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            window.isAdminAuthenticated = false;
            localStorage.removeItem('fifa_admin_auth');
            updateAdminAccess();
            window.navigateToPage('inicio');
            showToast('Sessão encerrada com sucesso.', 'info');
        });
    }

    // Navegação entre painéis internos de administração
    document.querySelectorAll('[data-admin-tab]').forEach(card => {
        card.addEventListener('click', () => {
            const tabName = card.getAttribute('data-admin-tab');
            openAdminPanel(tabName);
        });
    });

    document.querySelectorAll('[data-admin-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllAdminPanels();
        });
    });
});

// Função para atualizar a interface com base no status de admin
function updateAdminAccess() {
    const adminMenuSection = document.getElementById('admin-menu-section');
    const openLoginBtn = document.getElementById('open-login');

    if (window.isAdminAuthenticated) {
        if (adminMenuSection) adminMenuSection.style.display = 'block';
        if (openLoginBtn) {
            openLoginBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i><span>Painel Admin</span>';
        }
    } else {
        if (adminMenuSection) adminMenuSection.style.display = 'block';
        if (openLoginBtn) {
            openLoginBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i><span>Área administrativa</span>';
        }
    }
}

// Abrir painel específico de gerenciamento
function openAdminPanel(panelKey) {
    if (!window.isAdminAuthenticated) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) loginModal.classList.add('active');
        return;
    }

    const actionsGrid = document.querySelector('.admin-actions-grid');
    if (actionsGrid) actionsGrid.style.display = 'none';

    document.querySelectorAll('.admin-management-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`admin-panel-${panelKey}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

// Fechar painéis administrativos e retornar à visão geral
function closeAllAdminPanels() {
    document.querySelectorAll('.admin-management-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const actionsGrid = document.querySelector('.admin-actions-grid');
    if (actionsGrid) actionsGrid.style.display = 'grid';
}

// Sistema de Notificações Toast Global
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="toast-content">
            <strong>${type === 'error' ? 'Erro' : type === 'warning' ? 'Atenção' : 'Sucesso'}</strong>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

window.showToast = showToast;