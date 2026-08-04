// Variáveis globais
let cart = [];
let editMode = false;
const CART_STORAGE_KEY = 'pastelaria_cart';
const MENU_ITEMS_STORAGE_KEY = 'pastelaria_menu_items';

// Elementos do DOM
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsEl = document.querySelector('.cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.querySelector('.cart-count');
const editModeToggle = document.getElementById('edit-mode-toggle');
const checkoutBtn = document.getElementById('checkout-whatsapp');

// Inicialização
console.log('Script carregado com sucesso!');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM totalmente carregado');
    
    // Inicializar Supabase se disponível
    if (window.supabaseService && !window.supabaseService.initialized) {
        try {
            await window.supabaseService.init();
            console.log('Supabase inicializado no site principal');
        } catch (error) {
            console.error('Erro ao inicializar Supabase no site principal:', error);
        }
    }
    
    loadCart();
    setupEventListeners();
    updateCartUI();
    
    // Carregar dados do cliente (agora async)
    await loadCustomerData();
    
    // Carregar itens do menu (agora async)
    await loadMenuItemsFromAdmin();
    
    // Configurar listener para atualizações do admin
    setupAdminUpdateListener();
    
    // Carregar itens do menu salvos no localStorage, se existirem
    const savedMenuItems = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
    if (savedMenuItems) {
        // Atualizar preços dos itens do menu
        const menuItemsData = JSON.parse(savedMenuItems);
        updateMenuItems(menuItemsData);
    }
});

// Configurar listener para atualizações do admin
function setupAdminUpdateListener() {
    // Escutar eventos de atualização do admin
    window.addEventListener('adminDataUpdated', async (event) => {
        console.log('Dados atualizados pelo admin:', event.detail);
        
        switch(event.detail.type) {
            case 'menuItems':
                if (event.detail.data) {
                    updateMenuItemsFromAdmin(event.detail.data);
                } else {
                    // Se não tiver dados, recarregar do Supabase
                    await loadMenuItemsFromAdmin();
                }
                break;
            case 'whatsappNumber':
                updateWhatsAppNumber(event.detail.data);
                break;
        }
    });
    
    // Verificar atualizações por timestamp (para abas diferentes)
    setInterval(async () => {
        await checkForAdminUpdates();
    }, 2000); // Verificar a cada 2 segundos
}

// Verificar atualizações do admin por timestamp
async function checkForAdminUpdates() {
    const lastUpdate = localStorage.getItem('adminLastUpdate');
    const lastChecked = localStorage.getItem('lastChecked') || '0';
    
    if (lastUpdate && lastUpdate > lastChecked) {
        console.log('Detectada atualização do admin');
        
        // Recarregar itens do menu do Supabase
        await loadMenuItemsFromAdmin();
        
        // Recarregar número do WhatsApp
        loadWhatsAppInHeader();
        
        // Atualizar timestamp
        localStorage.setItem('lastChecked', Date.now().toString());
        
        // Mostrar notificação
        showUpdateNotification('Cardápio atualizado com sucesso!');
    }
}

// Atualizar número do WhatsApp
function updateWhatsAppNumber(number) {
    const headerPhone = document.getElementById('header-phone');
    if (headerPhone) {
        const formatted = formatPhoneNumber(number);
        headerPhone.textContent = formatted;
    }
}

