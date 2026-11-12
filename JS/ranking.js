/* =========================================================
   FIFA WORLD FOOTBALL
   RANKING.JS - GESTÃO DOS RANKINGS DE CLUBES E SELEÇÕES
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    setupRankingTabs();
});

// Configuração das abas de ranking (Clubes x Seleções)
function setupRankingTabs() {
    const tabs = document.querySelectorAll('.ranking-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetKey = tab.getAttribute('data-ranking');
            document.querySelectorAll('.ranking-content').forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(`ranking-${targetKey}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Renderiza a página de rankings e prévias na Home
function renderRankingPage() {
    renderClubRanking();
    renderNationalRanking();
    renderHomeRankings();
}

window.renderRankingPage = renderRankingPage;

// Renderiza o Top 10 de Clubes
function renderClubRanking() {
    const clubListContainer = document.getElementById('club-ranking-list');
    if (!clubListContainer) return;

    const clubs = [...(window.fifaData.clubs || [])];
    // Ordena do maior para o menor em pontuação
    clubs.sort((a, b) => b.points - a.points);

    // Pega apenas o Top 10
    const top10 = clubs.slice(0, 10);

    if (top10.length === 0) {
        clubListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-shield"></i>
                Nenhum clube registrado no ranking.
            </div>
        `;
        return;
    }

    let html = '';
    top10.forEach((club, index) => {
        let posClass = '';
        if (index === 0) posClass = 'first';
        else if (index === 1) posClass = 'second';
        else if (index === 2) posClass = 'third';

        html += `
            <div class="ranking-row">
                <div class="ranking-row-position ${posClass}">${index + 1}º</div>
                <div class="ranking-row-name">${club.name}</div>
                <div class="ranking-row-points">${club.points} P</div>
            </div>
        `;
    });

    clubListContainer.innerHTML = html;
}

// Renderiza o Top 10 de Seleções
function renderNationalRanking() {
    const nationalListContainer = document.getElementById('national-ranking-list');
    if (!nationalListContainer) return;

    const nationals = [...(window.fifaData.nationals || [])];
    nationals.sort((a, b) => b.points - a.points);

    const top10 = nationals.slice(0, 10);

    if (top10.length === 0) {
        nationalListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-earth-americas"></i>
                Nenhuma seleção registrada no ranking.
            </div>
        `;
        return;
    }

    let html = '';
    top10.forEach((nat, index) => {
        let posClass = '';
        if (index === 0) posClass = 'first';
        else if (index === 1) posClass = 'second';
        else if (index === 2) posClass = 'third';

        html += `
            <div class="ranking-row">
                <div class="ranking-row-position ${posClass}">${index + 1}º</div>
                <div class="ranking-row-name">${nat.name}</div>
                <div class="ranking-row-points">${nat.points} P</div>
            </div>
        `;
    });

    nationalListContainer.innerHTML = html;
}

// Renderiza as prévias dos rankings na página Inicial
function renderHomeRankings() {
    // Clubes Home (Top 5 para prévia)
    const homeClubContainer = document.getElementById('home-club-ranking');
    if (homeClubContainer) {
        const clubs = [...(window.fifaData.clubs || [])].sort((a, b) => b.points - a.points).slice(0, 5);
        if (clubs.length === 0) {
            homeClubContainer.innerHTML = `<div class="empty-state" style="padding:15px !important;">Nenhum clube registrado.</div>`;
        } else {
            let html = '';
            clubs.forEach((club, index) => {
                html += `
                    <div class="ranking-preview-item">
                        <div class="ranking-position">${index + 1}º</div>
                        <div class="ranking-preview-name">${club.name}</div>
                        <div class="ranking-preview-points">${club.points} P</div>
                    </div>
                `;
            });
            homeClubContainer.innerHTML = html;
        }
    }

    // Seleções Home (Top 5 para prévia)
    const homeNatContainer = document.getElementById('home-national-ranking');
    if (homeNatContainer) {
        const nationals = [...(window.fifaData.nationals || [])].sort((a, b) => b.points - a.points).slice(0, 5);
        if (nationals.length === 0) {
            homeNatContainer.innerHTML = `<div class="empty-state" style="padding:15px !important;">Nenhuma seleção registrada.</div>`;
        } else {
            let html = '';
            nationals.forEach((nat, index) => {
                html += `
                    <div class="ranking-preview-item">
                        <div class="ranking-position">${index + 1}º</div>
                        <div class="ranking-preview-name">${nat.name}</div>
                        <div class="ranking-preview-points">${nat.points} P</div>
                    </div>
                `;
            });
            homeNatContainer.innerHTML = html;
        }
    }
}

window.renderHomeRankings = renderHomeRankings;