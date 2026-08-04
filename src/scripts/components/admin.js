// Variáveis globais
let menuItems = [];
let settings = {};
let currentEditingItem = null;
let currentViewMode = 'grid'; // 'grid' ou 'list'
let filteredItems = [];
let useSupabase = false; // Flag para usar Supabase ou localStorage

// Verificar autenticação ao carregar
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    
    // Verificar timeout (sessão de 2 horas)
    const loginTime = sessionStorage.getItem('loginTime');
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000; // 2 horas em milissegundos
    
    if (loginTime && (now - loginTime) > twoHours) {
        logout();
        return false;
    }
    
    // Resetar timer de inatividade
    resetInactivityTimer();
    
    return true;
}

// Timer de inatividade (30 minutos)
let inactivityTimer;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        showNotification('Sessão expirada por inatividade!', 'warning');
        setTimeout(logout, 2000);
    }, INACTIVITY_TIMEOUT);
}

// Logout
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando painel administrativo...');
    
    if (!checkAuthentication()) return;
    
    console.log('Autenticação OK');
    
    // Tentar inicializar Supabase
    try {
        useSupabase = await supabaseService.init();
        console.log('Supabase init result:', useSupabase);
    } catch (error) {
        console.error('Erro ao iniciar Supabase:', error);
        useSupabase = false;
    }
    
    if (useSupabase) {
        console.log('Usando Supabase para armazenamento');
        // Verificar se precisa migrar do localStorage
        await migrateIfNeeded();
        // Carregar dados do Supabase
        await loadMenuItemsFromSupabase();
        await loadSettingsFromSupabase();
        await loadOrdersFromSupabase();
        
        // Iniciar verificador de pedidos pendentes
        startPendingOrdersChecker();
        
        // Carregar pedidos de hoje na aba inicial
        await loadTodayOrders();
    } else {
        console.log('Usando localStorage como fallback');
        // Carregar do localStorage
        loadMenuItems();
        loadSettings();
    }
    
    console.log('Configurando navegação...');
    setupNavigation();
    
    console.log('Configurando event listeners...');
    setupEventListeners();
    
    console.log('Renderizando menu items...');
    renderMenuItems();
    
    console.log('Atualizando dashboard stats...');
    updateDashboardStats();
    
    console.log('Painel administrativo iniciado com sucesso!');
});

// Migrar dados do localStorage para Supabase se necessário
async function migrateIfNeeded() {
    const hasMigrated = localStorage.getItem('supabaseMigrated');
    if (hasMigrated) return;
    
    const hasLocalData = localStorage.getItem('menuItems') || 
                        localStorage.getItem('whatsappNumber') || 
                        localStorage.getItem('adminSettings');
    
    if (hasLocalData) {
        if (confirm('Deseja migrar os dados do localStorage para o Supabase?')) {
            const success = await supabaseService.migrateFromLocalStorage();
            if (success) {
                localStorage.setItem('supabaseMigrated', 'true');
                showNotification('Dados migrados com sucesso!', 'success');
            } else {
                showNotification('Erro na migração. Continuando com localStorage.', 'error');
                useSupabase = false;
            }
        } else {
            useSupabase = false;
        }
    } else {
        localStorage.setItem('supabaseMigrated', 'true');
    }
    
    if (useSupabase) {
        await loadDataFromSupabase();
    }
}

// Carregar dados do Supabase
async function loadDataFromSupabase() {
    try {
        // Carregar menu items
        menuItems = await supabaseService.getMenuItems();
        
        // Carregar configurações
        const allSettings = await supabaseService.getAllSettings();
        settings = allSettings;
        
        // Carregar WhatsApp
        const whatsappNumber = await supabaseService.getSetting('whatsapp_number');
        if (whatsappNumber) {
            document.getElementById('whatsapp-number').value = whatsappNumber;
        }
        
        // Carregar outras configurações
        const siteTitle = await supabaseService.getSetting('site_title');
        if (siteTitle) {
            document.getElementById('site-title').value = siteTitle;
        }
        
        const deliveryFee = await supabaseService.getSetting('delivery_fee');
        if (deliveryFee) {
            document.getElementById('delivery-fee').value = deliveryFee;
        }
        
        console.log('Dados carregados do Supabase com sucesso');
    } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
        showNotification('Erro ao carregar dados. Usando localStorage.', 'error');
        useSupabase = false;
        loadMenuItems();
        loadSettings();
        loadWhatsApp();
    }
}

// Configurar logout
function setupLogout() {
    // Adicionar botão de logout na navegação
    const nav = document.querySelector('.admin-nav ul');
    if (nav) {
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `
            <a href="#" onclick="logout()" style="background: #d32f2f; color: white;">
                <i class="fas fa-sign-out-alt"></i> Sair
            </a>
        `;
        nav.appendChild(logoutLi);
    }
    
    // Logout automático após inatividade
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            alert('Sessão expirada por inatividade!');
            logout();
        }, 30 * 60 * 1000); // 30 minutos
    }
    
    // Resetar timer em qualquer atividade
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    
    resetInactivityTimer();
}

// Configurar navegação
function setupNavigation() {
    console.log('Configurando navegação...');
    
    // Navegação por seções
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    console.log('Links encontrados:', navLinks.length);
    console.log('Seções encontradas:', sections.length);
    
    navLinks.forEach((link, index) => {
        console.log(`Configurando link ${index}:`, link.getAttribute('data-section'));
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = link.getAttribute('data-section');
            console.log('Clicou na seção:', targetSection);
            
            // Remover classe active de todos os links e seções
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Adicionar classe active ao link e seção correspondentes
            link.classList.add('active');
            const targetSectionElement = document.getElementById(targetSection);
            if (targetSectionElement) {
                targetSectionElement.classList.add('active');
                
                // Atualizar título da página
                const pageTitle = link.querySelector('span').textContent;
                const titleElement = document.querySelector('.page-title');
                if (titleElement) {
                    titleElement.textContent = pageTitle;
                }
            } else {
                console.error('Seção não encontrada:', targetSection);
            }
        });
    });
    
    // Menu toggle para mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            
            // Criar overlay se não existir
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                });
                document.body.appendChild(overlay);
            }
            
            overlay.classList.toggle('active');
        });
    }
    
    // Atualizar dashboard stats
    updateDashboardStats();
    
    console.log('Navegação configurada com sucesso!');
}

// Configurar event listeners
function setupEventListeners() {
    // Formatar preço automaticamente
    document.getElementById('new-item-price')?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d,]/g, '');
        const parts = value.split(',');
        
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, 2);
            value = parts[0] + ',' + parts[1];
        }
        
        e.target.value = value;
    });

    // Formatar preço do modal de edição automaticamente
    document.getElementById('edit-item-price')?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d,]/g, '');
        const parts = value.split(',');
        
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, 2);
            value = parts[0] + ',' + parts[1];
        }
        
        e.target.value = value;
    });

    // Formatar taxa de entrega automaticamente
    document.getElementById('delivery-fee')?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d,]/g, '');
        const parts = value.split(',');
        
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, 2);
            value = parts[0] + ',' + parts[1];
        }
        
        e.target.value = value;
    });

    // Fechar modal ao clicar fora dele
    document.getElementById('editModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeEditModal();
        }
    });
}

// Toggle para expandir/recolher formulário de adicionar
function toggleAddForm() {
    const form = document.getElementById('addItemForm');
    const content = document.getElementById('addFormContent');
    const toggle = document.getElementById('addFormToggle');
    
    form.classList.toggle('expanded');
    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
}

// Filtrar por categoria
function filterByCategory() {
    searchItems(); // Reutiliza a lógica de pesquisa
}

