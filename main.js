/* ==========================================================================
   Ruven Studio - Interactive Application Script
   SPA Router, Cart State, Product Details, Zoom, & Prayer Wall
   ========================================================================== */

// 1. PRODUCT DATABASE
const PRODUCTS = [
  {
    id: "tee-romans-13-12",
    title: "Armor of Light Heavyweight Tee",
    price: 1999,
    originalPrice: 2499,
    tag: "New Release",
    sizes: ["S", "M", "L", "XL"],
    image: "/oversized_tee_product.png",
    category: "oversized-tees",
    verseQuote: "The night is nearly over; the day is almost here. So let us put aside the deeds of darkness and put on the armor of light.",
    verseRef: "Romans 13:12",
    verseMeaning: "Designed to encourage believers to walk in spiritual clarity, strength, and integrity. The linear shield represents faith acting as a protective barrier in modern environments.",
    fabricDetails: "100% premium ring-spun organic cotton. 240 GSM heavy French Terry structure. Custom oversized boxy cut, ribbed crew neck collar, double-needle stitched cuffs, pre-shrunk to prevent sizing changes.",
    designStory: "This design marks Ruven Studio's commitment to visual ministry. The clean shield illustration merges modern minimalism with historic faith symbolism, acting as an open doorway for conversation on campus or in the creative office."
  },
  {
    id: "hoodie-romans-12-2",
    title: "Renewal of Mind French Terry Hoodie",
    price: 3499,
    originalPrice: 4299,
    tag: "Best Seller",
    sizes: ["M", "L", "XL"],
    image: "/faith_hoodie_product.png",
    category: "hoodies",
    verseQuote: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    verseRef: "Romans 12:2",
    verseMeaning: "In a noisy, modern society pulling youth in various directions, this scripture serves as a quiet reminder to align our thoughts in Christ, creating a sanctuary of peace in the mind.",
    fabricDetails: "80% premium organic cotton, 20% polyester for durability. Ultra-heavy 380 GSM combed French Terry. Cozy loop-back lining, double-lined hood with no drawstrings for a clean Scandinavian silhouette, dropped shoulders.",
    designStory: "The delicate embroidered olive branch on the chest signifies peace, renewal, and spiritual restoration. Built to last a lifetime, this hoodie represents comfort, stillness, and mindful living."
  }
];

// INITIAL PRAYERS DATA
const INITIAL_PRAYERS = [
  {
    id: 1,
    author: "Amit K.",
    location: "Mumbai",
    message: "Praying for guidance and peace as I start college next week. I want to stand firm in my faith and find a welcoming Christian community.",
    count: 24,
    voted: false
  },
  {
    id: 2,
    author: "Sarah M.",
    location: "Bengaluru",
    message: "Please pray for my mother's health and fast recovery from surgery. We trust in God's healing hands and comfort.",
    count: 38,
    voted: false
  },
  {
    id: 3,
    author: "R. S.",
    location: "New Delhi",
    message: "Seeking prayer for wisdom and focus during my final engineering exams. Asking that God removes anxiety and grants clarity of mind.",
    count: 15,
    voted: false
  }
];

