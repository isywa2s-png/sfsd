/* =========================================================
   FIFA WORLD FOOTBALL
   CAMPEOES.JS - GESTÃO DO HISTÓRICO DE CAMPEÕES E FILTROS
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    setupChampionFiltersListeners();
});

// Configuração dos ouvintes de eventos para os filtros de campeões
function setupChampionFiltersListeners() {
    const countryFilter = document.getElementById('champion-country-filter');
    const competitionFilter = document.getElementById('champion-competition-filter');
    const searchInput = document.getElementById('champion-search');
    const clearBtn = document.getElementById('clear-champion-filters');

    if (countryFilter) {
        countryFilter.addEventListener('change', () => {
            updateCompetitionOptionsForCountry(countryFilter.value);
            renderChampionsPage();
        });
    }

    if (competitionFilter) {
        competitionFilter.addEventListener('change', () => {
            renderChampionsPage();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderChampionsPage();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (countryFilter) countryFilter.value = 'all';
            if (competitionFilter) {
                competitionFilter.value = 'all';
                competitionFilter.disabled = true;
            }
            if (searchInput) searchInput.value = '';
            renderChampionsPage();
        });
    }
}

// Renderiza a página de campeões completa
function renderChampionsPage() {
    const champions = window.fifaData.champions || [];
    
    // Popula o filtro de países se estiver vazio ou precisar atualizar
    populateCountryFilterOptions(champions);

    // Aplica os filtros atuais
    const filtered = filterChampionsData(champions);

    // Atualiza estatísticas do topo da página
    updateChampionsSummary(filtered, champions);

    // Renderiza o ranking geral de maiores campeões (com base nos filtrados ou total)
    renderAllTimeChampionsRanking(filtered);

    // Renderiza o agrupamento por competições
    renderCompetitionGroups(filtered);
}

window.renderChampionsPage = renderChampionsPage;

// Renderiza os últimos campeões na página Inicial
function renderHomeRecentChampions() {
    const tbody = document.getElementById('home-recent-champions');
    if (!tbody) return;

    const champions = window.fifaData.champions || [];
    if (champions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    Nenhum campeão registrado ainda.
                </td>
            </tr>
        `;
        return;
    }

    // Pega os últimos 5 cadastrados (ou do fim da lista)
    const recent = [...champions].reverse().slice(0, 5);
    let html = '';

    recent.forEach(item => {
        html += `
            <tr>
                <td><strong>${item.country}</strong></td>
                <td>${item.competition}</td>
                <td><strong>${item.winner}</strong></td>
                <td><span class="champion-seasons">${item.season}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

window.renderHomeRecentChampions = renderHomeRecentChampions;

// Popula o select de países/regiões
function populateCountryFilterOptions(champions) {
    const countrySelect = document.getElementById('champion-country-filter');
    if (!countrySelect) return;

    const currentVal = countrySelect.value;
    const countries = [...new Set(champions.map(c => c.country))].sort();

    let html = '<option value="all">Todas as regiões</option>';
    countries.forEach(country => {
        html += `<option value="${country}">${country}</option>`;
    });

    countrySelect.innerHTML = html;
    if (countries.includes(currentVal)) {
        countrySelect.value = currentVal;
    }
}

// Atualiza o select de competições com base no país selecionado
function updateCompetitionOptionsForCountry(selectedCountry) {
    const competitionSelect = document.getElementById('champion-competition-filter');
    if (!competitionSelect) return;

    const champions = window.fifaData.champions || [];

    if (selectedCountry === 'all') {
        competitionSelect.innerHTML = '<option value="all">Todas as competições</option>';
        competitionSelect.disabled = true;
        return;
    }

    const filteredByCountry = champions.filter(c => c.country === selectedCountry);
    const competitions = [...new Set(filteredByCountry.map(c => c.competition))].sort();

    let html = '<option value="all">Todas as competições</option>';
    competitions.forEach(comp => {
        html += `<option value="${comp}">${comp}</option>`;
    });

    competitionSelect.innerHTML = html;
    competitionSelect.disabled = false;
}

// Filtra os dados de campeões com base nos campos de filtro
function filterChampionsData(champions) {
    const countryVal = document.getElementById('champion-country-filter')?.value || 'all';
    const competitionVal = document.getElementById('champion-competition-filter')?.value || 'all';
    const searchVal = document.getElementById('champion-search')?.value.toLowerCase().trim() || '';

    return champions.filter(item => {
        const matchCountry = countryVal === 'all' || item.country === countryVal;
        const matchCompetition = competitionVal === 'all' || item.competition === competitionVal;
        const matchSearch = !searchVal || 
            item.winner.toLowerCase().includes(searchVal) || 
            item.competition.toLowerCase().includes(searchVal) ||
            item.country.toLowerCase().includes(searchVal);

        return matchCountry && matchCompetition && matchSearch;
    });
}

// Atualiza os cartões de resumo da página de campeões
function updateChampionsSummary(filtered, all) {
    const totalTitlesEl = document.getElementById('champions-total-titles');
    const totalWinnersEl = document.getElementById('champions-total-winners');
    const totalCompetitionsEl = document.getElementById('champions-total-competitions');

    if (totalTitlesEl) totalTitlesEl.textContent = filtered.length;

    const uniqueWinners = new Set(filtered.map(item => item.winner));
    if (totalWinnersEl) totalWinnersEl.textContent = uniqueWinners.size;

    const uniqueCompetitions = new Set(filtered.map(item => item.competition));
    if (totalCompetitionsEl) totalCompetitionsEl.textContent = uniqueCompetitions.size;
}

// Renderiza o ranking geral de maiores campeões (quem ganhou mais títulos no filtro)
function renderAllTimeChampionsRanking(filtered) {
    const tbody = document.getElementById('champions-all-time-ranking');
    if (!tbody) return;

    const winnerStats = {};
    filtered.forEach(item => {
        const winner = item.winner;
        if (!winnerStats[winner]) {
            winnerStats[winner] = { count: 0, seasons: [] };
        }
        winnerStats[winner].count++;
        winnerStats[winner].seasons.push(`${item.competition} (${item.season})`);
    });

    const ranking = Object.keys(winnerStats).map(name => ({
        name,
        count: winnerStats[name].count,
        seasons: winnerStats[name].seasons.join(', ')
    })).sort((a, b) => b.count - a.count);

    if (ranking.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">Nenhum título encontrado com os filtros selecionados.</td>
            </tr>
        `;
        return;
    }

    let html = '';
    ranking.forEach((row, index) => {
        let posClass = '';
        if (index === 0) posClass = 'first';
        else if (index === 1) posClass = 'second';
        else if (index === 2) posClass = 'third';

        html += `
            <tr>
                <td><span class="champion-rank-position ${posClass}">${index + 1}º</span></td>
                <td><strong>${row.name}</strong></td>
                <td><span class="champion-titles-count">${row.count} ${row.count === 1 ? 'título' : 'títulos'}</span></td>
                <td><span class="champion-seasons">${row.seasons}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Renderiza o agrupamento de campeões por competição
function renderCompetitionGroups(filtered) {
    const container = document.getElementById('champions-competition-groups');
    if (!container) return;

    const compGroups = {};
    filtered.forEach(item => {
        const comp = item.competition;
        if (!compGroups[comp]) {
            compGroups[comp] = [];
        }
        compGroups[comp].push(item);
    });

    const competitions = Object.keys(compGroups).sort();

    if (competitions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                Nenhuma competição encontrada.
            </div>
        `;
        return;
    }

    let html = '';
    competitions.forEach(comp => {
        const items = compGroups[comp];
        const country = items[0].country;

        // Conta vencedores nesta competição
        const winnerCounts = {};
        items.forEach(i => {
            winnerCounts[i.winner] = (winnerCounts[i.winner] || 0) + 1;
        });

        const sortedWinners = Object.keys(winnerCounts).map(w => ({
            name: w,
            count: winnerCounts[w]
        })).sort((a, b) => b.count - a.count);

        html += `
            <div class="competition-group">
                <div class="competition-group-header">
                    <div>
                        <h3>${comp}</h3>
                        <span>Região: ${country} • Total de edições: ${items.length}</span>
                    </div>
                    <span class="ranking-limit">${items.length} ${items.length === 1 ? 'edição' : 'edições'}</span>
                </div>
                <div class="competition-group-content">
        `;

        sortedWinners.forEach(w => {
            html += `
                <div class="competition-champion-row">
                    <div class="competition-champion-name"><strong>${w.name}</strong></div>
                    <div class="competition-champion-count">${w.count} ${w.count === 1 ? 'título' : 'títulos'}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}