<<<<<<< HEAD
// Obter nome da categoria
function getCategoryName(category) {
    const categories = {
        'pasteis': 'Pastéis',
        'combos': 'Combos',
        'bebidas': 'Bebidas',
        'sobremesas': 'Sobremesas',
        'destaques': 'Destaques'
=======
// Obter nome da categoria com ícones
function getCategoryName(category) {
    const categories = {
        'burgers': '🍔 Burgers & Lanches',
        'pasteis': '🥟 Pastéis Gourmet',
        'pizzas': '🍕 Pizzas & Calzones',
        'porcoes': '🍟 Porções',
        'bebidas': '🥤 Bebidas & Sucos',
        'sobremesas': '🍰 Sobremesas',
        'combos': '🎁 Combos Especiais',
        'destaques': '⭐ Destaques da Casa'
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    };
    return categories[category] || category;
}

// Notificar o site principal sobre atualizações
function notifySiteUpdate() {
    // Disparar evento personalizado para notificar o site principal
    const event = new CustomEvent('adminDataUpdated', {
        detail: {
            type: 'menuItems',
            data: menuItems
        }
    });
    
    // Se estiver na mesma janela, dispara o evento
    if (window.opener) {
        window.opener.dispatchEvent(event);
    }
    
    // Também salva um timestamp para forçar atualização
    localStorage.setItem('adminLastUpdate', Date.now().toString());
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Total de itens no cardápio
    const totalItems = menuItems.length;
    document.getElementById('total-items').textContent = totalItems;
    
    // Carregar dados reais do dashboard
    loadDashboardData();
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        console.log('Carregando dados do dashboard...');
        
        // Obter data de hoje em UTC (para comparar com o Supabase)
        const today = new Date();
        const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0));
        
        const startDate = startOfDayUTC.toISOString();
        const endDate = endOfDayUTC.toISOString();
        
        console.log('Buscando dados do dashboard:', { startDate, endDate });
        
        // Obter pedidos de hoje do Supabase
        const { data: todayOrders, error } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .gte('created_at', startDate)
            .lt('created_at', endDate)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            updateDashboardUI({
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                confirmedOrders: 0,
                deliveringOrders: 0,
                deliveredOrders: 0,
                cancelledOrders: 0
            });
            return;
        }
        
        const orders = todayOrders || [];
        console.log('Pedidos de hoje para dashboard:', orders.length);
        
        // Calcular estatísticas
        const stats = calculateDashboardStats(orders);
        
        // Atualizar UI
        updateDashboardUI(stats);
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        updateDashboardUI({
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            confirmedOrders: 0,
            deliveringOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        });
    }
}

// Calcular estatísticas do dashboard
function calculateDashboardStats(orders) {
    const stats = {
        totalOrders: orders.length,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        deliveringOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
    };
    
    orders.forEach(order => {
        // Contar por status
        switch (order.status) {
            case 'pending':
                stats.pendingOrders++;
                break;
            case 'confirmed':
                stats.confirmedOrders++;
                break;
            case 'delivering':
                stats.deliveringOrders++;
                break;
            case 'delivered':
                stats.deliveredOrders++;
                // Somar apenas pedidos entregues ao faturamento
                stats.totalRevenue += order.total_amount || 0;
                break;
            case 'cancelled':
                stats.cancelledOrders++;
                break;
        }
    });
    
    return stats;
}

// Atualizar UI do dashboard
function updateDashboardUI(stats) {
    // Atualizar cards principais
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-revenue').textContent = formatCurrency(stats.totalRevenue);
    
    // Adicionar cards de status (se existirem no HTML)
    updateStatusCards(stats);
    
    // Atualizar gráfico de status
    updateOrdersStatusChart(stats);
}

// Atualizar cards de status
function updateStatusCards(stats) {
    // Verificar se existem elementos para status detalhados
    const pendingElement = document.getElementById('pending-orders');
    const confirmedElement = document.getElementById('confirmed-orders');
    const deliveringElement = document.getElementById('delivering-orders');
    const deliveredElement = document.getElementById('delivered-orders');
    const cancelledElement = document.getElementById('cancelled-orders');
    
    if (pendingElement) pendingElement.textContent = stats.pendingOrders;
    if (confirmedElement) confirmedElement.textContent = stats.confirmedOrders;
    if (deliveringElement) deliveringElement.textContent = stats.deliveringOrders;
    if (deliveredElement) deliveredElement.textContent = stats.deliveredOrders;
    if (cancelledElement) cancelledElement.textContent = stats.cancelledOrders;
}

// Variável global para o gráfico
let ordersStatusChart = null;

