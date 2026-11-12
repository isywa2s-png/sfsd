/* =========================================================
   FIFA WORLD FOOTBALL
   SUPABASE.JS - CONFIGURAÇÃO E CONEXÃO
   Desenvolvido por Lemos
   ========================================================= */

// Credenciais do Supabase fornecidas
const SUPABASE_URL = 'https://uoymstpjiahqxbqbqnqq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YphrLcCT0Pbfo9shFh5pEA_gT92QpKd';

// Inicialização do cliente Supabase global
let supabaseClient = null;

try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        console.log('Supabase conectado com sucesso!');
    } else {
        console.error('Biblioteca do Supabase não foi carregada corretamente.');
    }
} catch (error) {
    console.error('Erro ao inicializar o cliente Supabase:', error);
}

// Exporta o cliente globalmente
window.supabaseClient = supabaseClient;