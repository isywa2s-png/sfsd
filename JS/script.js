/* =========================================================
   FIFA WORLD FOOTBALL
   SCRIPT.JS - NAVEGAÇÃO, MENU MOBILE E CONTROLE GERAL
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    hideLoadingScreen();
    setupNavigation();
    setupMobileMenu();
});

// Oculta a tela de carregamento inicial suavemente
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 400);
    }, 600);
}

// Configura todos os botões de navegação (menu lateral, banner e atalhos)
function setupNavigation() {
    const navTriggers = document.querySelectorAll('[data-page]');
    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetPage = trigger.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
            }
        });
    });
}

// Realiza a troca de página ativa, atualiza menu e breadcrumb
function navigateToPage(pageKey) {
    // Se tentar acessar a administração sem estar logado, abre o modal de login
    if (pageKey === 'administracao' && !window.isAdminAuthenticated) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) loginModal.classList.add('active');
        closeMobileMenu();
        return;
    }

    // Oculta todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Exibe a página solicitada
    const targetSection = document.getElementById(`page-${pageKey}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Atualiza o estado ativo dos itens do menu lateral
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageKey) {
            item.classList.add('active');
        }
    });

    // Atualiza o texto do breadcrumb no cabeçalho
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (breadcrumbCurrent) {
        const pageTitles = {
            inicio: 'Início',
            premiacoes: 'Premiações',
            ranking: 'Ranking',
            campeoes: 'Campeões',
            administracao: 'Painel administrativo'
        };
        breadcrumbCurrent.textContent = pageTitles[pageKey] || 'Início';
    }

    // Fecha o menu mobile se estiver aberto e rola para o topo
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.navigateToPage = navigateToPage;

// Configura abertura e fechamento do menu lateral no mobile
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeMobileMenu);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}