// Atualizar gráfico de status dos pedidos
function updateOrdersStatusChart(stats) {
    const ctx = document.getElementById('ordersStatusChart');
    if (!ctx) return;
    
    // Preparar dados para o gráfico
    const chartData = {
        labels: ['Pendentes', 'Confirmados', 'Em Entrega', 'Entregues', 'Cancelados'],
        datasets: [{
            data: [
                stats.pendingOrders,
                stats.confirmedOrders,
                stats.deliveringOrders,
                stats.deliveredOrders,
                stats.cancelledOrders
            ],
            backgroundColor: [
                '#f39c12', // Amarelo para pendentes
                '#0984e3', // Azul para confirmados
                '#27ae60', // Verde para em entrega
                '#2ecc71', // Verde claro para entregues
                '#e74c3c'  // Vermelho para cancelados
            ],
            borderColor: [
                '#e67e22',
                '#2980b9',
                '#229954',
                '#27ae60',
                '#c0392b'
            ],
            borderWidth: 2,
            hoverOffset: 4
        }]
    };
    
    // Configurações do gráfico
    const config = {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Usaremos legenda customizada
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    
    // Criar ou atualizar o gráfico
    if (ordersStatusChart) {
        ordersStatusChart.data = chartData;
        ordersStatusChart.update();
    } else {
        ordersStatusChart = new Chart(ctx, config);
    }
    
    // Atualizar legenda customizada
    updateChartLegend(chartData);
}

// Atualizar legenda customizada do gráfico
function updateChartLegend(chartData) {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
    
    legendContainer.innerHTML = chartData.labels.map((label, index) => {
        const value = chartData.datasets[0].data[index];
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        const color = chartData.datasets[0].backgroundColor[index];
        
        return `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${label}:</span>
                <span class="legend-value">${value} (${percentage}%)</span>
            </div>
        `;
    }).join('');
}

// Carregar dados do Supabase com fallback
async function loadMenuItemsFromSupabase() {
    try {
        console.log('Carregando itens do menu do Supabase...');
        const items = await supabaseService.getMenuItems();
        console.log('Itens recebidos do Supabase:', items);
        
        if (items && items.length > 0) {
            menuItems = items;
            console.log('Itens carregados do Supabase:', items.length);
            renderMenuItems();
            updateDashboardStats();
        } else {
            console.log('Nenhum item encontrado no Supabase, usando dados padrão');
            menuItems = [];
            renderMenuItems();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Erro ao carregar itens do Supabase:', error);
        console.log('Fazendo fallback para localStorage');
        // Fallback para localStorage
        loadMenuItems();
    }
}

// Carregar configurações do Supabase com fallback
async function loadSettingsFromSupabase() {
    try {
        console.log('Carregando configurações do Supabase...');
        const allSettings = await supabaseService.getAllSettings();
        if (allSettings && Object.keys(allSettings).length > 0) {
            settings = allSettings;
            console.log('Configurações carregadas do Supabase:', Object.keys(allSettings));
            
            // Atualizar campos do formulário
            if (settings.site_title) {
                document.getElementById('site-title').value = settings.site_title;
            }
            if (settings.delivery_fee) {
                document.getElementById('delivery-fee').value = settings.delivery_fee;
            }
            if (settings.whatsapp_number) {
                document.getElementById('whatsapp-number').value = settings.whatsapp_number;
            }
        } else {
            console.log('Nenhuma configuração encontrada no Supabase');
            // Fallback para localStorage
            loadSettings();
        }
    } catch (error) {
        console.error('Erro ao carregar configurações do Supabase:', error);
        // Fallback para localStorage
        loadSettings();
    }
}

// Carregar WhatsApp do Supabase com fallback
async function loadWhatsAppFromSupabase() {
    try {
        console.log('Carregando WhatsApp do Supabase...');
        const whatsappNumber = await supabaseService.getSetting('whatsapp_number');
        if (whatsappNumber) {
            document.getElementById('whatsapp-number').value = whatsappNumber;
            console.log('WhatsApp carregado do Supabase:', whatsappNumber);
        } else {
            console.log('WhatsApp não encontrado no Supabase');
            // Fallback para localStorage
            loadWhatsApp();
        }
    } catch (error) {
        console.error('Erro ao carregar WhatsApp do Supabase:', error);
        // Fallback para localStorage
        loadWhatsApp();
    }
}

// Carregar pedidos do Supabase
async function loadOrdersFromSupabase() {
    try {
        console.log('Carregando pedidos do Supabase...');
        const orders = await supabaseService.getOrders(50, 0); // Últimos 50 pedidos
        if (orders && orders.length > 0) {
            console.log('Pedidos carregados do Supabase:', orders.length);
            renderOrders(orders);
        } else {
            console.log('Nenhum pedido encontrado no Supabase');
            renderOrders([]);
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos do Supabase:', error);
        renderOrders([]);
    }
}

// Carregar apenas pedidos de hoje
async function loadTodayOrders() {
    try {
        console.log('Carregando pedidos de hoje...');
        
        // Obter data de hoje em UTC (para comparar com o Supabase)
        const today = new Date();
        const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0));
        
        // Formatar para ISO
        const startDate = startOfDayUTC.toISOString();
        const endDate = endOfDayUTC.toISOString();
        
        console.log('Buscando pedidos de hoje:', { startDate, endDate });
        
        // Obter pedidos de hoje
        const { data: todayOrders } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .gte('created_at', startDate)
            .lt('created_at', endDate)
            .order('created_at', { ascending: false });
        
        if (todayOrders && todayOrders.length > 0) {
            console.log('Pedidos de hoje carregados:', todayOrders.length);
            renderTodayOrders(todayOrders);
        } else {
            console.log('Nenhum pedido encontrado para hoje');
            renderTodayOrders([]);
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos de hoje:', error);
        renderTodayOrders([]);
    }
}

// Renderizar pedidos de hoje
function renderTodayOrders(orders) {
    const ordersTable = document.getElementById('orders-table');
    const ordersBody = ordersTable?.querySelector('tbody');
    
    if (!ordersBody) {
        console.error('Tabela de pedidos de hoje não encontrada');
        return;
    }
    
    // Limpar tabela
    ordersBody.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="empty-state-message">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Nenhum pedido hoje</h3>
                    <p>Ainda não há pedidos registrados para hoje.</p>
                </div>
            </td>
        `;
        ordersBody.appendChild(row);
        return;
    }
    
    // Adicionar pedidos
    orders.forEach(order => {
        const isFinalStatus = order.status === 'delivered' || order.status === 'cancelled';
        const disabledClass = isFinalStatus ? 'disabled' : '';
        const disabledTitle = isFinalStatus ? 'title="Pedidos entregues ou cancelados não podem ser editados"' : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatCurrency(order.total_amount)}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>
                <button class="btn-action" onclick="viewOrderDetails(${order.id})" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-confirm ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'confirmed')" 
                        title="Confirmar pedido" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Confirmado
                </button>
                <button class="btn-action btn-delivering ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'delivering')" 
                        title="Saiu para entrega" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-motorcycle"></i> Saiu para Entrega
                </button>
                <button class="btn-action btn-delivered ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'delivered')" 
                        title="Marcar como entregue" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-truck"></i> Entregue
                </button>
                <button class="btn-action btn-cancel ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'cancelled')" 
                        title="Cancelar pedido" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-times"></i> Cancelado
                </button>
                <button class="btn-action btn-notification ${disabledClass}" 
                        onclick="showNotificationConfirmation(${order.id})" 
                        title="Enviar notificação para cliente" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-bell"></i>
                </button>
                <button class="btn-action btn-print" 
                        onclick="printOrderFromTable(${order.id})" 
                        title="Imprimir comanda">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        ordersBody.appendChild(row);
    });
}

// Alternar entre abas de pedidos
function switchOrdersTab(tab) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Adicionar classe active à aba selecionada
    if (tab === 'today') {
        document.getElementById('today-tab').classList.add('active');
        document.getElementById('today-orders-content').classList.add('active');
        loadTodayOrders(); // Carregar apenas pedidos de hoje
    } else if (tab === 'history') {
        document.getElementById('history-tab').classList.add('active');
        document.getElementById('history-orders-content').classList.add('active');
        // Não carrega nada inicialmente, espera pelos filtros
    }
}

// Filtrar pedidos por data e status
async function filterOrders() {
    try {
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;
        const statusFilter = document.getElementById('status-filter').value;
        
        console.log('Filtrando pedidos:', { dateFrom, dateTo, statusFilter });
        
        // Construir query
        let query = supabaseService.supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        // Aplicar filtros de data (convertendo para UTC)
        if (dateFrom) {
            const startDate = new Date(dateFrom + 'T00:00:00');
            const startUTC = new Date(Date.UTC(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                0, 0, 0
            ));
            query = query.gte('created_at', startUTC.toISOString());
        }
        
        if (dateTo) {
            const endDate = new Date(dateTo + 'T23:59:59');
            const endUTC = new Date(Date.UTC(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                23, 59, 59
            ));
            query = query.lte('created_at', endUTC.toISOString());
        }
        
        // Aplicar filtro de status
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }
        
        // Executar query
        const { data: filteredOrders, error } = await query;
        
        if (error) {
            console.error('Erro ao filtrar pedidos:', error);
            showNotification('Erro ao filtrar pedidos', 'error');
            return;
        }
        
        console.log('Pedidos filtrados:', filteredOrders?.length || 0);
        renderHistoryOrders(filteredOrders || []);
        
    } catch (error) {
        console.error('Erro ao filtrar pedidos:', error);
        showNotification('Erro ao filtrar pedidos', 'error');
    }
}

// Renderizar pedidos no histórico
function renderHistoryOrders(orders) {
    const ordersTable = document.getElementById('history-orders-table');
    const ordersBody = ordersTable?.querySelector('tbody');
    
    if (!ordersBody) {
        console.error('Tabela de histórico não encontrada');
        return;
    }
    
    // Limpar tabela
    ordersBody.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="empty-state-message">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Tente ajustar os filtros para encontrar pedidos.</p>
                </div>
            </td>
        `;
        ordersBody.appendChild(row);
        return;
    }
    
    // Adicionar pedidos
    orders.forEach(order => {
        const isFinalStatus = order.status === 'delivered' || order.status === 'cancelled';
        const disabledClass = isFinalStatus ? 'disabled' : '';
        const disabledTitle = isFinalStatus ? 'title="Pedidos entregues ou cancelados não podem ser editados"' : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatCurrency(order.total_amount)}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>
                <button class="btn-action" onclick="viewOrderDetails(${order.id})" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-print" 
                        onclick="printOrderFromTable(${order.id})" 
                        title="Imprimir comanda">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        ordersBody.appendChild(row);
    });
}

