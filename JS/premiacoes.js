/* =========================================================
   FIFA WORLD FOOTBALL
   PREMIACOES.JS - GESTÃO E EXIBIÇÃO DAS PREMIAÇÕES
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    setupAwardTabs();
    setupAwardSeasonFilter();
});

let currentSelectedAward = 'bola-ouro';

function setupAwardTabs() {
    const tabs = document.querySelectorAll('.award-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSelectedAward = tab.getAttribute('data-award');
            renderAwardsPage();
        });
    });
}

function setupAwardSeasonFilter() {
    const seasonSelect = document.getElementById('award-season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            renderAwardTopFiveAndCurrent();
        });
    }
}

function renderAwardsPage() {
    const awards = window.fifaData.awards || [];
    
    const filteredAwards = awards.filter(a => {
        if (!a.award_type) return false;
        const normalizedType = a.award_type.toLowerCase().trim().replace(/\s+/g, '-');
        const targetNormalized = currentSelectedAward.toLowerCase().trim().replace(/\s+/g, '-');
        return normalizedType === targetNormalized;
    });

    populateAwardSeasonSelect(filteredAwards);
    renderAwardTopFiveAndCurrent();
    renderAwardHistoryTable(filteredAwards);
    renderAwardWinnersRanking(filteredAwards);
}

window.renderAwardsPage = renderAwardsPage;

function populateAwardSeasonSelect(filteredAwards) {
    const seasonSelect = document.getElementById('award-season-filter');
    if (!seasonSelect) return;

    const currentVal = seasonSelect.value;
    seasonSelect.innerHTML = '<option value="all">Mais recente</option>';

    const seasons = [...new Set(filteredAwards.map(a => a.season))].sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonSelect.appendChild(option);
    });

    if (seasons.includes(currentVal)) {
        seasonSelect.value = currentVal;
    }
}

function renderAwardTopFiveAndCurrent() {
    const awards = window.fifaData.awards || [];
    const filteredAwards = awards.filter(a => {
        if (!a.award_type) return false;
        const normalizedType = a.award_type.toLowerCase().trim().replace(/\s+/g, '-');
        const targetNormalized = currentSelectedAward.toLowerCase().trim().replace(/\s+/g, '-');
        return normalizedType === targetNormalized;
    });

    const seasonSelect = document.getElementById('award-season-filter');
    const selectedSeason = seasonSelect ? seasonSelect.value : 'all';

    let targetAward = null;
    if (filteredAwards.length > 0) {
        const sorted = [...filteredAwards].sort((a, b) => {
            const numA = parseInt(a.season.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.season.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        if (selectedSeason === 'all') {
            targetAward = sorted[sorted.length - 1];
        } else {
            targetAward = filteredAwards.find(a => a.season === selectedSeason);
        }
    }

    const awardMeta = {
        'bola-ouro': { name: 'Bola de Ouro', trophy: '🏆' },
        'the-best': { name: 'The Best', trophy: '🌟' },
        'chuteira-ouro': { name: 'Chuteira de Ouro', trophy: '👟' },
        'luva-ouro': { name: 'Luva de Ouro', trophy: '🧤' },
        'rei-america': { name: 'Rei da América', trophy: '👑' }
    };

    const meta = awardMeta[currentSelectedAward] || { name: 'Premiação', trophy: '🏆' };

    const nameEl = document.getElementById('current-award-name');
    const playerEl = document.getElementById('current-award-player');
    const seasonEl = document.getElementById('current-award-season');
    const trophyEl = document.querySelector('.current-award-trophy');

    if (nameEl) nameEl.textContent = meta.name;
    if (trophyEl) trophyEl.textContent = meta.trophy;

    if (targetAward) {
        if (playerEl) playerEl.textContent = targetAward.first || 'Não informado';
        if (seasonEl) seasonEl.textContent = `Temporada: ${targetAward.season}`;
    } else {
        if (playerEl) playerEl.textContent = 'Aguardando vencedor';
        if (seasonEl) seasonEl.textContent = 'Temporada não registrada';
    }

    const topFiveContainer = document.getElementById('award-top-five');
    if (!topFiveContainer) return;

    if (!targetAward) {
        topFiveContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-trophy"></i>
                Nenhuma premiação cadastrada nesta categoria.
            </div>
        `;
        return;
    }

    const positions = [
        { label: '1º Colocado', player: targetAward.first, medal: '🥇', bg: '#FFF2CE', color: '#B27A13' },
        { label: '2º Colocado', player: targetAward.second, medal: '🥈', bg: '#EDF0F4', color: '#6F7C8D' },
        { label: '3º Colocado', player: targetAward.third, medal: '🥉', bg: '#FCE9D8', color: '#AD7040' },
        { label: '4º Colocado', player: targetAward.fourth, medal: '4º', bg: '#EDF4FA', color: '#176BC1' },
        { label: '5º Colocado', player: targetAward.fifth, medal: '5º', bg: '#EDF4FA', color: '#176BC1' }
    ];

    let html = '';
    positions.forEach(pos => {
        if (pos.player && pos.player.trim() !== '') {
            html += `
                <div class="award-position-item">
                    <div class="award-position-medal" style="background: ${pos.bg}; color: ${pos.color};">
                        ${pos.medal}
                    </div>
                    <div class="award-position-name">${pos.player}</div>
                    <div class="award-position-number">${pos.label}</div>
                </div>
            `;
        }
    });

    topFiveContainer.innerHTML = html || '<div class="empty-state">Nenhum colocado registrado.</div>';
}

function renderAwardHistoryTable(filteredAwards) {
    const tbody = document.getElementById('award-history');
    if (!tbody) return;

    if (filteredAwards.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">Nenhum histórico disponível.</td>
            </tr>
        `;
        return;
    }

    const sorted = [...filteredAwards].sort((a, b) => {
        const numA = parseInt(a.season.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.season.replace(/\D/g, '')) || 0;
        return numB - numA;
    });

    let html = '';
    sorted.forEach(item => {
        html += `
            <tr>
                <td><strong>${item.season}</strong></td>
                <td>🥇 ${item.first || '-'}</td>
                <td>🥈 ${item.second || '-'}</td>
                <td>🥉 ${item.third || '-'}</td>
                <td>${item.fourth || '-'}</td>
                <td>${item.fifth || '-'}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderAwardWinnersRanking(filteredAwards) {
    const tbody = document.getElementById('award-winners-ranking');
    if (!tbody) return;

    const winnerCounts = {};
    filteredAwards.forEach(item => {
        const winner = item.first;
        if (winner && winner.trim() !== '') {
            if (!winnerCounts[winner]) {
                winnerCounts[winner] = { count: 0, seasons: [] };
            }
            winnerCounts[winner].count++;
            winnerCounts[winner].seasons.push(item.season);
        }
    });

    const rankingArray = Object.keys(winnerCounts).map(name => ({
        name,
        count: winnerCounts[name].count,
        seasons: winnerCounts[name].seasons.sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.replace(/\D/g, '')) || 0;
            return numA - numB;
        }).join(', ')
    })).sort((a, b) => b.count - a.count);

    if (rankingArray.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">Nenhum vencedor registrado.</td>
            </tr>
        `;
        return;
    }

    let html = '';
    rankingArray.forEach((row, index) => {
        let posClass = '';
        if (index === 0) posClass = 'first';
        else if (index === 1) posClass = 'second';
        else if (index === 2) posClass = 'third';

        html += `
            <tr>
                <td>
                    <span class="ranking-row-position ${posClass}">${index + 1}º</span>
                </td>
                <td><strong>${row.name}</strong></td>
                <td><span class="champion-titles-count">${row.count} ${row.count === 1 ? 'título' : 'títulos'}</span></td>
                <td><span class="champion-seasons">${row.seasons}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderAdminRecords() {
    const awardRecordsTbody = document.getElementById('admin-award-records');
    if (awardRecordsTbody) {
        const awards = window.fifaData.awards || [];
        if (awards.length === 0) {
            awardRecordsTbody.innerHTML = `<tr><td colspan="4" class="empty-state">Nenhuma premiação cadastrada.</td></tr>`;
        } else {
            let html = '';
            awards.forEach(item => {
                html += `
                    <tr>
                        <td>${item.award_type}</td>
                        <td>${item.season}</td>
                        <td>${item.first}</td>
                        <td>
                            <button class="table-action-button delete" onclick="deleteRecord('awards', '${item.id}')" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            awardRecordsTbody.innerHTML = html;
        }
    }

    const clubRecordsTbody = document.getElementById('admin-club-records');
    if (clubRecordsTbody) {
        const clubs = window.fifaData.clubs || [];
        if (clubs.length === 0) {
            clubRecordsTbody.innerHTML = `<tr><td colspan="3" class="empty-state">Nenhum clube cadastrado.</td></tr>`;
        } else {
            let html = '';
            clubs.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td><strong>${item.points} P</strong></td>
                        <td>
                            <button class="table-action-button delete" onclick="deleteRecord('clubs', '${item.id}')" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            clubRecordsTbody.innerHTML = html;
        }
    }

    const nationalRecordsTbody = document.getElementById('admin-national-records');
    if (nationalRecordsTbody) {
        const nationals = window.fifaData.nationals || [];
        if (nationals.length === 0) {
            nationalRecordsTbody.innerHTML = `<tr><td colspan="3" class="empty-state">Nenhuma seleção cadastrada.</td></tr>`;
        } else {
            let html = '';
            nationals.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td><strong>${item.points} P</strong></td>
                        <td>
                            <button class="table-action-button delete" onclick="deleteRecord('nationals', '${item.id}')" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            nationalRecordsTbody.innerHTML = html;
        }
    }

    const championRecordsTbody = document.getElementById('admin-champion-records');
    if (championRecordsTbody) {
        const champions = window.fifaData.champions || [];
        if (champions.length === 0) {
            championRecordsTbody.innerHTML = `<tr><td colspan="5" class="empty-state">Nenhum campeão cadastrado.</td></tr>`;
        } else {
            let html = '';
            champions.forEach(item => {
                html += `
                    <tr>
                        <td>${item.country}</td>
                        <td>${item.competition}</td>
                        <td><strong>${item.winner}</strong></td>
                        <td>${item.season}</td>
                        <td>
                            <button class="table-action-button delete" onclick="deleteRecord('champions', '${item.id}')" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            championRecordsTbody.innerHTML = html;
        }
    }
}

window.renderAdminRecords = renderAdminRecords;