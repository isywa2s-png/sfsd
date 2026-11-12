/* =========================================================
   FIFA WORLD FOOTBALL
   PAINEL.JS - GERENCIAMENTO DE DADOS E INTEGRAÇÃO SUPABASE
   Desenvolvido por Lemos
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    fetchAllData();
    setupAdminForms();
});

window.fifaData = {
    awards: [],
    clubs: [],
    nationals: [],
    champions: []
};

async function fetchAllData() {
    if (!window.supabaseClient) {
        console.warn('Cliente Supabase não inicializado.');
        return;
    }

    try {
        const { data: awardsData } = await window.supabaseClient.from('awards').select('*');
        window.fifaData.awards = awardsData || [];

        const { data: clubsData } = await window.supabaseClient.from('clubs').select('*');
        window.fifaData.clubs = clubsData || [];

        const { data: nationalsData } = await window.supabaseClient.from('nationals').select('*');
        window.fifaData.nationals = nationalsData || [];

        const { data: championsData } = await window.supabaseClient.from('champions').select('*');
        window.fifaData.champions = championsData || [];

        updateAllUI();
    } catch (error) {
        console.error('Erro ao buscar dados do Supabase:', error);
    }
}

window.fetchAllData = fetchAllData;

function updateAllUI() {
    updateStatisticsCounters();

    if (typeof window.renderHomeRecentChampions === 'function') window.renderHomeRecentChampions();
    if (typeof window.renderHomeRankings === 'function') window.renderHomeRankings();
    if (typeof window.renderAwardsPage === 'function') window.renderAwardsPage();
    if (typeof window.renderRankingPage === 'function') window.renderRankingPage();
    if (typeof window.renderChampionsPage === 'function') window.renderChampionsPage();
    if (typeof window.renderAdminRecords === 'function') window.renderAdminRecords();
}

window.updateAllUI = updateAllUI;

function updateStatisticsCounters() {
    const totalAwards = window.fifaData.awards.length;
    const totalChampions = window.fifaData.champions.length;
    const totalClubs = window.fifaData.clubs.length;
    const totalNations = window.fifaData.nationals.length;

    setElementText('stat-premiacoes', totalAwards);
    setElementText('stat-campeoes', totalChampions);
    setElementText('stat-clubes', totalClubs);
    setElementText('stat-selecoes', totalNations);

    setElementText('admin-stat-awards', totalAwards);
    setElementText('admin-stat-champions', totalChampions);
    setElementText('admin-stat-clubs', totalClubs);
    setElementText('admin-stat-nations', totalNations);
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setupAdminForms() {
    // 1. Premiações
    const awardForm = document.getElementById('award-form');
    if (awardForm) {
        awardForm.onsubmit = async (e) => {
            e.preventDefault(); // Impede o recarregamento da página (F5)
            if (!checkAdminPermission()) return;

            const newAward = {
                award_type: document.getElementById('award-type').value,
                season: document.getElementById('award-season').value.trim(),
                first: document.getElementById('award-first').value.trim(),
                second: document.getElementById('award-second').value.trim(),
                third: document.getElementById('award-third').value.trim(),
                fourth: document.getElementById('award-fourth').value.trim(),
                fifth: document.getElementById('award-fifth').value.trim()
            };

            const { error } = await window.supabaseClient.from('awards').insert([newAward]);
            if (error) {
                showToast('Erro ao salvar premiação: ' + error.message, 'error');
            } else {
                showToast('Premiação salva com sucesso!', 'success');
                awardForm.reset();
                fetchAllData();
            }
        };
    }

    // 2. Clubes
    const clubForm = document.getElementById('club-form');
    if (clubForm) {
        clubForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!checkAdminPermission()) return;

            const newClub = {
                name: document.getElementById('club-name').value.trim(),
                points: parseFloat(document.getElementById('club-points').value) || 0
            };

            const { error } = await window.supabaseClient.from('clubs').insert([newClub]);
            if (error) {
                showToast('Erro ao salvar clube: ' + error.message, 'error');
            } else {
                showToast('Clube adicionado com sucesso!', 'success');
                clubForm.reset();
                fetchAllData();
            }
        };
    }

    // 3. Seleções
    const nationalForm = document.getElementById('national-form');
    if (nationalForm) {
        nationalForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!checkAdminPermission()) return;

            const newNational = {
                name: document.getElementById('national-name').value.trim(),
                points: parseFloat(document.getElementById('national-points').value) || 0
            };

            const { error } = await window.supabaseClient.from('nationals').insert([newNational]);
            if (error) {
                showToast('Erro ao salvar seleção: ' + error.message, 'error');
            } else {
                showToast('Seleção adicionada com sucesso!', 'success');
                nationalForm.reset();
                fetchAllData();
            }
        };
    }

    // 4. Campeões
    const championForm = document.getElementById('champion-form');
    if (championForm) {
        championForm.onsubmit = async (e) => {
            e.preventDefault();
            if (!checkAdminPermission()) return;

            const newChampion = {
                country: document.getElementById('champion-country').value.trim(),
                competition: document.getElementById('champion-competition').value.trim(),
                winner: document.getElementById('champion-winner').value.trim(),
                season: document.getElementById('champion-season').value.trim()
            };

            const { error } = await window.supabaseClient.from('champions').insert([newChampion]);
            if (error) {
                showToast('Erro ao registrar campeão: ' + error.message, 'error');
            } else {
                showToast('Campeão registrado com sucesso!', 'success');
                championForm.reset();
                fetchAllData();
            }
        };
    }
}

function checkAdminPermission() {
    if (!window.isAdminAuthenticated) {
        showToast('Acesso negado. Apenas o administrador Lemos pode realizar alterações.', 'error');
        const loginModal = document.getElementById('login-modal');
        if (loginModal) loginModal.classList.add('active');
        return false;
    }
    return true;
}

async function deleteRecord(table, id) {
    if (!checkAdminPermission()) return;
    if (!confirm('Tem certeza de que deseja remover este registro?')) return;

    const { error } = await window.supabaseClient.from(table).delete().eq('id', id);

    if (error) {
        showToast('Erro ao remover registro: ' + error.message, 'error');
    } else {
        showToast('Registro removido com sucesso!', 'success');
        fetchAllData();
    }
}

window.deleteRecord = deleteRecord;