// Limpar filtros
function clearFilters() {
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    document.getElementById('status-filter').value = '';
    
    // Limpar tabela
    const ordersTable = document.getElementById('history-orders-table');
    const ordersBody = ordersTable?.querySelector('tbody');
    if (ordersBody) {
        ordersBody.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="empty-state-message">
                    <i class="fas fa-info-circle"></i>
                    <h3>Filtros limpos</h3>
                    <p>Selecione novos filtros para buscar pedidos.</p>
                </div>
            </td>
        `;
    }
}

// Renderizar pedidos na tabela
function renderOrders(orders) {
    const ordersTable = document.getElementById('orders-table');
    const ordersBody = ordersTable?.querySelector('tbody');
    
    if (!ordersBody) {
        console.error('Tabela de pedidos não encontrada');
        return;
    }
    
    // Limpar tabela
    ordersBody.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center; padding: 20px;">Nenhum pedido encontrado</td>';
        ordersBody.appendChild(row);
        return;
    }
    
    // Adicionar pedidos
    orders.forEach(order => {
        const isFinalStatus = order.status === 'delivered' || order.status === 'cancelled';
        const disabledClass = isFinalStatus ? 'disabled' : '';
        const disabledTitle = isFinalStatus ? 'title="Pedidos entregues ou cancelados não podem ser editados"' : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatCurrency(order.total_amount)}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>
                <button class="btn-action" onclick="viewOrderDetails(${order.id})" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-confirm ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'confirmed')" 
                        title="Confirmar pedido" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Confirmado
                </button>
                <button class="btn-action btn-delivering ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'delivering')" 
                        title="Saiu para entrega" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-motorcycle"></i> Saiu para Entrega
                </button>
                <button class="btn-action btn-delivered ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'delivered')" 
                        title="Marcar como entregue" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-truck"></i> Entregue
                </button>
                <button class="btn-action btn-cancel ${disabledClass}" 
                        onclick="updateOrderStatus(${order.id}, 'cancelled')" 
                        title="Cancelar pedido" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-times"></i> Cancelado
                </button>
                <button class="btn-action btn-notification ${disabledClass}" 
                        onclick="showNotificationConfirmation(${order.id})" 
                        title="Enviar notificação para cliente" ${disabledTitle}
                        ${isFinalStatus ? 'disabled' : ''}>
                    <i class="fas fa-bell"></i>
                </button>
                <button class="btn-action btn-print" 
                        onclick="printOrderFromTable(${order.id})" 
                        title="Imprimir comanda">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        ordersBody.appendChild(row);
    });
}

// Formatar moeda
function formatCurrency(value) {
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
}

// Converter UTC para horário local do Brasil
function convertUTCToLocal(utcString) {
    const utcDate = new Date(utcString);
    
    // Brasil está em UTC-3 (horário de verão) ou UTC-2 (horário de inverno)
    // Usando o método mais confiável
    const localDate = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
    
    return localDate;
}

// Formatar data
function formatDate(dateString) {
    // Converter UTC para local primeiro
    const localDate = convertUTCToLocal(dateString);
    
    // Formatar data e hora no formato brasileiro
    return localDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
    }) + ' ' + localDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'confirmed': 'Confirmado',
        'preparing': 'Preparando',
        'ready': 'Pronto',
        'delivering': 'Saiu para Entrega',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Variável global para armazenar o ID do pedido atual
let currentOrderId = null;
let pendingNotificationOrderId = null;
let pendingNotificationType = null; // 'confirmation' ou 'delivery'

// Mostrar modal de confirmação de notificação
function showNotificationConfirmation(orderId) {
    pendingNotificationOrderId = orderId;
    pendingNotificationType = 'confirmation';
    
    const modal = document.getElementById('confirmationModal');
    const title = modal.querySelector('.confirmation-header h3');
    const body = modal.querySelector('.confirmation-body p');
    
    title.textContent = 'Enviar Notificação';
    body.innerHTML = `
        <p>Deseja enviar uma notificação para o cliente sobre este pedido?</p>
        <p>Esta ação abrirá o WhatsApp com uma mensagem personalizada informando sobre o status do pedido.</p>
    `;
    
    modal.classList.add('active');
}

// Fechar modal de confirmação
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
    pendingNotificationOrderId = null;
    pendingNotificationType = null;
}

// Confirmar envio de notificação
async function confirmSendNotification() {
    if (!pendingNotificationOrderId) return;
    
    const orderId = pendingNotificationOrderId;
    const type = pendingNotificationType;
    
    closeConfirmationModal();
    
    if (type === 'delivery') {
        await sendDeliveryNotification(orderId);
    } else {
        await sendOrderConfirmationNotification(orderId);
    }
}

// Mostrar modal de confirmação para notificação de entrega
function showDeliveryNotificationConfirmation(orderId) {
    pendingNotificationOrderId = orderId;
    pendingNotificationType = 'delivery';
    
    const modal = document.getElementById('confirmationModal');
    const title = modal.querySelector('.confirmation-header h3');
    const body = modal.querySelector('.confirmation-body p');
    
    title.textContent = 'Notificar Cliente - Saiu para Entrega';
    body.innerHTML = `
        <p>Deseja enviar uma notificação para o cliente informando que o pedido saiu para entrega?</p>
        <p>Esta ação abrirá o WhatsApp com uma mensagem personalizada informando que o entregador está a caminho.</p>
    `;
    
    modal.classList.add('active');
}

// Enviar notificação de entrega para o cliente
async function sendDeliveryNotification(orderId) {
    try {
        console.log('Enviando notificação de entrega para o pedido:', orderId);
        
        // Obter detalhes completos do pedido
        const { data: order } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (!order) {
            console.error('Pedido não encontrado:', orderId);
            showNotification('Pedido não encontrado', 'error');
            return;
        }
        
        // Obter número do WhatsApp da loja
        const whatsappNumber = await supabaseService.getSetting('whatsapp_number');
        if (!whatsappNumber) {
            console.error('Número do WhatsApp não configurado');
            showNotification('Número do WhatsApp não configurado', 'error');
            return;
        }
        
        // Construir mensagem de entrega
        const deliveryMessage = `🏍️ *SAIU PARA ENTREGA!* 🏍️

Olá, *${order.customer_name}*!

Seu pedido #${orderId} já saiu para entrega! 📦

Nosso entregador está a caminho do seu endereço:

📍 *Endereço de Entrega:*
${order.customer_address}
${order.customer_neighborhood ? `Bairro: ${order.customer_neighborhood}` : ''}
${order.customer_reference ? `Referência: ${order.customer_reference}` : ''}

⏰ *Previsão de Chegada:* 15-30 minutos

Por favor, mantenha o celular por perto! O entregador poderá ligar se necessário.

Agradecemos a paciência! 🙏

_Pastelaria_
📞 ${whatsappNumber}`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(deliveryMessage);
        
        // Abrir WhatsApp com a mensagem de entrega
        window.open(`https://wa.me/${order.customer_phone}?text=${encodedMessage}`, '_blank');
        
        console.log('Notificação de entrega enviada para:', order.customer_phone);
        showNotification(`Notificação de entrega enviada para ${order.customer_name}`, 'success');
        
    } catch (error) {
        console.error('Erro ao enviar notificação de entrega:', error);
        showNotification('Erro ao enviar notificação de entrega', 'error');
    }
}

// Ver detalhes do pedido
async function viewOrderDetails(orderId) {
    try {
        console.log('Ver detalhes do pedido:', orderId);
        currentOrderId = orderId;
        
        // Mostrar modal
        const modal = document.getElementById('orderDetailsModal');
        modal.style.display = 'flex';
        
        // Mostrar loading
        showOrderDetailsLoading();
        
        // Obter detalhes completos do pedido
        const { data: order } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (!order) {
            console.error('Pedido não encontrado:', orderId);
            showNotification('Pedido não encontrado', 'error');
            closeOrderDetailsModal();
            return;
        }
        
        // Preencher informações do pedido
        populateOrderDetails(order);
        
    } catch (error) {
        console.error('Erro ao ver detalhes do pedido:', error);
        showNotification('Erro ao carregar detalhes do pedido', 'error');
        closeOrderDetailsModal();
    }
}

// Mostrar estado de loading
function showOrderDetailsLoading() {
    document.getElementById('detail-order-id').textContent = 'Carregando...';
    document.getElementById('detail-order-status').textContent = 'Carregando...';
    document.getElementById('detail-order-date').textContent = 'Carregando...';
    document.getElementById('detail-order-total').textContent = 'Carregando...';
    document.getElementById('detail-customer-name').textContent = 'Carregando...';
    document.getElementById('detail-customer-phone').textContent = 'Carregando...';
    document.getElementById('detail-customer-address').textContent = 'Carregando...';
    document.getElementById('detail-customer-neighborhood').textContent = 'Carregando...';
    document.getElementById('detail-customer-reference').textContent = 'Carregando...';
    document.getElementById('detail-customer-observations').textContent = 'Carregando...';
    document.getElementById('detail-order-items').innerHTML = '<tr><td colspan="5" class="loading-items"><i class="fas fa-spinner fa-spin"></i> Carregando itens...</td></tr>';
}