// 2. STATE MANAGEMENT
let state = {
  activeView: "home",
  activeFilter: "all",
  cart: JSON.parse(localStorage.getItem("ruven_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("ruven_wishlist")) || [],
  prayers: JSON.parse(localStorage.getItem("ruven_prayers")) || INITIAL_PRAYERS,
  currentProductDetail: PRODUCTS[0].id
};

// 3. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Set up Event Listeners
  setupNavigation();
  setupCartDrawer();
  setupWishlistDrawer();
  setupProductPageListeners();
  setupPrayerWall();
  setupNewsletter();
  setupAnnouncementBar();
  setupSearchModal();
  setupHeroParallax();
  setupScrollReveal();
  
  // Render Dynamic Sections
  renderHomepageGrids();
  renderShopGrid();
  renderCart();
  renderWishlist();
  renderPrayerFeed();
  
  // Handle Initial Route (if hash exists)
  handleHashRoute();
  window.addEventListener("hashchange", handleHashRoute);
  
  // Header Scroll Effect
  window.addEventListener("scroll", () => {
    const header = document.getElementById("site-header");
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// 4. SPA ROUTER & NAVIGATION
function setupNavigation() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".nav-trigger");
    if (!trigger) return;
    
    // Prevent default hash jump if handled dynamically
    const view = trigger.getAttribute("data-view");
    const filter = trigger.getAttribute("data-filter");
    const targetSection = trigger.getAttribute("data-target");
    
    if (view) {
      switchView(view);
      
      // Handle category filtering on Shop page
      if (view === "shop") {
        const catFilter = document.getElementById("category-filter");
        if (filter && catFilter) {
          catFilter.value = filter;
          state.activeFilter = filter;
          renderShopGrid();
        }
      }
      
      // Scroll to specific section if requested (e.g. "Our Mission")
      if (targetSection) {
        setTimeout(() => {
          const targetEl = document.getElementById(targetSection);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      
      // Close mobile menu if open
      closeMobileMenu();
    }
  });
  
  // Mobile Hamburger Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }
}

function handleHashRoute() {
  const hash = window.location.hash || "#home";
  const route = hash.replace("#", "");
  
  if (route.startsWith("product/")) {
    const productId = route.split("/")[1];
    const productExists = PRODUCTS.some(p => p.id === productId);
    if (productExists) {
      state.currentProductDetail = productId;
      renderProductDetailPage();
      switchView("product");
    }
  } else if (["home", "shop", "community"].includes(route)) {
    switchView(route);
  }
}

function switchView(viewName) {
  state.activeView = viewName;
  
  // Update browser hash silently
  if (!window.location.hash.includes(`product/`)) {
    history.pushState(null, null, `#${viewName}`);
  }
  
  // Hide all sections, show active
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });
  
  const activeSec = document.getElementById(`${viewName}-view`);
  if (activeSec) {
    activeSec.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
  navLinks.style.flexDirection = "column";
  navLinks.style.position = "absolute";
  navLinks.style.top = "var(--header-height)";
  navLinks.style.left = "0";
  navLinks.style.width = "100%";
  navLinks.style.backgroundColor = "var(--color-bg-warm)";
  navLinks.style.padding = "var(--spacing-lg)";
  navLinks.style.borderBottom = "1px solid var(--color-border)";
  navLinks.style.zIndex = "99";
}

function closeMobileMenu() {
  if (window.innerWidth <= 768) {
    const navLinks = document.querySelector(".nav-links");
    navLinks.style.display = "none";
  }
}

// 5. RENDER SHOP & HOMEPAGE PRODUCT GRIDS
function renderHomepageGrids() {
  // Update wishlist states on all homepage buttons dynamically
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    const pid = btn.getAttribute("data-id");
    const isWishlisted = state.wishlist.includes(pid);
    if (isWishlisted) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
    const child = btn.querySelector("svg") || btn.querySelector("i");
    if (child) {
      child.style.fill = isWishlisted ? "currentColor" : "none";
    }
  });
  
  // Re-create icons for elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
  attachCardEvents();
}

