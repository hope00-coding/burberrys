  // Slider functionality
const slider = document.getElementById('slider');
const prevButtons = document.querySelectorAll('.nav-arrow.prev');
const nextButtons = document.querySelectorAll('.nav-arrow.next');
const indicators = document.querySelectorAll('.indicator');
let currentIndex = 0;
const totalSlides = 5;

// Sepet verileri için localStorage kullanımı
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update slider position
function updateSlider() {
    if (slider) {
        slider.style.transform = `translateX(-${currentIndex * 20}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Previous slide function
function prevSlide() {
    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
    updateSlider();
}

// Next slide function
function nextSlide() {
    currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
    updateSlider();
}

// Add event listeners
if (prevButtons.length > 0) {
    prevButtons.forEach(button => {
        button.addEventListener('click', prevSlide);
    });
}

if (nextButtons.length > 0) {
    nextButtons.forEach(button => {
        button.addEventListener('click', nextSlide);
    });
}

if (indicators.length > 0) {
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            currentIndex = parseInt(indicator.getAttribute('data-index'));
            updateSlider();
        });
    });
}

// Ürün verileri
const products = [
    {
        id: 1,
        brand: "Chanel",
        name: "Coco Mademoiselle",
        price: 289.99,
        image: "/e1.jpg",
        gender: "female",
        sizes: ["50ml", "100ml"],
        types: ["floral", "oriental"],
        available: true
    },
    {
        id: 2,
        brand: "Dior",
        name: "Sauvage",
        price: 349.99,
        image: "/e2.jpg",
        gender: "male",
        sizes: ["50ml", "100ml", "200ml"],
        types: ["fresh", "woody"],
        available: true
    },
    {
        id: 3,
        brand: "Tom Ford",
        name: "Black Orchid",
        price: 499.99,
        image: "/e3.jpg",
        gender: "unisex",
        sizes: ["50ml", "100ml"],
        types: ["oriental", "spicy"],
        available: true
    },
    {
        id: 4,
        brand: "Gucci",
        name: "Guilty",
        price: 259.99,
        image: "/e4.jpg",
        gender: "female",
        sizes: ["30ml", "50ml", "100ml"],
        types: ["floral", "oriental"],
        available: true
    },
    {
        id: 5,
        brand: "Chanel",
        name: "Bleu de Chanel",
        price: 329.99,
        image: "/e5.jpg",
        gender: "male",
        sizes: ["50ml", "100ml"],
        types: ["fresh", "woody"],
        available: true
    },
    {
        id: 6,
        brand: "Dior",
        name: "J'adore",
        price: 369.99,
        image: "/e6.jpg",
        gender: "female",
        sizes: ["50ml", "100ml"],
        types: ["floral"],
        available: true
    },
    {
        id: 7,
        brand: "Tom Ford",
        name: "Tobacco Vanille",
        price: 589.99,
        image: "/e7.jpg",
        gender: "unisex",
        sizes: ["50ml", "100ml"],
        types: ["woody", "spicy"],
        available: true
    },
    {
        id: 8,
        brand: "Gucci",
        name: "Bloom",
        price: 299.99,
        image: "/e8.jpg",
        gender: "female",
        sizes: ["30ml", "50ml", "100ml"],
        types: ["floral"],
        available: true
    },
    {
        id: 9,
        brand: "Chanel",
        name: "Chance",
        price: 279.99,
        image: "/e9.jpg",
        gender: "female",
        sizes: ["50ml", "100ml"],
        types: ["floral", "fresh"],
        available: true
    }
];

// Sayfalama değişkenleri
const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;
let filteredProducts = [...products];

// Active filters
const activeFilters = {
    brand: [],
    gender: [],
    price: [],
    size: [],
    type: [],
    category: [],
    color: []
};

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products
    renderProducts(products);

    // Setup filter listeners
    setupFilterListeners();

    // Setup collapsible filters
    setupCollapsibleFilters();

    // Setup pagination
    updatePagination();

    // Sepet sayacını güncelle
    updateCartCount();
});

// Filter listener'ları kurma
function setupFilterListeners() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value');

            if (this.checked) {
                if (!activeFilters[filterType].includes(filterValue)) {
                    activeFilters[filterType].push(filterValue);
                }
            } else {
                const index = activeFilters[filterType].indexOf(filterValue);
                if (index > -1) {
                    activeFilters[filterType].splice(index, 1);
                }
            }

            applyFilters();
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
}

// Filtreleri uygula
function applyFilters() {
    let filtered = [...products];

    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }

    if (activeFilters.brand && activeFilters.brand.length > 0) {
        filtered = filtered.filter(product => {
            return activeFilters.brand.some(brandFilter =>
                brandFilter.toLowerCase() === product.brand.toLowerCase()
            );
        });
    }

    if (activeFilters.gender && activeFilters.gender.length > 0) {
        filtered = filtered.filter(product => {
            return activeFilters.gender.includes(product.gender);
        });
    }

    if (activeFilters.category && activeFilters.category.length > 0) {
        filtered = filtered.filter(product => {
            return product.category && activeFilters.category.includes(product.category);
        });
    }

    if (activeFilters.color && activeFilters.color.length > 0) {
        filtered = filtered.filter(product => {
            return product.color && activeFilters.color.includes(product.color);
        });
    }

    if (activeFilters.price && activeFilters.price.length > 0) {
        filtered = filtered.filter(product => {
            let price = product.price;
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[$₺]/g, ''));
            }

            return activeFilters.price.some(range => {
                switch (range) {
                    case '0-100': return price >= 0 && price <= 100;
                    case '100-250': return price > 100 && price <= 250;
                    case '250-500': return price > 250 && price <= 500;
                    case '500+': return price > 500;
                    default: return false;
                }
            });
        });
    }

    if (activeFilters.size && activeFilters.size.length > 0) {
        filtered = filtered.filter(product => {
            return product.sizes && activeFilters.size.some(size => 
                product.sizes.includes(size)
            );
        });
    }

    renderProducts(filtered);
}

// Tüm filtreleri temizle
function clearAllFilters() {
    Object.keys(activeFilters).forEach(key => {
        activeFilters[key] = [];
    });

    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    renderProducts(products);
}

// Collapsible filter kategorilerini kur
function setupCollapsibleFilters() {
    const filterHeaders = document.querySelectorAll('.filter-header');

    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const category = this.parentElement;
            const content = category.querySelector('.filter-content');

            category.classList.toggle('active');
            if (content) {
                content.style.display = category.classList.contains('active') ? 'block' : 'none';
            }
        });
    });

    if (filterHeaders.length > 0) {
        const firstCategory = filterHeaders[0].parentElement;
        firstCategory.classList.add('active');
        const firstContent = firstCategory.querySelector('.filter-content');
        if (firstContent) {
            firstContent.style.display = 'block';
        }
    }
}

// Ana render fonksiyonu
function renderProducts(productsToRender) {
    filteredProducts = productsToRender;
    currentPage = 1;
    renderCurrentPage();
    updatePagination();
}

// Mevcut sayfadaki ürünleri render et
function renderCurrentPage() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Arama kriterlerinize uygun ürün bulunamadı.</div>';
        return;
    }

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

    currentPageProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const sizeOptions = product.sizes.map(size => {
            return `<div class="size-option" data-size="${size}">${size}</div>`;
        }).join('');

        const typesTags = product.types.map(type => {
            let displayName = type;
            switch (type) {
                case 'floral': displayName = 'Çiçeksi'; break;
                case 'woody': displayName = 'Odunsu'; break;
                case 'fresh': displayName = 'Fresh'; break;
                case 'spicy': displayName = 'Baharatlı'; break;
                case 'oriental': displayName = 'Oryantal'; break;
            }
            return `<span class="category-tag">${displayName}</span>`;
        }).join('');

        let priceDisplay = '';
        if (typeof product.price === 'string') {
            priceDisplay = product.price;
        } else {
            priceDisplay = product.price.toFixed(2) + '₺';
        }

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-category">${typesTags}</div>
                <div class="product-price">${priceDisplay}</div>
                <div class="product-actions">
                    <div class="product-size">${sizeOptions}</div>
                    <button class="add-to-cart" data-product-id="${product.id}">Sepete Ekle</button>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    setupProductListeners();
}

// Ürün listener'larını kur
function setupProductListeners() {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parentElement = this.parentElement;
            parentElement.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const productCard = this.closest('.product-card');
            const activeSizeOption = productCard.querySelector('.size-option.active');

            let selectedSize = '';
            if (activeSizeOption) {
                selectedSize = activeSizeOption.getAttribute('data-size');
            }

            if (selectedSize) {
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(productId, product, selectedSize);
                }
            } else {
                alert('Lütfen bir boyut seçin!');
            }
        });
    });
}

// Sayfalama güncelle
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'page-nav prev';
        prevButton.innerHTML = '←';
        prevButton.addEventListener('click', () => {
            currentPage--;
            renderCurrentPage();
            updatePagination();
        });
        paginationContainer.appendChild(prevButton);
    }

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        const firstPage = document.createElement('button');
        firstPage.className = 'page-number';
        firstPage.textContent = '1';
        firstPage.addEventListener('click', () => {
            currentPage = 1;
            renderCurrentPage();
            updatePagination();
        });
        paginationContainer.appendChild(firstPage);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = currentPage === i ? 'page-number active' : 'page-number';
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderCurrentPage();
            updatePagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }

        const lastPage = document.createElement('button');
        lastPage.className = 'page-number';
        lastPage.textContent = totalPages;
        lastPage.addEventListener('click', () => {
            currentPage = totalPages;
            renderCurrentPage();
            updatePagination();
        });
        paginationContainer.appendChild(lastPage);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'page-nav next';
        nextButton.innerHTML = '→';
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderCurrentPage();
            updatePagination();
        });
        paginationContainer.appendChild(nextButton);
    }
}

// Sepete ekleme fonksiyonu
function addToCart(productId, product, selectedSize) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && item.size === selectedSize
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.location.href = 'sepet.html';
}

// Sepet sayacını güncelle
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}