// Preencher detalhes do pedido
function populateOrderDetails(order) {
    // Informações do pedido
    document.getElementById('detail-order-id').textContent = '#' + order.id;
    document.getElementById('detail-order-status').textContent = getStatusText(order.status);
    document.getElementById('detail-order-status').className = 'status-badge status-' + order.status;
    document.getElementById('detail-order-date').textContent = formatDate(order.created_at);
    document.getElementById('detail-order-total').textContent = formatCurrency(order.total_amount);
    
    // Dados do cliente
    document.getElementById('detail-customer-name').textContent = order.customer_name || '-';
    document.getElementById('detail-customer-phone').textContent = order.customer_phone || '-';
    document.getElementById('detail-customer-address').textContent = order.customer_address || '-';
    document.getElementById('detail-customer-neighborhood').textContent = order.customer_neighborhood || '-';
    document.getElementById('detail-customer-reference').textContent = order.customer_reference || '-';
    document.getElementById('detail-customer-observations').textContent = order.customer_observations || '-';
    
    // Itens do pedido
    populateOrderItems(order.items || []);
    
    // Resumo
    const subtotal = calculateSubtotal(order.items || []);
    const deliveryFee = order.delivery_fee || 5.00;
    const total = order.total_amount || 0;
    
    document.getElementById('detail-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('detail-delivery-fee').textContent = formatCurrency(deliveryFee);
    document.getElementById('detail-total-amount').textContent = formatCurrency(total);
    
    // Atualizar estado dos botões baseado no status atual
    updateModalButtonsState(order.status);
}

// Preencher itens do pedido
function populateOrderItems(items) {
    const itemsContainer = document.getElementById('detail-order-items');
    
    if (!items || items.length === 0) {
        itemsContainer.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Nenhum item encontrado</td></tr>';
        return;
    }
    
    let itemsHTML = '';
    items.forEach(item => {
        const subtotal = item.price * item.quantity;
        itemsHTML += `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.description || '-'}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td><strong>${formatCurrency(subtotal)}</strong></td>
            </tr>
        `;
    });
    
    itemsContainer.innerHTML = itemsHTML;
}

// Calcular subtotal
function calculateSubtotal(items) {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Fechar modal de detalhes
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    modal.style.display = 'none';
    currentOrderId = null;
}

// Atualizar status do pedido a partir do modal
async function updateOrderStatusFromModal(newStatus) {
    if (!currentOrderId) return;
    
    try {
        console.log('Atualizando status do pedido:', currentOrderId, 'para', newStatus);
        await supabaseService.updateOrderStatus(currentOrderId, newStatus);
        
        // Se o status for "confirmed", enviar notificação para o cliente
        if (newStatus === 'confirmed') {
            await sendOrderConfirmationNotification(currentOrderId);
        }
        
        // Se o status for "delivering", mostrar confirmação para enviar notificação
        if (newStatus === 'delivering') {
            showDeliveryNotificationConfirmation(currentOrderId);
        }
        
        // Recarregar pedidos
        await loadOrdersFromSupabase();
        
        // Atualizar status no modal
        const statusElement = document.getElementById('detail-order-status');
        statusElement.textContent = getStatusText(newStatus);
        statusElement.className = 'status-badge status-' + newStatus;
        
        // Atualizar estado dos botões no modal
        updateModalButtonsState(newStatus);
        
        showNotification(`Status do pedido #${currentOrderId} atualizado para ${getStatusText(newStatus)}`, 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        showNotification('Erro ao atualizar status do pedido', 'error');
    }
}

// Atualizar estado dos botões no modal
function updateModalButtonsState(status) {
    const isFinalStatus = status === 'delivered' || status === 'cancelled';
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    
    // Manter apenas o botão de ver detalhes e imprimir ativos
    actionButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        const isViewButton = buttonText.includes('ver') || buttonText.includes('detalhes');
        const isPrintButton = buttonText.includes('imprimir');
        
        if (!isViewButton && !isPrintButton) {
            if (isFinalStatus) {
                button.disabled = true;
                button.classList.add('disabled');
                button.title = 'Pedidos entregues ou cancelados não podem ser editados';
            } else {
                button.disabled = false;
                button.classList.remove('disabled');
                button.title = '';
            }
        }
    });
}

// Verificar pedidos pendentes e mostrar notificações
async function checkPendingOrders() {
    try {
        console.log('Verificando pedidos pendentes...');
        
        // Obter pedidos pendentes
        const { data: pendingOrders } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });
        
        if (pendingOrders && pendingOrders.length > 0) {
            console.log('Pedidos pendentes encontrados:', pendingOrders.length);
            showPendingOrdersNotification(pendingOrders);
        }
    } catch (error) {
        console.error('Erro ao verificar pedidos pendentes:', error);
    }
}

// Mostrar notificação de pedidos pendentes
function showPendingOrdersNotification(orders) {
    // Criar container de notificações se não existir
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Criar elemento de áudio para o som de notificação
    const audio = new Audio('d:/Sites/Pastelaria/kc036aibzj-notification-sfx-5.mp3');
    audio.volume = 0.5; // Volume moderado
    
    orders.forEach((order, index) => {
        setTimeout(() => {
            // Tocar som de notificação
            audio.play().catch(e => console.log('Erro ao tocar som:', e));
            
            const notification = document.createElement('div');
            notification.className = 'pending-order-notification';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="notification-content">
                    <h4>Novo Pedido Pendente!</h4>
                    <p><strong>${order.customer_name}</strong></p>
                    <p>Total: ${formatCurrency(order.total_amount)}</p>
                    <p>Há ${formatTimeAgo(order.created_at)}</p>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="btn btn-success btn-sm" onclick="quickConfirmOrder(${order.id})">
                        <i class="fas fa-check"></i> Confirmar
                    </button>
                </div>
                <button class="notification-close" onclick="closeNotification(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            notificationContainer.appendChild(notification);
            
            // Auto-fechar após 10 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);
            
            // Animar entrada
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Mostrar notificação no console
            showNotification(`Novo pedido pendente de ${order.customer_name}!`, 'info');
            
        }, index * 500); // Pequeno delay entre notificações
    });
}

// Confirmar pedido rapidamente
async function quickConfirmOrder(orderId) {
    try {
        await updateOrderStatus(orderId, 'confirmed');
        // Fechar todas as notificações
        const notifications = document.querySelectorAll('.pending-order-notification');
        notifications.forEach(n => n.remove());
    } catch (error) {
        console.error('Erro ao confirmar pedido rapidamente:', error);
        showNotification('Erro ao confirmar pedido', 'error');
    }
}