function renderShopGrid() {
  const shopGrid = document.getElementById("shop-products-grid");
  const catFilterVal = document.getElementById("category-filter")?.value || "all";
  const sortVal = document.getElementById("sort-select")?.value || "featured";
  
  if (!shopGrid) return;
  
  // Filter
  let filtered = [...PRODUCTS];
  if (catFilterVal === "oversized-tees") {
    filtered = PRODUCTS.filter(p => p.category === "oversized-tees");
  } else if (catFilterVal === "hoodies") {
    filtered = PRODUCTS.filter(p => p.category === "hoodies");
  } else if (catFilterVal === "new-arrivals") {
    filtered = PRODUCTS.filter(p => p.tag === "New Release");
  } else if (catFilterVal === "best-sellers") {
    filtered = PRODUCTS.filter(p => p.tag === "Best Seller");
  }
  
  // Sort
  if (sortVal === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }
  
  // Update Items Count Text
  const countEl = document.getElementById("shop-items-count");
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} premium product${filtered.length !== 1 ? 's' : ''}`;
  }
  
  // Render
  shopGrid.innerHTML = filtered.map(product => createProductCardMarkup(product)).join("");
  if (window.lucide) {
    window.lucide.createIcons();
  }
  attachCardEvents();
}

function createProductCardMarkup(product) {
  const isWishlisted = state.wishlist.includes(product.id);
  const badgeHtml = product.tag ? `<span class="badge-tag">${product.tag}</span>` : "";
  const sizeListHtml = product.sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join("");
  
  return `
    <article class="product-card" data-id="${product.id}">
      ${badgeHtml}
      <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
        <i data-lucide="heart" style="fill: ${isWishlisted ? 'currentColor' : 'none'};"></i>
      </button>
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}">
        
        <!-- Quick Add size flyout on hover -->
        <div class="quick-add-overlay">
          <span style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-muted); text-align: center; display: block; margin-bottom: var(--spacing-2xs);">Quick Add Size</span>
          <div class="size-selector">
            ${sizeListHtml}
          </div>
        </div>
      </div>
      <div class="product-info">
        <span class="product-verse-preview">${product.verseRef}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">
          ₹${product.price}
          <span class="price-original">₹${product.originalPrice}</span>
        </p>
      </div>
    </article>
  `;
}

function attachCardEvents() {
  // Wishlist clicks
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pid = btn.getAttribute("data-id");
      toggleWishlist(pid);
    });
  });

  // Size buttons quick add clicks
  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = btn.closest(".product-card");
      const pid = card.getAttribute("data-id");
      const size = btn.getAttribute("data-size");
      addToCart(pid, size, 1);
    });
  });

  // Card clicks (Open Details)
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Ignore click if it was size button or wishlist heart
      if (e.target.closest(".wishlist-btn") || e.target.closest(".size-btn")) return;
      
      const pid = card.getAttribute("data-id");
      state.currentProductDetail = pid;
      window.location.hash = `product/${pid}`;
    });
  });
}

function setupProductPageListeners() {
  const catFilter = document.getElementById("category-filter");
  const sortSelect = document.getElementById("sort-select");
  
  if (catFilter) {
    catFilter.addEventListener("change", renderShopGrid);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", renderShopGrid);
  }
}

// 6. PRODUCT DETAILS PAGE RENDERING & ZOOM
function renderProductDetailPage() {
  const wrapper = document.getElementById("product-detail-wrapper");
  if (!wrapper) return;
  
  const product = PRODUCTS.find(p => p.id === state.currentProductDetail);
  if (!product) return;
  
  const sizesHtml = product.sizes.map((size, idx) => `
    <button class="details-size-btn ${idx === 0 ? 'selected' : ''}" data-size="${size}">${size}</button>
  `).join("");
  
  wrapper.innerHTML = `
    <div class="product-gallery-grid">
      <div class="gallery-main-img" id="zoom-container">
        <img src="${product.image}" id="zoom-img" alt="${product.title}">
      </div>
      <div class="gallery-thumbs">
        <div class="gallery-thumb active"><img src="${product.image}" alt="Thumb 1"></div>
        <div class="gallery-thumb"><img src="${product.image}" alt="Thumb 2" style="filter: opacity(0.8);"></div>
        <div class="gallery-thumb"><img src="${product.image}" alt="Thumb 3" style="filter: brightness(0.9);"></div>
        <div class="gallery-thumb"><img src="${product.image}" alt="Thumb 4" style="filter: contrast(1.1);"></div>
      </div>
    </div>
    
    <div class="product-details-content">
      <div>
        <p class="section-subtitle" style="margin-bottom: 4px;">Collection drop</p>
        <h1 class="editorial-title" style="font-size: 2.2rem; font-weight: 300;">${product.title}</h1>
      </div>
      
      <!-- Scriptural Narrative -->
      <div class="details-verse-box">
        <div class="details-verse-quote">"${product.verseQuote}"</div>
        <div class="details-verse-ref">${product.verseRef}</div>
      </div>
      
      <div class="details-price-row">
        <span class="details-price">₹${product.price}</span>
        <span class="details-original-price">₹${product.originalPrice}</span>
      </div>
      
      <p style="color: var(--color-text-muted); font-size: 0.9rem;">
        Tax included. Made with high quality materials. Built to start conversations about faith.
      </p>
      
      <!-- Size Picker -->
      <div class="details-size-picker">
        <h5>Select Fit (Oversized Cut)</h5>
        <div class="sizes">
          ${sizesHtml}
        </div>
      </div>
      
      <!-- Qty and Add to Cart -->
      <div class="details-actions">
        <div class="qty-counter">
          <button class="qty-btn" id="qty-minus"><i data-lucide="minus" style="width: 14px;"></i></button>
          <input type="number" class="qty-input" id="qty-val" value="1" min="1" readonly>
          <button class="qty-btn" id="qty-plus"><i data-lucide="plus" style="width: 14px;"></i></button>
        </div>
        <button class="cta-button cta-button-primary add-to-cart-submit" id="add-to-cart-btn">
          Add to Studio Bag
        </button>
      </div>
      
      <!-- Expandable Accordion Tabs -->
      <div class="accordion-details">
        <div class="accordion-tab active">
          <button class="accordion-header">
            Scriptural Context & Meaning
            <span class="accordion-icon"><i data-lucide="plus" style="width: 14px;"></i></span>
          </button>
          <div class="accordion-content" style="max-height: 200px; padding-bottom: var(--spacing-md);">
            <p>${product.verseMeaning}</p>
          </div>
        </div>
        <div class="accordion-tab">
          <button class="accordion-header">
            Fabric & Design Specs
            <span class="accordion-icon"><i data-lucide="plus" style="width: 14px;"></i></span>
          </button>
          <div class="accordion-content">
            <p>${product.fabricDetails}</p>
          </div>
        </div>
        <div class="accordion-tab">
          <button class="accordion-header">
            Brand Story & Hand-screen Process
            <span class="accordion-icon"><i data-lucide="plus" style="width: 14px;"></i></span>
          </button>
          <div class="accordion-content">
            <p>${product.designStory}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Attach Product Page Specific Events
  attachProductDetailPageEvents();
}

