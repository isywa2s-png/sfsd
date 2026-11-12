/* =========================================================
   FIFA WORLD FOOTBALL
   FILTROS.JS - UTILITÁRIOS DE FILTRAGEM E BUSCA
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    setupGlobalSearchFilters();
});

// Configuração geral de filtros e inputs de busca do sistema
function setupGlobalSearchFilters() {
    // Permite que qualquer input com a classe de busca limpe ou reaja se necessário
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
        // Evita comportamento padrão indesejado em formulários de busca
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
}

// Utilitário para normalizar texto (remover acentos para buscas mais flexíveis)
function normalizeText(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

window.normalizeText = normalizeText;