// Fechar notificação individual
function closeNotification(button) {
    const notification = button.closest('.pending-order-notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Formatar tempo relativo
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
        return 'poucos segundos';
    } else if (diffMins < 60) {
        return `${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    } else {
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    }
}

// Verificar periodicamente pedidos pendentes
function startPendingOrdersChecker() {
    // Verificar imediatamente
    checkPendingOrders();
    
    // Verificar a cada 30 segundos
    setInterval(checkPendingOrders, 30000);
}

// Imprimir pedido diretamente da tabela
function printOrderFromTable(orderId) {
    currentOrderId = orderId;
    generateOrderReceipt(orderId);
}

// Imprimir detalhes do pedido
function printOrderDetails() {
    if (!currentOrderId) {
        showNotification('Nenhum pedido selecionado', 'error');
        return;
    }
    
    // Gerar comanda de impressão
    generateOrderReceipt(currentOrderId);
}

// Gerar comanda para impressão
async function generateOrderReceipt(orderId) {
    try {
        // Obter detalhes do pedido
        const { data: order } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (!order) {
            showNotification('Pedido não encontrado', 'error');
            return;
        }
        
        // Criar janela de impressão
        const printWindow = window.open('', '_blank');
        
        // Gerar HTML da comanda
        const receiptHTML = generateReceiptHTML(order);
        
        // Escrever HTML na janela
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        
        // Aguardar carregar e imprimir
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
        
        showNotification('Comanda gerada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar comanda:', error);
        showNotification('Erro ao gerar comanda', 'error');
    }
}

// Gerar HTML da comanda
function generateReceiptHTML(order) {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Comanda #${order.id}</title>
    <style>
        @page {
            size: 80mm auto;
            margin: 5mm;
        }
        
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 0;
            padding: 10px;
            width: 76mm;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        
        .logo {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .info {
            font-size: 10px;
            margin-bottom: 3px;
        }
        
        .order-info {
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        
        .order-number {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .customer-info {
            margin-bottom: 5px;
        }
        
        .items {
            margin-bottom: 15px;
        }
        
        .item {
            margin-bottom: 8px;
        }
        
        .item-name {
            font-weight: bold;
        }
        
        .item-details {
            font-size: 10px;
            color: #666;
        }
        
        .item-price {
            text-align: right;
            float: right;
        }
        
        .total {
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .status {
            text-align: center;
            padding: 10px;
            border: 2px solid #000;
            margin: 15px 0;
            font-weight: bold;
            font-size: 14px;
        }
        
        .status-pending { border-color: #f39c12; color: #f39c12; }
        .status-confirmed { border-color: #0984e3; color: #0984e3; }
        .status-delivering { border-color: #27ae60; color: #27ae60; }
        .status-delivered { border-color: #2ecc71; color: #2ecc71; }
        .status-cancelled { border-color: #e74c3c; color: #e74c3c; }
        
        .footer {
            text-align: center;
            border-top: 2px dashed #000;
            padding-top: 10px;
            margin-top: 15px;
            font-size: 10px;
        }
        
        .barcode {
            text-align: center;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            letter-spacing: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">PASTELARIA</div>
        <div class="info">📞 (11) 9999-8888</div>
        <div class="info">📍 Rua das Pastelarias, 123</div>
        <div class="info">🌐 www.pastelaria.com.br</div>
    </div>
    
    <div class="order-info">
        <div class="order-number">COMANDA #${order.id.toString().padStart(6, '0')}</div>
        <div class="info">Data: ${formatDate(order.created_at)}</div>
        <div class="info">Impresso: ${currentDate} ${currentTime}</div>
    </div>
    
    <div class="customer-info">
        <div class="info"><strong>Cliente:</strong> ${order.customer_name || 'Não informado'}</div>
        <div class="info"><strong>Telefone:</strong> ${order.customer_phone || 'Não informado'}</div>
        ${order.customer_address ? `<div class="info"><strong>Endereço:</strong> ${order.customer_address}</div>` : ''}
        ${order.customer_neighborhood ? `<div class="info"><strong>Bairro:</strong> ${order.customer_neighborhood}</div>` : ''}
        ${order.customer_reference ? `<div class="info"><strong>Referência:</strong> ${order.customer_reference}</div>` : ''}
        ${order.customer_observations ? `<div class="info"><strong>Obs:</strong> ${order.customer_observations}</div>` : ''}
    </div>
    
    <div class="status status-${order.status}">
        ${getStatusText(order.status).toUpperCase()}
    </div>
    
    <div class="items">
        <div style="font-weight: bold; margin-bottom: 10px;">ITENS DO PEDIDO:</div>
        ${(order.items || []).map(item => `
            <div class="item">
                <div class="item-name">
                    ${item.quantity}x ${item.name}
                    <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
                </div>
                ${item.description ? `<div class="item-details">${item.description}</div>` : ''}
            </div>
        `).join('')}
    </div>
    
    <div class="total">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(calculateSubtotal(order.items || []))}</span>
        </div>
        <div class="total-row">
            <span>Taxa de Entrega:</span>
            <span>${formatCurrency(order.delivery_fee || 5.00)}</span>
        </div>
        <div class="total-row" style="font-size: 14px; border-top: 1px solid #000; padding-top: 5px;">
            <span>TOTAL:</span>
            <span>${formatCurrency(order.total_amount || 0)}</span>
        </div>
    </div>
    
    <div class="barcode">
        *${order.id.toString().padStart(6, '0')}*
    </div>
    
    <div class="footer">
        <div>Obrigado pela preferência!</div>
        <div>Volte sempre!</div>
        <div>--------------------</div>
    </div>
</body>
</html>
    `;
}

// Atualizar status do pedido
async function updateOrderStatus(orderId, newStatus) {
    try {
        console.log('Atualizando status do pedido:', orderId, 'para', newStatus);
        await supabaseService.updateOrderStatus(orderId, newStatus);
        
        // Se o status for "confirmed", enviar notificação para o cliente
        if (newStatus === 'confirmed') {
            await sendOrderConfirmationNotification(orderId);
        }
        
        // Se o status for "delivering", mostrar confirmação para enviar notificação
        if (newStatus === 'delivering') {
            showDeliveryNotificationConfirmation(orderId);
        }
        
        // Recarregar pedidos
        await loadOrdersFromSupabase();
        
        // Atualizar dashboard com novos dados
        await loadDashboardData();
        
        showNotification(`Status do pedido #${orderId} atualizado para ${getStatusText(newStatus)}`, 'success');
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        showNotification('Erro ao atualizar status do pedido', 'error');
    }
}

// Enviar notificação de confirmação para o cliente
async function sendOrderConfirmationNotification(orderId) {
    try {
        console.log('Enviando notificação de confirmação para o pedido:', orderId);
        
        // Obter detalhes completos do pedido
        const { data: order } = await supabaseService.supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (!order) {
            console.error('Pedido não encontrado:', orderId);
            showNotification('Pedido não encontrado', 'error');
            return;
        }
        
        // Obter número do WhatsApp da loja
        const whatsappNumber = await supabaseService.getSetting('whatsapp_number');
        if (!whatsappNumber) {
            console.error('Número do WhatsApp não configurado');
            showNotification('Número do WhatsApp não configurado', 'error');
            return;
        }
        
        // Construir mensagem de confirmação
        const confirmationMessage = `🎉 *PEDIDO CONFIRMADO!* 🎉

Olá, *${order.customer_name}*!

Seu pedido #${orderId} foi confirmado e já está em preparo! 🍳

📋 *Resumo do Pedido:*
${order.items.map((item, index) => 
    `${index + 1}. ${item.quantity}x ${item.name} - R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`
).join('\n')}

💰 *Total: R$ ${parseFloat(order.total_amount).toFixed(2).replace('.', ',')}*

📍 *Endereço de Entrega:*
${order.customer_address}
${order.customer_neighborhood ? `Bairro: ${order.customer_neighborhood}` : ''}
${order.customer_reference ? `Referência: ${order.customer_reference}` : ''}

⏰ *Previsão:* 30-45 minutos

Agradecemos a preferência! 🙏

_Pastelaria_
📞 ${whatsappNumber}`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(confirmationMessage);
        
        // Abrir WhatsApp com a mensagem de confirmação
        window.open(`https://wa.me/${order.customer_phone}?text=${encodedMessage}`, '_blank');
        
        console.log('Notificação de confirmação enviada para:', order.customer_phone);
        showNotification(`Notificação enviada para ${order.customer_name}`, 'success');
        
    } catch (error) {
        console.error('Erro ao enviar notificação de confirmação:', error);
        showNotification('Erro ao enviar notificação para o cliente', 'error');
    }
}

// Carregar itens do menu (fallback localStorage)
function loadMenuItems() {
    console.log('Carregando itens do menu do localStorage...');
    
    // Carregar do localStorage ou usar dados padrão
    const savedItems = localStorage.getItem('menuItems');
    console.log('Itens salvos no localStorage:', savedItems);
    
    if (savedItems) {
        try {
            menuItems = JSON.parse(savedItems);
            console.log('Itens carregados do localStorage:', menuItems.length);
        } catch (error) {
            console.error('Erro ao carregar itens do localStorage:', error);
            menuItems = [];
        }
    } else {
        console.log('Usando dados padrão...');
        // Dados padrão baseados no site principal
        menuItems = [
            {
                id: 1,
                name: 'Pastel de Carne',
                price: 12.90,
                category: 'pasteis',
                description: 'Carne moída temperada'
            },
            {
                id: 2,
                name: 'Pastel de Queijo',
                price: 11.90,
                category: 'pasteis',
                description: 'Queijo muçarela derretido'
            },
            {
                id: 3,
                name: 'Pastel de Frango',
                price: 12.90,
                category: 'pasteis',
                description: 'Frango desfiado com temperos especiais'
            },
            {
                id: 4,
                name: 'COMBO FAMÍLIA',
                price: 99.90,
                category: 'combos',
                description: '4 Pastéis Grandes + 2 Refrigerantes 2L'
            },
            {
                id: 5,
                name: 'Refrigerante 2L',
                price: 12.00,
                category: 'bebidas',
                description: '2L - Coca-Cola, Guaraná, Fanta, etc.'
            },
            {
                id: 6,
                name: 'Pudim de Leite',
                price: 8.50,
                category: 'sobremesas',
                description: 'Pudim tradicional com calda de caramelo'
            },
            {
                id: 7,
                name: 'Mousse de Maracujá',
                price: 7.50,
                category: 'sobremesas',
                description: 'Mousse cremoso de maracujá com polpa'
            },
            {
                id: 8,
                name: 'Açaí na Tigela',
                price: 12.00,
                category: 'sobremesas',
                description: '300ml - Açaí com banana, granola e leite em pó'
            }
        ];
        saveMenuItems();
        console.log('Dados padrão salvos no localStorage');
    }
    
    console.log('Total de itens carregados:', menuItems.length);
    renderMenuItems();
}

// Renderizar itens do menu
function renderMenuItems() {
    console.log('Renderizando menu items...');
    console.log('menuItems:', menuItems);
    console.log('filteredItems:', filteredItems);
    
    // Usar itens filtrados ou todos os itens
    const itemsToRender = filteredItems.length > 0 ? filteredItems : menuItems;
    console.log('itemsToRender:', itemsToRender);
    
    if (currentViewMode === 'grid') {
        renderGridView(itemsToRender);
    } else {
        renderListView(itemsToRender);
    }
}

// Renderizar em modo grid
function renderGridView(items) {
    console.log('Renderizando grid com', items.length, 'itens');
    
    const grid = document.getElementById('menu-items-grid');
    const list = document.getElementById('menu-items-list');
    
    console.log('Elemento grid:', grid);
    console.log('Elemento list:', list);
    
    if (!grid) {
        console.error('Elemento menu-items-grid não encontrado');
        return;
    }
    
    grid.innerHTML = '';
    list.style.display = 'none';
    grid.style.display = 'grid';
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-items">Nenhum item encontrado. Adicione itens ao cardápio.</div>';
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
<<<<<<< HEAD
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteMenuItem(${item.id})" title="Excluir item">
                <i class="fas fa-trash"></i>
            </button>
            <h3>${item.name}</h3>
            <div class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            <div class="description">${item.description || ''}</div>
            <div class="category-badge">${getCategoryName(item.category)}</div>
=======
        const imgUrl = item.image || item.image_url || (window.getDefaultCategoryIcon ? window.getDefaultCategoryIcon(item.category) : '');
        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        
        card.innerHTML = `
            <div class="admin-item-thumb" style="background-image: url('${imgUrl}'); background-size: cover; background-position: center; height: 140px; border-radius: 8px; margin-bottom: 0.8rem; position: relative;">
                <button class="delete-btn" onclick="deleteMenuItem(${item.id})" title="Excluir item" style="position: absolute; top: 8px; right: 8px; background: rgba(220, 38, 38, 0.9); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <h3 style="margin: 0 0 0.4rem 0; font-size: 1.1rem;">${item.name}</h3>
            <div class="price" style="font-weight: 700; color: #e65100; font-size: 1.1rem; margin-bottom: 0.4rem;">R$ ${itemPrice.toFixed(2).replace('.', ',')}</div>
            <div class="description" style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.6rem; line-height: 1.3;">${item.description || ''}</div>
            <div class="category-badge" style="display: inline-block; background: #fff3e0; color: #e65100; font-weight: 600; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 12px; margin-bottom: 0.8rem;">${getCategoryName(item.category)}</div>
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
            <div class="btn-group">
                <button class="btn btn-warning btn-sm" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Aumentar o grid para acomodar mais itens
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    console.log('Grid renderizado com sucesso');
}

// Renderizar em modo lista
function renderListView(items) {
    const grid = document.getElementById('menu-items-grid');
    const list = document.getElementById('menu-items-list');
    
    list.innerHTML = '';
    grid.style.display = 'none';
    list.style.display = 'flex';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.innerHTML = `
            <div class="menu-item-info">
                <div class="menu-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-category">${getCategoryName(item.category)}</div>
            </div>
            <div class="menu-item-actions">
                <button class="btn btn-warning btn-sm" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Alternar modo de visualização
function toggleViewMode() {
    const btn = document.getElementById('viewModeBtn');
    const btnText = document.getElementById('viewModeText');
    const btnIcon = btn.querySelector('i');
    
    if (currentViewMode === 'grid') {
        currentViewMode = 'list';
        btnIcon.className = 'fas fa-th';
        btnText.textContent = 'Grid';
        btn.classList.add('active');
    } else {
        currentViewMode = 'grid';
        btnIcon.className = 'fas fa-list';
        btnText.textContent = 'Lista';
        btn.classList.remove('active');
    }
    
    renderMenuItems();
}

// Pesquisar itens
function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                             (item.description && item.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    renderMenuItems();
}

// Salvar itens no localStorage/Supabase
async function saveMenuItems() {
    if (useSupabase) {
        // Já salvo individualmente via add/update/delete
        return;
    } else {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }
    
    // Notificar o site principal sobre as alterações
    notifySiteUpdate();
}

<<<<<<< HEAD
// Adicionar novo item
=======
// Atalho para selecionar imagens de exemplo por categoria
function setPresetImage(cat) {
    const presetImages = {
        'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'pasteis': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        'pizzas': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        'porcoes': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        'bebidas': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        'sobremesas': 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80',
        'combos': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
        'destaques': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    };
    const input = document.getElementById('new-item-image');
    if (input && presetImages[cat]) {
        input.value = presetImages[cat];
        showNotification('Imagem de exemplo selecionada!', 'success');
    }
}

// Restaurar cardápio padrão de testes no localStorage
function resetDefaultDemoMenu() {
    if (confirm('Deseja restaurar o cardápio de testes com hambúrgueres, pastéis, pizzas e porções? Seus itens cadastrados atualmente serão atualizados.')) {
        const DEFAULT_ITEMS = [
            { id: 1, name: 'X-Burguer Especial', price: 28.90, category: 'burgers', description: 'Hambúrguer artesanal 180g, queijo cheddar, bacon crocante, salada e molho da casa no pão brioche.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
            { id: 2, name: 'Smash Double Cheese', price: 24.90, category: 'burgers', description: 'Dois hambúrgueres smash 90g, duplo queijo derretido e maionese especial no pão artesanal.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' },
            { id: 3, name: 'Pastel de Carne com Queijo', price: 14.00, category: 'pasteis', description: 'Carne moída temperada com azeitonas e muçarela derretida em massa sequinha e crocante.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
            { id: 4, name: 'Pastel de Frango com Catupiry', price: 14.00, category: 'pasteis', description: 'Frango desfiado suculento com Catupiry cremoso e milho selecionado.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
            { id: 5, name: 'Pizza Calabresa Suprema', price: 49.90, category: 'pizzas', description: 'Molho de tomate artesanal, muçarela, fatias de calabresa especial, cebola roxa e orégano.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
            { id: 6, name: 'Pizza Margherita Especial', price: 45.90, category: 'pizzas', description: 'Molho de tomate fresco, muçarela, rodelas de tomate e folhas frescas de manjericão.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80' },
            { id: 7, name: 'Batata Frita com Cheddar e Bacon', price: 29.90, category: 'porcoes', description: 'Batatas rústicas bem crocantes cobertas com creme de cheddar e bacon frito em cubos.', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80' },
            { id: 8, name: 'Refrigerante Lata 350ml', price: 7.00, category: 'bebidas', description: 'Coca-Cola, Guaraná Antarctica ou Sprite lata bem gelados.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80' },
            { id: 9, name: 'Suco Natural de Laranja 500ml', price: 10.00, category: 'bebidas', description: 'Suco 100% natural de laranja fresca espremida na hora.', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
            { id: 10, name: 'Pudim de Leite Condensado', price: 12.00, category: 'sobremesas', description: 'Pudim caseiro cremoso e lisinho com calda de caramelo dourada.', image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80' },
            { id: 11, name: 'Combo Super Fome', price: 39.90, category: 'combos', description: '1 X-Burguer Especial + 1 Batata Frita Crocante + 1 Refrigerante lata 350ml.', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80' },
            { id: 12, name: 'Combo Casal de Pastéis', price: 32.00, category: 'combos', description: '2 Pastéis Gourmet à sua escolha + 1 Guaraná 1 Litro bem gelado.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' }
        ];
        menuItems = DEFAULT_ITEMS;
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderMenuItems();
        notifySiteUpdate();
        showNotification('Cardápio restaurado com sucesso!', 'success');
    }
}

function updateFormPreview() {
    // Atualizador silencioso de formulário
}

// Adicionar novo item (localStorage / Supabase)
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
async function addMenuItem() {
    const name = document.getElementById('new-item-name').value.trim();
    const price = document.getElementById('new-item-price').value.trim();
    const category = document.getElementById('new-item-category').value;
    const description = document.getElementById('new-item-description').value.trim();
<<<<<<< HEAD
=======
    const imageInput = document.getElementById('new-item-image')?.value.trim();
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    
    if (!name || !price) {
        showNotification('Preencha nome e preço!', 'error');
        return;
    }
    
    // Converter preço para número
    const priceNum = parseFloat(price.replace('R$', '').replace(',', '.').trim());
    
    if (isNaN(priceNum)) {
        showNotification('Preço inválido!', 'error');
        return;
    }
<<<<<<< HEAD
=======

    const image = imageInput || (window.getDefaultCategoryIcon ? window.getDefaultCategoryIcon(category) : '');
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    
    try {
        let newItem;
        
        if (useSupabase) {
<<<<<<< HEAD
            // Salvar no Supabase
=======
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
            newItem = await supabaseService.addMenuItem({
                name,
                price: priceNum,
                category,
<<<<<<< HEAD
                description: description || ''
            });
        } else {
            // Salvar no localStorage
=======
                description: description || '',
                image
            });
        } else {
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
            newItem = {
                id: Date.now(),
                name,
                price: priceNum,
                category,
<<<<<<< HEAD
                description: description || ''
=======
                description: description || '',
                image
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
            };
            menuItems.push(newItem);
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
        }
        
        // Limpar formulário
        document.getElementById('new-item-name').value = '';
        document.getElementById('new-item-price').value = '';
        document.getElementById('new-item-description').value = '';
<<<<<<< HEAD
        
        // Fechar formulário após adicionar
        toggleAddForm();
        
        // Aplicar filtros atuais
        searchItems();
        
        // Notificar site principal
        notifySiteUpdate();
        
        showNotification('Item adicionado com sucesso!', 'success');
=======
        if (document.getElementById('new-item-image')) document.getElementById('new-item-image').value = '';
        
        // Renderizar e notificar
        renderMenuItems();
        notifySiteUpdate();
        
        showNotification(`"${name}" cadastrado com sucesso na memória local!`, 'success');
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        showNotification('Erro ao adicionar item!', 'error');
    }
}

// Editar item
function editMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    // Armazenar item sendo editado
    currentEditingItem = item;
    
    // Preencher o modal com os dados do item
    document.getElementById('edit-item-name').value = item.name;
    document.getElementById('edit-item-price').value = item.price.toFixed(2).replace('.', ',');
    document.getElementById('edit-item-category').value = item.category;
    document.getElementById('edit-item-description').value = item.description || '';
    
    // Mostrar o modal
    openEditModal();
}

// Abrir modal de edição
function openEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.add('show');
    
    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('edit-item-name').focus();
    }, 100);
    
    // Adicionar evento de ESC para fechar
    document.addEventListener('keydown', handleEscapeKey);
}

// Fechar modal de edição
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    currentEditingItem = null;
    
    // Remover evento de ESC
    document.removeEventListener('keydown', handleEscapeKey);
}

// Manipular tecla ESC
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeEditModal();
    }
}

// Salvar item editado
function saveEditedItem() {
    if (!currentEditingItem) return;
    
    const name = document.getElementById('edit-item-name').value.trim();
    const price = document.getElementById('edit-item-price').value.trim();
    const category = document.getElementById('edit-item-category').value;
    const description = document.getElementById('edit-item-description').value.trim();
    
    // Validar campos obrigatórios
    if (!name || !price) {
        showNotification('Preencha nome e preço!', 'error');
        return;
    }
    
    // Converter preço para número
    const priceNum = parseFloat(price.replace('R$', '').replace(',', '.').trim());
    
    if (isNaN(priceNum)) {
        showNotification('Preço inválido!', 'error');
        return;
    }
    
    // Atualizar o item
    currentEditingItem.name = name;
    currentEditingItem.price = priceNum;
    currentEditingItem.category = category;
    currentEditingItem.description = description;
    
    // Salvar no localStorage
    saveMenuItems();
    
    // Atualizar a interface
    searchItems(); // Aplicar filtros atuais
    updateDashboardStats();
    
    // Fechar modal
    closeEditModal();
    
    // Mostrar notificação de sucesso
    showNotification('Item atualizado com sucesso!', 'success');
}

// Excluir item
function deleteMenuItem(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    menuItems = menuItems.filter(i => i.id !== id);
    saveMenuItems();
    searchItems(); // Aplicar filtros atuais
    updateDashboardStats();
    showNotification('Item excluído com sucesso!', 'success');
}

// Salvar itens no localStorage
function saveMenuItems() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Notificar o site principal sobre as alterações
    notifySiteUpdate();
}