function attachProductDetailPageEvents() {
  const container = document.getElementById("zoom-container");
  const img = document.getElementById("zoom-img");
  
  // 1. Image Zoom Micro-interaction
  if (container && img) {
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      
      img.style.transformOrigin = `${xPct}% ${yPct}%`;
      img.style.transform = "scale(1.5)";
    });
    
    container.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });
  }
  
  // 2. Thumbnails Switch
  document.querySelectorAll(".gallery-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      const clickedImg = thumb.querySelector("img").src;
      if (img) img.src = clickedImg;
    });
  });
  
  // 3. Sizing Selection
  const sizeBtns = document.querySelectorAll(".details-size-btn");
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
  
  // 4. Quantity Adjuster
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const qtyInput = document.getElementById("qty-val");
  
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value);
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });
    
    qtyPlus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value);
      qtyInput.value = val + 1;
    });
  }
  
  // 5. Add to Cart Button Action
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const product = PRODUCTS.find(p => p.id === state.currentProductDetail);
      const selectedSize = document.querySelector(".details-size-btn.selected")?.getAttribute("data-size") || "M";
      const quantity = parseInt(qtyInput?.value || 1);
      
      addToCart(product.id, selectedSize, quantity);
      
      // Trigger cart drawer open as a confirmation micro-interaction
      openDrawer("cart");
    });
  }
  
  // 6. Accordion Tabs Collapse/Expand
  document.querySelectorAll(".accordion-tab").forEach(tab => {
    const header = tab.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isActive = tab.classList.contains("active");
      
      // Close all accordions
      document.querySelectorAll(".accordion-tab").forEach(t => {
        t.classList.remove("active");
        t.querySelector(".accordion-content").style.maxHeight = null;
        t.querySelector(".accordion-content").style.paddingBottom = null;
      });
      
      if (!isActive) {
        tab.classList.add("active");
        const content = tab.querySelector(".accordion-content");
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.paddingBottom = "var(--spacing-md)";
      }
    });
  });
}

// 7. CART DRAWER STATE & RENDERING
function setupCartDrawer() {
  const openBtn = document.getElementById("cart-toggle-btn");
  const closeBtn = document.getElementById("cart-close-btn");
  const backdrop = document.getElementById("backdrop-overlay");
  const checkoutBtn = document.getElementById("checkout-btn");
  const mobileCheckoutBtn = document.getElementById("mobile-checkout-btn");
  
  if (openBtn) openBtn.addEventListener("click", () => openDrawer("cart"));
  if (closeBtn) closeBtn.addEventListener("click", () => closeDrawer("cart"));
  if (backdrop) backdrop.addEventListener("click", () => {
    closeDrawer("cart");
    closeDrawer("wishlist");
  });
  
  const checkoutAction = () => {
    if (state.cart.length === 0) {
      alert("Your studio bag is empty!");
      return;
    }
    alert("Proceeding to secure checkout under God's protection. Thank you for supporting Ruven Studio!");
    // Clear cart as placeholder order placement
    state.cart = [];
    saveCartState();
    renderCart();
    closeDrawer("cart");
  };

  if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutAction);
  if (mobileCheckoutBtn) mobileCheckoutBtn.addEventListener("click", checkoutAction);
}