<<<<<<< HEAD
// Carregar itens do menu da administração
async function loadMenuItemsFromAdmin() {
    try {
        // Tentar carregar do Supabase primeiro
=======
// Dados padrão do cardápio demonstrativo (localStorage)
const DEFAULT_MENU_ITEMS = [
    {
        id: 1,
        name: 'X-Burguer Especial',
        price: 28.90,
        category: 'burgers',
        description: 'Hambúrguer artesanal 180g, queijo cheddar, bacon crocante, salada e molho da casa no pão brioche.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 2,
        name: 'Smash Double Cheese',
        price: 24.90,
        category: 'burgers',
        description: 'Dois hambúrgueres smash 90g, duplo queijo derretido e maionese especial no pão artesanal.',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 3,
        name: 'Pastel de Carne com Queijo',
        price: 14.00,
        category: 'pasteis',
        description: 'Carne moída temperada com azeitonas e muçarela derretida em massa sequinha e crocante.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 4,
        name: 'Pastel de Frango com Catupiry',
        price: 14.00,
        category: 'pasteis',
        description: 'Frango desfiado suculento com Catupiry cremoso e milho selecionado.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 5,
        name: 'Pizza Calabresa Suprema',
        price: 49.90,
        category: 'pizzas',
        description: 'Molho de tomate artesanal, muçarela, fatias de calabresa especial, cebola roxa e orégano.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 6,
        name: 'Pizza Margherita Especial',
        price: 45.90,
        category: 'pizzas',
        description: 'Molho de tomate fresco, muçarela, rodelas de tomate e folhas frescas de manjericão.',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 7,
        name: 'Batata Frita com Cheddar e Bacon',
        price: 29.90,
        category: 'porcoes',
        description: 'Batatas rústicas bem crocantes cobertas com creme de cheddar e bacon frito em cubos.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 8,
        name: 'Refrigerante Lata 350ml',
        price: 7.00,
        category: 'bebidas',
        description: 'Coca-Cola, Guaraná Antarctica ou Sprite lata bem gelados.',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 9,
        name: 'Suco Natural de Laranja 500ml',
        price: 10.00,
        category: 'bebidas',
        description: 'Suco 100% natural de laranja fresca espremida na hora.',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 10,
        name: 'Pudim de Leite Condensado',
        price: 12.00,
        category: 'sobremesas',
        description: 'Pudim caseiro cremoso e lisinho com calda de caramelo dourada.',
        image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 11,
        name: 'Combo Super Fome',
        price: 39.90,
        category: 'combos',
        description: '1 X-Burguer Especial + 1 Batata Frita Crocante + 1 Refrigerante lata 350ml.',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 12,
        name: 'Combo Casal de Pastéis',
        price: 32.00,
        category: 'combos',
        description: '2 Pastéis Gourmet à sua escolha + 1 Guaraná 1 Litro bem gelado.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 13,
        name: 'X-Burguer Especial (Destaque)',
        price: 28.90,
        category: 'destaques',
        description: 'O lanche mais pedido e elogiado do nosso delivery!',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 14,
        name: 'Combo Super Fome (Promoção)',
        price: 39.90,
        category: 'destaques',
        description: 'Combo completo com lanche, batata e bebida em preço promocional.',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80'
    }
];

// Carregar itens do menu da administração ou localStorage
async function loadMenuItemsFromAdmin() {
    try {
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
        if (window.supabaseService && window.supabaseService.initialized) {
            console.log('Carregando itens do Supabase...');
            const items = await supabaseService.getMenuItems();
            if (items && items.length > 0) {
                console.log('Itens carregados do Supabase:', items.length);
                updateMenuItemsFromAdmin(items);
                return;
            }
        }
        
<<<<<<< HEAD
        // Fallback para localStorage
=======
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
        console.log('Carregando itens do localStorage...');
        const adminMenuItems = localStorage.getItem('menuItems');
        if (adminMenuItems) {
            const items = JSON.parse(adminMenuItems);
<<<<<<< HEAD
            console.log('Itens carregados do localStorage:', items.length);
            updateMenuItemsFromAdmin(items);
        } else {
            console.log('Nenhum item encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar itens do menu:', error);
        // Fallback para localStorage
        const adminMenuItems = localStorage.getItem('menuItems');
        if (adminMenuItems) {
            const items = JSON.parse(adminMenuItems);
            updateMenuItemsFromAdmin(items);
=======
            if (items && items.length > 0) {
                console.log('Itens carregados do localStorage:', items.length);
                updateMenuItemsFromAdmin(items);
                return;
            }
        }
        
        // Inicializar localStorage com os dados de demonstração
        console.log('Inicializando localStorage com o cardápio padrão...');
        localStorage.setItem('menuItems', JSON.stringify(DEFAULT_MENU_ITEMS));
        updateMenuItemsFromAdmin(DEFAULT_MENU_ITEMS);

    } catch (error) {
        console.error('Erro ao carregar itens do menu:', error);
        const adminMenuItems = localStorage.getItem('menuItems');
        if (adminMenuItems) {
            updateMenuItemsFromAdmin(JSON.parse(adminMenuItems));
        } else {
            updateMenuItemsFromAdmin(DEFAULT_MENU_ITEMS);
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
        }
    }
}

<<<<<<< HEAD
// Atualizar itens do menu no site principal
function updateMenuItemsFromAdmin(items) {
    console.log('Atualizando itens do menu:', items);
    
    // Limpar containers primeiro para remover itens estáticos
    const containers = [
        { selector: '#pasteis .items-grid', category: 'pasteis' },
        { selector: '#combos .combo-grid', category: 'combos' },
        { selector: '#bebidas .items-grid', category: 'bebidas' },
        { selector: '#sobremesas .items-grid', category: 'sobremesas' },
        { selector: '#destaques .highlights-grid', category: 'destaques' }
    ];
    
    // Limpar todos os containers
    containers.forEach(({ selector, category }) => {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Limpar categorias estáticas também
    const categories = document.querySelectorAll('#pasteis .category, #bebidas .category');
    categories.forEach(category => {
        // Manter apenas o h3, remover o conteúdo
        const h3 = category.querySelector('h3');
        category.innerHTML = '';
        if (h3) {
            category.appendChild(h3);
        }
    });
    
    // Limpar especificamente categorias estáticas de pastéis
    const pasteisCategories = document.querySelectorAll('#pasteis .category');
    pasteisCategories.forEach(category => {
        const h3 = category.querySelector('h3');
        if (h3 && h3.textContent.includes('CATUPIRY')) {
            // Remover completamente a categoria Catupiry
            category.remove();
        } else {
            // Limpar outras categorias mantendo apenas o h3
            const grid = category.querySelector('.items-grid');
            if (grid) {
                grid.innerHTML = '';
            }
        }
    });
    
    // Atualizar pastéis
    const pasteisItems = items.filter(item => item.category === 'pasteis');
    let pasteisContainer = document.querySelector('#pasteis .items-grid');
    
    // Se não encontrar, criar um novo container
    if (!pasteisContainer) {
        const pasteisSection = document.querySelector('#pasteis');
        if (pasteisSection) {
            // Criar categoria se não existir
            let category = pasteisSection.querySelector('.category');
            if (!category) {
                category = document.createElement('div');
                category.className = 'category';
                category.innerHTML = '<h3>PASTÉIS</h3>';
                pasteisSection.appendChild(category);
            }
            
            // Criar grid se não existir
            pasteisContainer = document.createElement('div');
            pasteisContainer.className = 'items-grid';
            category.appendChild(pasteisContainer);
        }
    }
    
    if (pasteisContainer) {
        if (pasteisItems.length === 0) {
            pasteisContainer.innerHTML = '<p class="no-items">Nenhum item encontrado nesta categoria.</p>';
        } else {
            pasteisItems.forEach(item => {
                pasteisContainer.innerHTML += `
                    <div class="menu-item" data-name="${item.name}" data-price="${item.price}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="item-description">${item.description || ''}</p>
                            <p class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="minus">-</button>
                            <span class="quantity">0</span>
                            <button class="plus">+</button>
                        </div>
                        <button class="btn-add">Adicionar</button>
                    </div>
                `;
            });
        }
    }
    
    // Atualizar combos
    const combosItems = items.filter(item => item.category === 'combos');
    const combosContainer = document.querySelector('#combos .combo-grid');
    if (combosContainer) {
        if (combosItems.length === 0) {
            combosContainer.innerHTML = '<p class="no-items">Nenhum item encontrado nesta categoria.</p>';
        } else {
            combosItems.forEach(item => {
                combosContainer.innerHTML += `
                    <div class="combo-item" data-name="${item.name}" data-price="${item.price}">
                        <div class="combo-info">
                            <h3>${item.name}</h3>
                            <p class="combo-description">${item.description || ''}</p>
                            <p class="combo-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="minus">-</button>
                            <span class="quantity">0</span>
                            <button class="plus">+</button>
                        </div>
                        <button class="btn-add">Adicionar</button>
                    </div>
                `;
            });
        }
    }
    
    // Atualizar bebidas
    const bebidasItems = items.filter(item => item.category === 'bebidas');
    const bebidasContainer = document.querySelector('#bebidas .items-grid');
    if (bebidasContainer) {
        if (bebidasItems.length === 0) {
            bebidasContainer.innerHTML = '<p class="no-items">Nenhum item encontrado nesta categoria.</p>';
        } else {
            bebidasItems.forEach(item => {
                bebidasContainer.innerHTML += `
                    <div class="menu-item" data-name="${item.name}" data-price="${item.price}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="item-description">${item.description || ''}</p>
                            <p class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="minus">-</button>
                            <span class="quantity">0</span>
                            <button class="plus">+</button>
                        </div>
                        <button class="btn-add">Adicionar</button>
                    </div>
                `;
            });
        }
    }
    
    // Atualizar sobremesas
    const sobremesasItems = items.filter(item => item.category === 'sobremesas');
    const sobremesasContainer = document.querySelector('#sobremesas .items-grid');
    if (sobremesasContainer) {
        if (sobremesasItems.length === 0) {
            sobremesasContainer.innerHTML = '<p class="no-items">Nenhum item encontrado nesta categoria.</p>';
        } else {
            sobremesasItems.forEach(item => {
                sobremesasContainer.innerHTML += `
                    <div class="menu-item" data-name="${item.name}" data-price="${item.price}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="item-description">${item.description || ''}</p>
                            <p class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="minus">-</button>
                            <span class="quantity">0</span>
                            <button class="plus">+</button>
                        </div>
                        <button class="btn-add">Adicionar</button>
                    </div>
                `;
            });
        }
    }
    
    // Atualizar destaques
    const destaquesItems = items.filter(item => item.category === 'destaques');
    const destaquesContainer = document.querySelector('#destaques .highlights-grid');
    if (destaquesContainer) {
        if (destaquesItems.length === 0) {
            destaquesContainer.innerHTML = '<p class="no-items">Nenhum item encontrado nesta categoria.</p>';
        } else {
            destaquesItems.forEach(item => {
                destaquesContainer.innerHTML += `
                    <div class="highlight-item" data-name="${item.name}" data-price="${item.price}">
                        <h3>${item.name}</h3>
                        <p class="highlight-description">${item.description || ''}</p>
                        <p class="highlight-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <button class="btn-add-to-cart">Adicionar ao Carrinho</button>
                    </div>
                `;
            });
        }
    }
    
    // Recarregar event listeners
    setupEventListeners();
    
    // Mostrar notificação de atualização (opcional)
    showUpdateNotification('Cardápio atualizado com sucesso!');
=======
// Imagens padrão por categoria
function getDefaultCategoryIcon(category) {
    const icons = {
        'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'pasteis': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        'pizzas': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        'porcoes': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        'bebidas': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        'sobremesas': 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80',
        'combos': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
        'destaques': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    };
    return icons[category] || icons['burgers'];
}

// Atualizar itens do menu no site principal
function updateMenuItemsFromAdmin(items) {
    console.log('Atualizando itens do menu principal:', items);
    
    const categoriesList = ['burgers', 'pasteis', 'pizzas', 'porcoes', 'bebidas', 'sobremesas', 'combos', 'destaques'];
    
    categoriesList.forEach(cat => {
        const section = document.getElementById(cat);
        if (!section) return;
        
        let container = section.querySelector('.items-grid') || section.querySelector('.combo-grid') || section.querySelector('.highlights-grid');
        
        if (!container) {
            container = document.createElement('div');
            container.className = cat === 'combos' ? 'combo-grid' : cat === 'destaques' ? 'highlights-grid' : 'items-grid';
            section.appendChild(container);
        }
        
        container.innerHTML = '';
        const categoryItems = items.filter(item => item.category === cat);
        
        if (categoryItems.length === 0) {
            container.innerHTML = '<p class="no-items"><i class="fas fa-info-circle"></i> Nenhum alimento cadastrado nesta categoria. Adicione no Painel Admin!</p>';
            return;
        }
        
        categoryItems.forEach(item => {
            const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
            const formattedPrice = `R$ ${itemPrice.toFixed(2).replace('.', ',')}`;
            const itemImage = item.image || item.image_url || getDefaultCategoryIcon(cat);
            
            if (cat === 'destaques') {
                container.innerHTML += `
                    <div class="highlight-item" data-name="${item.name}" data-price="${itemPrice}" style="background-image: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url('${itemImage}');">
                        <div class="highlight-content">
                            <h3>${item.name}</h3>
                            <p class="highlight-description">${item.description || ''}</p>
                            <div class="highlight-price">${formattedPrice}</div>
                            <button class="btn-add-to-cart"><i class="fas fa-plus"></i> Adicionar ao Carrinho</button>
                        </div>
                    </div>
                `;
            } else if (cat === 'combos') {
                container.innerHTML += `
                    <div class="combo-item" data-name="${item.name}" data-price="${itemPrice}">
                        <div class="combo-image" style="background-image: url('${itemImage}');">
                            <div class="combo-tag">OFERTA ESPECIAL</div>
                        </div>
                        <div class="combo-content">
                            <h3>${item.name}</h3>
                            <p class="combo-description">${item.description || ''}</p>
                            <div class="combo-price">
                                <span class="discounted-price">${formattedPrice}</span>
                            </div>
                            <div class="combo-actions">
                                <div class="item-quantity">
                                    <button class="minus">-</button>
                                    <span class="quantity">0</span>
                                    <button class="plus">+</button>
                                </div>
                                <button class="btn-add"><i class="fas fa-cart-plus"></i> Adicionar</button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML += `
                    <div class="menu-item" data-name="${item.name}" data-price="${itemPrice}">
                        <div class="item-image-wrapper">
                            <img src="${itemImage}" alt="${item.name}" class="item-img" onerror="this.src='${getDefaultCategoryIcon(cat)}'">
                        </div>
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="item-description">${item.description || ''}</p>
                            <p class="item-price">${formattedPrice}</p>
                        </div>
                        <div class="item-actions">
                            <div class="item-quantity">
                                <button class="minus">-</button>
                                <span class="quantity">0</span>
                                <button class="plus">+</button>
                            </div>
                            <button class="btn-add"><i class="fas fa-plus"></i> Adicionar</button>
                        </div>
                    </div>
                `;
            }
        });
    });
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
}

// Mostrar notificação de atualização
function showUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Carregar dados do cliente salvos
async function loadCustomerData() {
    const savedCustomerData = localStorage.getItem('customerData');
    if (savedCustomerData) {
        const customerData = JSON.parse(savedCustomerData);
        
        // Preencher os campos com os dados salvos
        if (customerData.name) document.getElementById('customer-name').value = customerData.name;
        if (customerData.neighborhood) document.getElementById('customer-neighborhood').value = customerData.neighborhood;
        if (customerData.address) document.getElementById('customer-address').value = customerData.address;
        if (customerData.reference) document.getElementById('customer-reference').value = customerData.reference;
        if (customerData.phone) document.getElementById('customer-phone').value = customerData.phone;
        if (customerData.observations) document.getElementById('customer-observations').value = customerData.observations;
    }
    
    // Carregar número do WhatsApp no header
    await loadWhatsAppInHeader();
}

// Carregar número do WhatsApp no header
async function loadWhatsAppInHeader() {
    try {
        // Tentar carregar do Supabase primeiro
        if (window.supabaseService && window.supabaseService.initialized) {
            const whatsappNumber = await supabaseService.getSetting('whatsapp_number');
            if (whatsappNumber) {
                updateWhatsAppNumber(whatsappNumber);
                return;
            }
        }
        
        // Fallback para localStorage
        const savedWhatsApp = localStorage.getItem('whatsappNumber');
        if (savedWhatsApp) {
            updateWhatsAppNumber(savedWhatsApp);
        }
    } catch (error) {
        console.error('Erro ao carregar WhatsApp:', error);
        // Fallback para localStorage
        const savedWhatsApp = localStorage.getItem('whatsappNumber');
        if (savedWhatsApp) {
            updateWhatsAppNumber(savedWhatsApp);
        }
    }
}

// Formatar número de telefone para exibição
function formatPhoneNumber(number) {
    // Remover caracteres não numéricos
    const clean = number.replace(/\D/g, '');
    
    // Verificar se tem DDD + número (ex: 5519992450000)
    if (clean.length === 11 && clean.startsWith('55')) {
        // Formato: (19) 99245-0000
        const ddd = clean.substring(2, 4);
        const firstPart = clean.substring(4, 9);
        const secondPart = clean.substring(9, 13);
        return `(${ddd}) ${firstPart}-${secondPart}`;
    } else if (clean.length === 10) {
        // Formato: (19) 9245-0000
        const ddd = clean.substring(0, 2);
        const firstPart = clean.substring(2, 6);
        const secondPart = clean.substring(6, 10);
        return `(${ddd}) ${firstPart}-${secondPart}`;
    }
    
    // Retornar original se não conseguir formatar
    return number;
}

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    console.log('Botão de carrinho:', cartBtn);
    console.log('Botão de fechar carrinho:', closeCartBtn);
    
    // Evitar adicionar listeners múltiplas vezes
    if (window.eventListenersSetup) {
        console.log('Event listeners já configurados');
        return;
    }
    
    // Carrinho
    cartBtn.addEventListener('click', function() {
        console.log('Abrindo carrinho');
        toggleCart();
    });
    
    closeCartBtn.addEventListener('click', function() {
        console.log('Fechando carrinho');
        toggleCart();
    });
    
    // Navegação por seções
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const section = document.getElementById(category);
            if (section) {
                // Fechar o carrinho se estiver aberto
                if (cartOverlay.classList.contains('active')) {
                    toggleCart();
                }
                
                // Rolagem suave para a seção
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Atualizar botão ativo
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Ações (cardápio + carrinho) - usar delegação de eventos única
    if (!window.mainClickListenerAdded) {
        document.addEventListener('click', async (e) => {
            const plusBtn = e.target.closest('button.plus');
            const minusBtn = e.target.closest('button.minus');
            const addBtn = e.target.closest('button.btn-add');
            const addToCartBtn = e.target.closest('button.btn-add-to-cart');
            const removeAllBtn = e.target.closest('button.cart-item-remove');
     
            // Finalizar pedido
            if (e.target === checkoutBtn || e.target.closest('#checkout-whatsapp')) {
                await checkout();
                return;
            }
     
            // Lixeira do carrinho: remove todos os itens iguais
            if (removeAllBtn) {
                const cartItemEl = removeAllBtn.closest('.cart-item');
                const name = cartItemEl?.dataset?.name;
                if (name) {
                    removeAllFromCartByName(name);
                }
                return;
            }
     
            // Botões +/- dentro do carrinho: alteram o carrinho
            if (plusBtn || minusBtn) {
                const cartItemEl = (plusBtn || minusBtn).closest('.cart-item');
                if (cartItemEl) {
                    const name = cartItemEl.dataset?.name;
                    if (name) {
                        if (plusBtn) changeCartItemQuantityByName(name, +1);
                        if (minusBtn) changeCartItemQuantityByName(name, -1);
                    }
                    return;
                }
     
                // Botões +/- no cardápio: apenas mudam a quantidade exibida
                const menuItemEl = (plusBtn || minusBtn).closest('.menu-item, .combo-item');
                if (menuItemEl) {
                    updateMenuDisplayedQuantity(menuItemEl, plusBtn ? +1 : -1);
                }
                return;
            }
     
            // Botão "Adicionar" (cardápio): adiciona a quantidade selecionada
            if (addBtn) {
                const menuItemEl = addBtn.closest('.menu-item, .combo-item');
                const qty = getMenuDisplayedQuantity(menuItemEl);
                if (!qty) {
                    showNotification('Selecione a quantidade antes de adicionar.', 'error');
                    return;
                }
                addToCart(menuItemEl, qty);
                setMenuDisplayedQuantity(menuItemEl, 0);
                return;
            }
     
            // Botão "Adicionar ao Carrinho" (destaques)
            if (addToCartBtn) {
                const highlightItemEl = addToCartBtn.closest('.highlight-item');
                addToCart(highlightItemEl, 1);
                return;
            }
        });
        
        window.mainClickListenerAdded = true;
    }
    
    // Event listeners para edição de preços (modo admin)
    document.addEventListener('blur', (e) => {
        if (e.target.classList.contains('item-price') && editMode) {
            saveMenuItems();
        }
    }, true);
    
    // Permitir apenas números e vírgula nos preços
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('item-price') && editMode) {
            // Formatar o valor para o padrão R$ X,XX
            let value = e.target.textContent.replace(/[^0-9,]/g, '');
            const parts = value.split(',');
            
            if (parts.length > 1) {
                // Garantir apenas 2 casas decimais
                parts[1] = parts[1].substring(0, 2);
                value = parts[0] + ',' + parts[1];
            }
            
            // Atualizar o valor formatado
            e.target.textContent = 'R$ ' + value.replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            // Mover o cursor para o final
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(e.target);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
    
    window.eventListenersSetup = true;
    console.log('Event listeners configurados com sucesso');
}

// Alternar o modo de edição
function toggleEditMode() {
    editMode = !editMode;
    const prices = document.querySelectorAll('.item-price');
    
    if (editMode) {
        editModeToggle.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
        editModeToggle.style.backgroundColor = '#27ae60';
        editModeToggle.style.color = 'white';
    } else {
        editModeToggle.innerHTML = '<i class="fas fa-edit"></i> Modo Edição';
        editModeToggle.style.backgroundColor = '';
        editModeToggle.style.color = '';
        saveMenuItems();
    }
    
    // Ativar/desativar edição dos preços
    prices.forEach(priceEl => {
        priceEl.contentEditable = editMode;
    });
}

// Salvar itens do menu no localStorage
function saveMenuItems() {
    const menuItems = [];
    const itemElements = document.querySelectorAll('.menu-item, .combo-item');
    
    itemElements.forEach(itemEl => {
        const name = itemEl.querySelector('h4')?.textContent || '';
        const priceText = itemEl.querySelector('.item-price')?.textContent || '';
        const price = parseFloat(priceText.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
        const category = itemEl.closest('.category')?.querySelector('h3')?.textContent || '';
        
        menuItems.push({
            name,
            price,
            category,
            description: itemEl.querySelector('p')?.textContent || ''
        });
    });
    
    localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(menuItems));
}

// Atualizar itens do menu com dados salvos
function updateMenuItems(menuItemsData) {
    const itemElements = document.querySelectorAll('.menu-item, .combo-item');
    
    itemElements.forEach(itemEl => {
        const name = itemEl.querySelector('h4')?.textContent.trim() || '';
        const category = itemEl.closest('.category')?.querySelector('h3')?.textContent.trim() || '';
        
        // Encontrar item correspondente nos dados salvos
        const savedItem = menuItemsData.find(item => 
            item.name === name && item.category === category
        );
        
        if (savedItem) {
            const priceEl = itemEl.querySelector('.item-price');
            if (priceEl) {
                priceEl.textContent = 'R$ ' + savedItem.price.toFixed(2).replace('.', ',');
            }
            
            const descriptionEl = itemEl.querySelector('p');
            if (descriptionEl && savedItem.description) {
                descriptionEl.textContent = savedItem.description;
            }
        }
    });
 }

function getItemDataFromElement(itemEl) {
    if (!itemEl) return null;
 
    const name = (itemEl.querySelector('h4')?.textContent || itemEl.querySelector('h3')?.textContent || '').trim();
    if (!name) return null;
 
    const priceEl = itemEl.querySelector('.item-price, .highlight-price, .discounted-price');
    const priceText = priceEl?.textContent || '';
    const price = parseFloat(priceText.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
 
    const description = (
        itemEl.querySelector('.item-description')?.textContent ||
        itemEl.querySelector('p')?.textContent ||
        itemEl.querySelector('.combo-description')?.textContent ||
        ''
    ).trim();
 
    return { name, price, description };
}

function addToCartByData(itemData, quantityToAdd = 1) {
    if (!itemData || !quantityToAdd) return;
 
    const { name, price, description } = itemData;
 
    // Verificar se o item já está no carrinho
    const existingItem = cart.find(item => item.name === name);
 
    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({
            name,
            price,
            quantity: quantityToAdd,
            description
        });
    }
 
    saveCart();
    updateCartUI();
    showNotification('Item adicionado ao carrinho!');
}

// Adicionar item ao carrinho
function addToCart(itemEl, quantityToAdd = 1) {
    const itemData = getItemDataFromElement(itemEl);
    addToCartByData(itemData, quantityToAdd);
}

function changeCartItemQuantityByName(name, delta) {
    const existingItem = cart.find(item => item.name === name);
    if (!existingItem) return;
 
    existingItem.quantity += delta;
    if (existingItem.quantity <= 0) {
        cart = cart.filter(item => item.name !== name);
    }
 
    saveCart();
    updateCartUI();
}

function removeAllFromCartByName(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
}

function getMenuDisplayedQuantity(menuItemEl) {
    const qtyEl = menuItemEl?.querySelector('.item-quantity .quantity');
    const qty = parseInt(qtyEl?.textContent || '0', 10);
    return Number.isFinite(qty) ? qty : 0;
}

function setMenuDisplayedQuantity(menuItemEl, qty) {
    const qtyEl = menuItemEl?.querySelector('.item-quantity .quantity');
    if (!qtyEl) return;
    qtyEl.textContent = String(Math.max(0, qty));
}

function updateMenuDisplayedQuantity(menuItemEl, delta) {
    const current = getMenuDisplayedQuantity(menuItemEl);
    setMenuDisplayedQuantity(menuItemEl, current + delta);
}

// Atualizar a interface do carrinho
function updateCartUI() {
    // Atualizar contador do carrinho
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    
    // Atualizar itens do carrinho
    cartItemsEl.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotalEl.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.dataset.name = item.name;
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                    <button class="cart-item-remove" title="Remover todos">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
        `;
        
        cartItemsEl.appendChild(cartItemEl);
    });
    
    // Atualizar total
    cartTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Alternar visibilidade do carrinho
function toggleCart() {
    console.log('toggleCart chamado');
    console.log('Estado atual do carrinho (antes):', cartOverlay.classList.contains('active') ? 'aberto' : 'fechado');
    cartOverlay.classList.toggle('active');
    console.log('Estado atual do carrinho (depois):', cartOverlay.classList.contains('active') ? 'aberto' : 'fechado');
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Finalizar pedido via WhatsApp
async function checkout() {
    if (cart.length === 0) {
        showNotification('Adicione itens ao carrinho primeiro!', 'error');
        return;
    }
    
    // Verificar se os dados de entrega estão preenchidos
    const customerName = document.getElementById('customer-name').value.trim();
    const customerNeighborhood = document.getElementById('customer-neighborhood').value;
    const customerAddress = document.getElementById('customer-address').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    
    // Se algum campo obrigatório estiver vazio, expandir e mostrar erro
    if (!customerName || !customerNeighborhood || !customerAddress || !customerPhone) {
        // Expandir a seção de dados de entrega
        const customerInfo = document.getElementById('customer-info');
        customerInfo.classList.add('expanded');
        
        // Mostrar notificação de erro
        showNotification('Por favor, preencha todos os dados obrigatórios para entrega!', 'error');
        
        // Focar no primeiro campo vazio
        if (!customerName) {
            document.getElementById('customer-name').focus();
        } else if (!customerNeighborhood) {
            document.getElementById('customer-neighborhood').focus();
        } else if (!customerAddress) {
            document.getElementById('customer-address').focus();
        } else if (!customerPhone) {
            document.getElementById('customer-phone').focus();
        }
        
        return;
    }
    
    // Obter dados opcionais
    const customerReference = document.getElementById('customer-reference').value.trim();
    const customerObservations = document.getElementById('customer-observations').value.trim();
    
    // Salvar dados do cliente no localStorage
    const customerData = {
        name: customerName,
        neighborhood: customerNeighborhood,
        address: customerAddress,
        reference: customerReference,
        phone: customerPhone,
        observations: customerObservations
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
    
    // Número de telefone da loja (carregar do localStorage ou usar padrão)
    const savedWhatsApp = localStorage.getItem('whatsappNumber');
<<<<<<< HEAD
    const phoneNumber = savedWhatsApp || '5519992450000';
=======
    const phoneNumber = savedWhatsApp || '5511999998888';
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)
    
    // Construir mensagem
    let message = 'Olá! Gostaria de fazer um pedido:\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const descriptionText = item.description ? ` (${item.description})` : '';
        message += `${index + 1}. ${item.quantity}x ${item.name}${descriptionText} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    if (selectedPaymentMethod) {
        message += `Forma de pagamento: ${selectedPaymentMethod}\n\n`;
    }
    message += 'Dados para entrega:\n';
    message += `Nome: ${customerName}\n`;
    message += `Bairro: ${customerNeighborhood}\n`;
    message += `Endereço: ${customerAddress}\n`;
    if (customerReference) {
        message += `Ponto de referência: ${customerReference}\n`;
    }
    message += `Telefone: ${customerPhone}\n`;
    if (customerObservations) {
        message += `\nObservações: ${customerObservations}`;
    }
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp com a mensagem
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Salvar pedido no Supabase
    await saveOrderToSupabase(customerData, message, total, selectedPaymentMethod);
    
    // Limpar carrinho após o pedido
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Salvar pedido no Supabase
async function saveOrderToSupabase(customerData, message, total, paymentMethod) {
    try {
        // Verificar se o Supabase está disponível
        if (window.supabaseService && window.supabaseService.initialized) {
            console.log('Salvando pedido no Supabase...');
            
            const orderData = {
                customer_name: customerData.name,
                customer_phone: customerData.phone,
                customer_address: customerData.address,
                customer_neighborhood: customerData.neighborhood,
                customer_reference: customerData.reference || '',
                customer_observations: customerData.observations || '',
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    description: item.description || ''
                })),
                total_amount: total,
                delivery_fee: 5.00, // Taxa de entrega padrão
                payment_method: paymentMethod || '',
                status: 'pending',
                whatsapp_message: message
            };
            
            const savedOrder = await supabaseService.createOrder(orderData);
            console.log('Pedido salvo no Supabase:', savedOrder);
            showNotification('Pedido salvo com sucesso! ID: ' + savedOrder.id, 'success');
        } else {
            console.log('Supabase não disponível, pedido não salvo no banco');
            showNotification('Pedido enviado para WhatsApp, mas não foi salvo no sistema', 'warning');
        }
    } catch (error) {
        console.error('Erro ao salvar pedido no Supabase:', error);
        showNotification('Erro ao salvar pedido no sistema', 'error');
    }
}

// Toggle para expandir/recolher dados de entrega
function toggleCustomerInfo() {
    const customerInfo = document.getElementById('customer-info');
    customerInfo.classList.toggle('expanded');
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Adicionar estilos para notificações
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #27ae60;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .empty-cart {
        text-align: center;
        color: var(--dark-gray);
        padding: 2rem 0;
    }
    
    .item-actions {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
    }
`;

document.head.appendChild(style);