// Notificar o site principal sobre atualizações
function notifySiteUpdate() {
    // Disparar evento personalizado para notificar o site principal
    const event = new CustomEvent('adminDataUpdated', {
        detail: {
            type: 'menuItems',
            data: menuItems
        }
    });
    
    // Se estiver na mesma janela, dispara o evento
    if (window.opener) {
        window.opener.dispatchEvent(event);
    }
    
    // Também salva um timestamp para forçar atualização
    localStorage.setItem('adminLastUpdate', Date.now().toString());
}

// Carregar configurações
function loadSettings() {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        document.getElementById('site-title').value = settings.siteTitle || '';
        document.getElementById('delivery-fee').value = settings.deliveryFee || 'R$ 5,00';
        document.getElementById('whatsapp-number').value = settings.whatsappNumber || '';
    }
}

// Salvar configurações
function saveSettings() {
    settings.siteTitle = document.getElementById('site-title').value;
    settings.deliveryFee = document.getElementById('delivery-fee').value;
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Configurações salvas com sucesso!', 'success');
}

// Carregar número do WhatsApp
function loadWhatsApp() {
    const savedWhatsApp = localStorage.getItem('whatsappNumber');
    if (savedWhatsApp) {
        document.getElementById('whatsapp-number').value = savedWhatsApp;
    } else {
<<<<<<< HEAD
        document.getElementById('whatsapp-number').value = '5519992450000';
=======
        document.getElementById('whatsapp-number').value = '5511999998888';
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    }
}