function openDrawer(drawerId) {
  document.getElementById(`${drawerId}-drawer`).classList.add("active");
  document.getElementById("backdrop-overlay").classList.add("active");
  document.body.style.overflow = "hidden"; // disable scroll behind drawer
}

function closeDrawer(drawerId) {
  document.getElementById(`${drawerId}-drawer`).classList.remove("active");
  document.getElementById("backdrop-overlay").classList.remove("active");
  document.body.style.overflow = ""; // restore scroll
}

function addToCart(productId, size, quantity) {
  const existingIndex = state.cart.findIndex(item => item.id === productId && item.size === size);
  
  if (existingIndex > -1) {
    state.cart[existingIndex].qty += quantity;
  } else {
    state.cart.push({ id: productId, size: size, qty: quantity });
  }
  
  saveCartState();
  renderCart();
}

function removeFromCart(productId, size) {
  state.cart = state.cart.filter(item => !(item.id === productId && item.size === size));
  saveCartState();
  renderCart();
}

function updateCartQty(productId, size, change) {
  const index = state.cart.findIndex(item => item.id === productId && item.size === size);
  if (index > -1) {
    state.cart[index].qty += change;
    if (state.cart[index].qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    saveCartState();
    renderCart();
  }
}

function saveCartState() {
  localStorage.setItem("ruven_cart", JSON.stringify(state.cart));
}

function renderCart() {
  const cartContent = document.getElementById("cart-drawer-content");
  const cartBadge = document.getElementById("cart-badge");
  const subtotalVal = document.getElementById("cart-subtotal-val");
  const stickyPrice = document.getElementById("mobile-sticky-price");
  const mobileBar = document.getElementById("mobile-bottom-bar");
  
  if (!cartContent) return;
  
  // Cart Badge Total Count
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems === 0 ? "none" : "flex";
  }
  
  if (state.cart.length === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-bag" class="cart-empty-icon"></i>
        <p style="font-family: var(--font-editorial); font-size: 1.25rem; font-style: italic;">Your studio bag is empty.</p>
        <p style="font-size: 0.8rem; max-width: 250px;">Find clothing created for self-discovery and conversations of faith.</p>
        <button class="cta-button cta-button-primary nav-trigger" data-view="shop" style="padding: 0.6rem 2rem; font-size: 0.75rem; margin-top: var(--spacing-xs);" onclick="document.getElementById('cart-close-btn').click();">Browse Drops</button>
      </div>
    `;
    if (subtotalVal) subtotalVal.textContent = "₹0.00";
    if (stickyPrice) stickyPrice.textContent = "₹0.00";
    if (mobileBar) mobileBar.style.display = "none";
    document.getElementById("cart-drawer-footer").style.display = "none";
    return;
  }
  
  document.getElementById("cart-drawer-footer").style.display = "block";
  let subtotal = 0;
  
  const cartListMarkup = state.cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;
    
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title">${product.title}</h4>
            <div class="cart-item-meta">
              <span>Size: ${item.size}</span>
              <span>Category: ${product.category.replace("-", " ")}</span>
            </div>
          </div>
          <div class="cart-item-qty">
            <button class="cart-item-qty-btn decrease-qty" data-id="${product.id}" data-size="${item.size}"><i data-lucide="minus" style="width: 10px;"></i></button>
            <span class="cart-item-qty-val">${item.qty}</span>
            <button class="cart-item-qty-btn increase-qty" data-id="${product.id}" data-size="${item.size}"><i data-lucide="plus" style="width: 10px;"></i></button>
          </div>
        </div>
        <div class="cart-item-price-remove">
          <span class="cart-item-price">₹${itemTotal}</span>
          <button class="cart-item-remove-btn remove-item" data-id="${product.id}" data-size="${item.size}">Remove</button>
        </div>
      </div>
    `;
  }).join("");
  
  cartContent.innerHTML = `<div class="cart-items-list">${cartListMarkup}</div>`;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  if (subtotalVal) subtotalVal.textContent = `₹${subtotal}`;
  if (stickyPrice) stickyPrice.textContent = `₹${subtotal}`;
  
  // Show mobile bottom sticky bar if items exist and on mobile
  if (mobileBar) {
    mobileBar.style.display = (window.innerWidth <= 480) ? "flex" : "none";
  }
  
  // Attach Cart Adjustment Listeners
  document.querySelectorAll(".decrease-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      updateCartQty(btn.getAttribute("data-id"), btn.getAttribute("data-size"), -1);
    });
  });
  
  document.querySelectorAll(".increase-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      updateCartQty(btn.getAttribute("data-id"), btn.getAttribute("data-size"), 1);
    });
  });
  
  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-id"), btn.getAttribute("data-size"));
    });
  });
}

// 8. WISHLIST STATE & RENDERING
function setupWishlistDrawer() {
  const openBtn = document.getElementById("wishlist-toggle-btn");
  const closeBtn = document.getElementById("wishlist-close-btn");
  
  if (openBtn) openBtn.addEventListener("click", () => openDrawer("wishlist"));
  if (closeBtn) closeBtn.addEventListener("click", () => closeDrawer("wishlist"));
}

function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
  } else {
    state.wishlist.push(productId);
  }
  
  localStorage.setItem("ruven_wishlist", JSON.stringify(state.wishlist));
  renderWishlist();
  
  // Re-render other grids to reflect visual heart changes
  renderHomepageGrids();
  renderShopGrid();
}

function renderWishlist() {
  const content = document.getElementById("wishlist-drawer-content");
  const badge = document.getElementById("wishlist-badge");
  
  if (!content) return;
  
  const count = state.wishlist.length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count === 0 ? "none" : "flex";
  }
  
  if (count === 0) {
    content.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="heart" class="cart-empty-icon"></i>
        <p style="font-family: var(--font-editorial); font-size: 1.25rem; font-style: italic;">Your wishlist is empty.</p>
        <p style="font-size: 0.8rem; max-width: 250px;">Save products you love and want to start conversations with.</p>
      </div>
    `;
    return;
  }
  
  const wishlistItemsMarkup = state.wishlist.map(pid => {
    const product = PRODUCTS.find(p => p.id === pid);
    if (!product) return "";
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title">${product.title}</h4>
            <span style="font-size: 0.85rem; font-weight: 500;">₹${product.price}</span>
          </div>
          <button class="cta-button cta-button-primary move-to-bag-btn" data-id="${product.id}" style="padding: 0.4rem 1rem; font-size: 0.65rem; border-radius: var(--border-radius-full); width: max-content; margin-top: var(--spacing-xs);">Move to Bag</button>
        </div>
        <div class="cart-item-price-remove" style="justify-content: flex-start;">
          <button class="cart-item-remove-btn remove-wishlist-item" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
  }).join("");
  
  content.innerHTML = `<div class="cart-items-list">${wishlistItemsMarkup}</div>`;
  
  // Re-create icons for wishlist drawer
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Event listeners for wishlist drawer items
  document.querySelectorAll(".remove-wishlist-item").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleWishlist(btn.getAttribute("data-id"));
    });
  });
  
  document.querySelectorAll(".move-to-bag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-id");
      const product = PRODUCTS.find(p => p.id === pid);
      
      // Default to first size available
      addToCart(pid, product.sizes[0], 1);
      toggleWishlist(pid); // Remove from wishlist on move
      closeDrawer("wishlist");
      openDrawer("cart");
    });
  });
}

// 9. COMMUNITY PRAYER WALL CONTROLLER
function setupPrayerWall() {
  const form = document.getElementById("prayer-request-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const authorVal = document.getElementById("prayer-author").value.trim();
    const locationVal = document.getElementById("prayer-location").value.trim();
    const messageVal = document.getElementById("prayer-message").value.trim();
    
    const newPrayer = {
      id: Date.now(),
      author: authorVal || "Anonymous",
      location: locationVal || "India",
      message: messageVal,
      count: 1, // Start with 1 prayer support
      voted: true // User who posted automatically supports it
    };
    
    state.prayers.unshift(newPrayer); // Add to top of feed
    localStorage.setItem("ruven_prayers", JSON.stringify(state.prayers));
    
    renderPrayerFeed();
    form.reset();
    
    alert("Your prayer request has been shared onto the wall. The studio collective stands with you.");
  });
}

function renderPrayerFeed() {
  const feed = document.getElementById("prayer-wall-feed");
  if (!feed) return;
  
  if (state.prayers.length === 0) {
    feed.innerHTML = `
      <p style="text-align: center; color: var(--color-text-muted); font-size: 0.9rem; padding: var(--spacing-xl) 0;">No prayer requests shared yet. Be the first to share one.</p>
    `;
    return;
  }
  
  feed.innerHTML = state.prayers.map(prayer => `
    <div class="prayer-card" data-id="${prayer.id}">
      <div class="prayer-meta">
        <span class="prayer-name">${prayer.author}</span>
        <span>${prayer.location}</span>
      </div>
      <p class="prayer-content">"${prayer.message}"</p>
      <div class="prayer-actions">
        <button class="prayer-pray-btn ${prayer.voted ? 'active' : ''}" data-id="${prayer.id}" aria-label="Pray for this request">
          <i data-lucide="heart" style="width: 14px; fill: ${prayer.voted ? 'currentColor' : 'none'};"></i>
          <span>${prayer.count} Standing in Prayer</span>
        </button>
      </div>
    </div>
  `).join("");
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Attach "Amen / Stand in Prayer" click events
  document.querySelectorAll(".prayer-pray-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = parseInt(btn.getAttribute("data-id"));
      const index = state.prayers.findIndex(p => p.id === pid);
      
      if (index > -1) {
        const prayer = state.prayers[index];
        if (prayer.voted) {
          prayer.count--;
          prayer.voted = false;
        } else {
          prayer.count++;
          prayer.voted = true;
        }
        localStorage.setItem("ruven_prayers", JSON.stringify(state.prayers));
        renderPrayerFeed();
      }
    });
  });
}

// 10. NEWSLETTER & EXTRA EVENTS
function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value;
      alert(`Welcome to the Studio Fellowship! Confirmation sent to: ${email}`);
      form.reset();
    });
  }
}

// 11. ANNOUNCEMENT BAR VALUE ROTATION
function setupAnnouncementBar() {
  const messages = [
    "Designed to Start Conversations About Christ",
    "Premium Quality • Faith Inspired • Limited Collections",
    "Made with Purpose"
  ];
  let currentIndex = 0;
  const container = document.getElementById("announcement-text");
  if (!container) return;

  setInterval(() => {
    container.style.opacity = 0;
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      container.textContent = messages[currentIndex];
      container.style.opacity = 1;
    }, 400);
  }, 4500);
}

// 12. SEARCH MODAL TRIGGERS & HANDLING
function setupSearchModal() {
  const searchBtn = document.getElementById("search-btn");
  const closeBtn = document.getElementById("search-modal-close-btn");
  const modal = document.getElementById("search-modal");
  const form = document.getElementById("search-modal-form");
  const input = document.getElementById("search-modal-input");

  if (!searchBtn || !modal) return;

  searchBtn.addEventListener("click", () => {
    modal.classList.add("active");
    setTimeout(() => input.focus(), 150);
  });

  const closeSearch = () => {
    modal.classList.remove("active");
    input.value = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  // Close search on Esc key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeSearch();
    }
  });

  // Handle click on suggestions or trigger search
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim().toLowerCase();
      if (query) {
        closeSearch();
        switchView("shop");
        
        // Search inside products
        const shopGrid = document.getElementById("shop-products-grid");
        if (shopGrid) {
          const filtered = PRODUCTS.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.verseRef.toLowerCase().includes(query) || 
            p.designStory.toLowerCase().includes(query)
          );
          
          const countEl = document.getElementById("shop-items-count");
          if (countEl) {
            countEl.textContent = `Search results for "${query}": ${filtered.length} found`;
          }
          
          shopGrid.innerHTML = filtered.length > 0
            ? filtered.map(product => createProductCardMarkup(product)).join("")
            : `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: var(--spacing-xl) 0;">No matching drops found. Try searching 'tee' or 'hoodie'.</p>`;
          
          if (window.lucide) {
            window.lucide.createIcons();
          }
          attachCardEvents();
        }
      }
    });
  }

  // Intercept search suggestion links to close modal
  document.querySelectorAll(".search-suggestion-link").forEach(link => {
    link.addEventListener("click", () => {
      closeSearch();
    });
  });
}

// 13. HERO PARALLAX MOUSE INTERACTION (Disabled to keep image still)
function setupHeroParallax() {
  // Parallax removed so the image behaves still
}

// 14. SCROLL REVEAL MICRO-INTERACTION
function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    revealElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  };
  
  window.addEventListener("scroll", revealOnScroll);
  // Run once on load
  revealOnScroll();
}