// Salvar número do WhatsApp
function saveWhatsApp() {
    const number = document.getElementById('whatsapp-number').value.trim();
    
    if (!number) {
        showNotification('Informe o número do WhatsApp!', 'error');
        return;
    }
    
    // Validar formato básico
    if (!/^\d{10,13}$/.test(number)) {
        showNotification('Número inválido! Use apenas números (DDD + número).', 'error');
        return;
    }
    
    localStorage.setItem('whatsappNumber', number);
    
    // Notificar o site principal sobre as alterações
    notifyWhatsAppUpdate();
    
    showNotification('Número do WhatsApp salvo com sucesso!', 'success');
}

// Notificar o site principal sobre atualizações do WhatsApp
function notifyWhatsAppUpdate() {
    const number = document.getElementById('whatsapp-number').value.trim();
    
    // Disparar evento personalizado para notificar o site principal
    const event = new CustomEvent('adminDataUpdated', {
        detail: {
            type: 'whatsappNumber',
            data: number
        }
    });
    
    // Se estiver na mesma janela, dispara o evento
    if (window.opener) {
        window.opener.dispatchEvent(event);
    }
    
    // Também salva um timestamp para forçar atualização
    localStorage.setItem('adminLastUpdate', Date.now().toString());
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Formatar preço automaticamente
document.getElementById('new-item-price')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    
    if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
        value = parts[0] + ',' + parts[1];
    }
    
    e.target.value = value;
});

// Formatar preço do modal de edição automaticamente
document.getElementById('edit-item-price')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    
    if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
        value = parts[0] + ',' + parts[1];
    }
    
    e.target.value = value;
});

// Formatar taxa de entrega automaticamente
document.getElementById('delivery-fee')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    
    if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
        value = parts[0] + ',' + parts[1];
    }
    
    e.target.value = value;
});

// Fechar modal ao clicar fora dele
document.getElementById('editModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        closeEditModal();
    }
});
