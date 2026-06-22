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
  currentProductDetail: PRODUCTS[0].id,
  
  // Phase 4 PLP State
  filters: {
    size: [],
    price: [],
    tag: [],
    theme: [],
    availability: false,
    search: "",
    category: "all"
  },
  compareList: [],
  recentlyViewed: JSON.parse(localStorage.getItem("ruven_recently_viewed")) || []
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
  if (!shopGrid) return;
  
  // 1. FILTERING
  let filtered = [...PRODUCTS];
  
  // Category tabs switcher
  const cat = state.filters.category;
  if (cat === "oversized-tees") {
    filtered = PRODUCTS.filter(p => p.category === "oversized-tees");
  } else if (cat === "hoodies") {
    filtered = PRODUCTS.filter(p => p.category === "hoodies");
  } else if (cat === "new-arrivals") {
    filtered = PRODUCTS.filter(p => p.tag === "New Release");
  } else if (cat === "best-sellers") {
    filtered = PRODUCTS.filter(p => p.tag === "Best Seller");
  } else if (cat === "recently-viewed") {
    filtered = state.recentlyViewed.map(pid => PRODUCTS.find(p => p.id === pid)).filter(Boolean);
  }

  // Size filters
  if (state.filters.size.length > 0) {
    filtered = filtered.filter(p => p.sizes.some(s => state.filters.size.includes(s)));
  }

  // Price filters
  if (state.filters.price.length > 0) {
    filtered = filtered.filter(p => {
      return state.filters.price.some(range => {
        if (range === "under-2000") return p.price < 2000;
        if (range === "2000-3000") return p.price >= 2000 && p.price <= 3000;
        if (range === "over-3000") return p.price > 3000;
        return false;
      });
    });
  }

  // Tag filters
  if (state.filters.tag.length > 0) {
    filtered = filtered.filter(p => state.filters.tag.includes(p.tag));
  }

  // Theme filters
  if (state.filters.theme.length > 0) {
    filtered = filtered.filter(p => {
      return state.filters.theme.some(theme => {
        if (theme === "Armor & Protection") return p.verseRef.includes("Romans 13:12");
        if (theme === "Mind Renewal") return p.verseRef.includes("Romans 12:2");
        return false;
      });
    });
  }

  // Availability filters
  if (state.filters.availability) {
    filtered = filtered.filter(p => p.sizes.length > 0); // Mock all products in-stock in this demo
  }

  // Search input filter
  const query = state.filters.search.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.verseRef.toLowerCase().includes(query) ||
      p.verseQuote.toLowerCase().includes(query) ||
      p.designStory.toLowerCase().includes(query) ||
      p.fabricDetails.toLowerCase().includes(query)
    );
  }

  // 2. SORTING
  const sortVal = document.getElementById("plp-sort-select")?.value || "featured";
  if (sortVal === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortVal === "newest") {
    filtered.sort((a, b) => (b.tag === "New Release" ? 1 : 0) - (a.tag === "New Release" ? 1 : 0));
  } else if (sortVal === "best-selling") {
    filtered.sort((a, b) => (b.tag === "Best Seller" ? 1 : 0) - (a.tag === "Best Seller" ? 1 : 0));
  } else if (sortVal === "most-loved") {
    filtered.sort((a, b) => (state.wishlist.includes(b.id) ? 1 : 0) - (state.wishlist.includes(a.id) ? 1 : 0));
  }

  // 3. UPDATE COUNT AND BADGES
  const countEl = document.getElementById("shop-items-count");
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} premium product${filtered.length !== 1 ? 's' : ''}`;
  }

  const activeFilters = [];
  state.filters.size.forEach(s => activeFilters.push({ type: 'size', val: s, label: `Size: ${s}` }));
  state.filters.price.forEach(p => {
    let lbl = "Price";
    if (p === "under-2000") lbl = "Under ₹2,000";
    if (p === "2000-3000") lbl = "₹2,000 - ₹3,000";
    if (p === "over-3000") lbl = "Over ₹3,000";
    activeFilters.push({ type: 'price', val: p, label: lbl });
  });
  state.filters.tag.forEach(t => activeFilters.push({ type: 'tag', val: t, label: t }));
  state.filters.theme.forEach(th => activeFilters.push({ type: 'theme', val: th, label: th }));
  if (state.filters.availability) activeFilters.push({ type: 'availability', val: 'in-stock', label: 'In Stock' });
  if (query) activeFilters.push({ type: 'search', val: query, label: `Search: "${query}"` });

  const activeFiltersRow = document.getElementById("active-filters-row");
  const clearFiltersBtn = document.getElementById("plp-clear-filters-btn");
  const clearFiltersBtnMobile = document.getElementById("mobile-filter-clear-all-btn");
  const badgeCountEl = document.getElementById("filter-badge-count");
  
  if (badgeCountEl) {
    badgeCountEl.textContent = activeFilters.length;
    badgeCountEl.style.display = activeFilters.length > 0 ? "inline-flex" : "none";
  }

  if (activeFiltersRow) {
    if (activeFilters.length === 0) {
      activeFiltersRow.innerHTML = "";
      if (clearFiltersBtn) clearFiltersBtn.style.display = "none";
      if (clearFiltersBtnMobile) clearFiltersBtnMobile.style.display = "none";
    } else {
      if (clearFiltersBtn) clearFiltersBtn.style.display = "block";
      if (clearFiltersBtnMobile) clearFiltersBtnMobile.style.display = "block";
      activeFiltersRow.innerHTML = activeFilters.map(f => `
        <span class="filter-tag-bubble">
          ${f.label}
          <button class="remove-filter-bubble-btn" data-filter-type="${f.type}" data-value="${f.val}" aria-label="Remove filter">
            <i data-lucide="x" style="width: 12px; height: 12px;"></i>
          </button>
        </span>
      `).join("");
      
      activeFiltersRow.querySelectorAll(".remove-filter-bubble-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-filter-type");
          const val = btn.getAttribute("data-value");
          removeFilterValue(type, val);
        });
      });
    }
  }

  // 4. RENDERING PRODUCT GRID
  if (filtered.length === 0) {
    shopGrid.innerHTML = `
      <div class="plp-empty-state">
        <i data-lucide="help-circle" class="plp-empty-illustration" style="width: 48px; height: 48px;"></i>
        <h3>No Drops Found</h3>
        <p>No matching garments correspond to your active filters. Try broadening your keywords or resetting filters.</p>
        <button class="cta-button cta-button-primary" id="plp-empty-reset-btn" style="padding: 0.6rem 2rem; font-size: 0.75rem;">Reset All Filters</button>
      </div>
    `;
    document.getElementById("plp-empty-reset-btn")?.addEventListener("click", clearAllFilters);
  } else {
    let html = "";
    filtered.forEach((product, idx) => {
      const isHero = (idx === 0 && filtered.length > 1); // Let first card span larger on desktop if desired
      html += createProductCardMarkup(product, isHero);
      
      // Insert Editorial break banner after index 1 (i.e. after 2 products)
      if (idx === 1) {
        html += `
          <div class="plp-editorial-banner-item reveal-on-scroll active">
            <div class="plp-editorial-banner-img-wrap">
              <img src="/brand_story_lifestyle.png" alt="Ruven Screen Printing Process">
            </div>
            <div class="plp-editorial-banner-content">
              <span class="section-subtitle-lowercase">studio craftsmanship</span>
              <h3>The Hand-Pulled Screen Ministry</h3>
              <p>
                Every drop is screen-printed by hand in limited batches. We select heavy organic fabrics to build garments that serve as visual testimonies for years.
              </p>
              <a href="#home" class="editorial-text-link nav-trigger" data-view="home" data-target="brand-statement-section">Learn Our Process</a>
            </div>
          </div>
        `;
      }
    });
    shopGrid.innerHTML = html;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
  attachCardEvents();
}

function createProductCardMarkup(product, isHero = false) {
  const isWishlisted = state.wishlist.includes(product.id);
  const isCompared = state.compareList.includes(product.id);
  const secondaryImage = product.id === "tee-romans-13-12" ? "/brand_story_lifestyle.png" : "/hero_lifestyle.png";
  const badges = [];
  if (product.tag) {
    badges.push(`<span class="plp-card-badge">${product.tag}</span>`);
  }
  if (product.id === "hoodie-romans-12-2") {
    badges.push(`<span class="plp-card-badge fav-badge">Favorite</span>`);
  }
  
  return `
    <article class="product-card ${isHero ? 'hero-card' : ''}" data-id="${product.id}">
      <div class="plp-card-badge-container">
        ${badges.join("")}
      </div>
      <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
        <i data-lucide="heart" style="fill: ${isWishlisted ? 'currentColor' : 'none'};"></i>
      </button>
      <div class="plp-card-media">
        <img src="${product.image}" alt="${product.title}" class="plp-card-img-primary">
        <img src="${secondaryImage}" alt="${product.title} lifestyle view" class="plp-card-img-secondary">
        
        <!-- Hover actions overlay -->
        <div class="plp-card-action-overlay">
          <button class="plp-card-quick-add-btn" data-id="${product.id}">Quick Add Fit</button>
        </div>
      </div>
      <div class="plp-card-info">
        <div class="plp-card-meta">
          <span class="plp-card-verse-ref">${product.verseRef}</span>
          <button class="plp-card-compare-btn ${isCompared ? 'active' : ''}" data-id="${product.id}">
            <i data-lucide="columns" style="width: 12px; height: 12px;"></i>
            <span>${isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>
        <h3 class="plp-card-title">${product.title}</h3>
        <p class="plp-card-hover-verse">"${product.verseQuote.substring(0, 70)}..."</p>
        <div class="plp-card-price-row">
          <span class="plp-card-price">₹${product.price} <span class="price-original">₹${product.originalPrice}</span></span>
          <span style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 500;">Sizes: ${product.sizes.join(", ")}</span>
        </div>
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

  // Compare clicks
  document.querySelectorAll(".plp-card-compare-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pid = btn.getAttribute("data-id");
      toggleCompare(pid);
    });
  });

  // Quick Add clicks
  document.querySelectorAll(".plp-card-quick-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pid = btn.getAttribute("data-id");
      openQuickAdd(pid);
    });
  });

  // Card clicks (Open Details)
  document.querySelectorAll(".plp-layout .product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Ignore click if it was size button or wishlist heart or compare
      if (e.target.closest(".wishlist-btn") || e.target.closest(".plp-card-quick-add-btn") || e.target.closest(".plp-card-compare-btn")) return;
      
      const pid = card.getAttribute("data-id");
      state.currentProductDetail = pid;
      window.location.hash = `product/${pid}`;
    });
  });
}

function setupProductPageListeners() {
  // 1. Category Switch Tabs
  document.querySelectorAll(".plp-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".plp-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const cat = btn.getAttribute("data-category");
      state.filters.category = cat;
      updateHeroContent(cat);
      renderShopGrid();
    });
  });

  // 2. Collection Search
  const searchInput = document.getElementById("plp-collection-search");
  const searchClear = document.getElementById("plp-search-clear");
  
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value;
      state.filters.search = q;
      if (searchClear) searchClear.style.display = q.length > 0 ? "block" : "none";
      renderShopGrid();
    });
  }
  
  if (searchClear) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      state.filters.search = "";
      searchClear.style.display = "none";
      renderShopGrid();
    });
  }

  // 3. Popular Suggestion Tags
  document.querySelectorAll(".plp-suggest-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const val = tag.textContent;
      if (searchInput) {
        searchInput.value = val;
        state.filters.search = val;
        if (searchClear) searchClear.style.display = "block";
        renderShopGrid();
      }
    });
  });

  // 4. Desktop Sidebar Checkboxes
  document.querySelectorAll(".plp-sidebar-filters .plp-filter-checkbox").forEach(box => {
    box.addEventListener("change", () => {
      const type = box.getAttribute("data-filter-type");
      const val = box.getAttribute("data-value");
      
      if (type === "availability") {
        state.filters.availability = box.checked;
      } else {
        if (box.checked) {
          if (!state.filters[type].includes(val)) state.filters[type].push(val);
        } else {
          state.filters[type] = state.filters[type].filter(v => v !== val);
        }
      }
      renderShopGrid();
      syncFilterCheckboxStates();
    });
  });

  // 5. Desktop Sidebar Size buttons
  document.querySelectorAll(".plp-sidebar-filters .plp-size-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      const type = "size";
      btn.classList.toggle("active");
      
      if (btn.classList.contains("active")) {
        if (!state.filters[type].includes(val)) state.filters[type].push(val);
      } else {
        state.filters[type] = state.filters[type].filter(v => v !== val);
      }
      renderShopGrid();
      syncFilterCheckboxStates();
    });
  });

  // 6. Sidebar Clear All Filters Btn
  document.getElementById("plp-clear-filters-btn")?.addEventListener("click", clearAllFilters);
  document.getElementById("mobile-filter-clear-all-btn")?.addEventListener("click", clearAllFilters);

  // 7. Sort Dropdown
  document.getElementById("plp-sort-select")?.addEventListener("change", renderShopGrid);

  // 8. Mobile Filter Bottom Sheet Toggle
  const mobileToggle = document.getElementById("mobile-filter-toggle-btn");
  const mobileClose = document.getElementById("mobile-filter-close-btn");
  const mobileDrawer = document.getElementById("mobile-filter-drawer");
  const backdrop = document.getElementById("backdrop-overlay");
  const mobileApply = document.getElementById("mobile-filter-apply-btn");
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.add("active");
      if (backdrop) backdrop.classList.add("active");
    });
  }

  const closeMobileDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
  };

  if (mobileClose) mobileClose.addEventListener("click", closeMobileDrawer);
  if (backdrop) backdrop.addEventListener("click", closeMobileDrawer);

  // 9. Mobile Bottom Sheet Checkboxes
  document.querySelectorAll(".plp-bottom-sheet-filters .plp-filter-checkbox-mobile").forEach(box => {
    box.addEventListener("change", () => {
      const type = box.getAttribute("data-filter-type");
      const val = box.getAttribute("data-value");
      
      if (box.checked) {
        if (!state.filters[type].includes(val)) state.filters[type].push(val);
      } else {
        state.filters[type] = state.filters[type].filter(v => v !== val);
      }
    });
  });

  // 10. Mobile Bottom Sheet Sizes buttons
  document.querySelectorAll(".plp-bottom-sheet-filters .plp-size-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      const type = "size";
      btn.classList.toggle("active");
      
      if (btn.classList.contains("active")) {
        if (!state.filters[type].includes(val)) state.filters[type].push(val);
      } else {
        state.filters[type] = state.filters[type].filter(v => v !== val);
      }
    });
  });

  // Apply Mobile Filters
  if (mobileApply) {
    mobileApply.addEventListener("click", () => {
      renderShopGrid();
      syncFilterCheckboxStates();
      closeMobileDrawer();
    });
  }

  // 11. Compare Close & Clear Btn
  document.getElementById("compare-close-btn")?.addEventListener("click", () => {
    document.getElementById("compare-drawer").classList.remove("active");
  });
  document.getElementById("compare-clear-btn")?.addEventListener("click", () => {
    state.compareList = [];
    renderCompareDrawer();
    renderShopGrid();
  });

  // 12. Quick Add Close
  document.getElementById("quick-add-close-btn")?.addEventListener("click", () => {
    closeDrawer("quick-add");
  });
}

function toggleCompare(pid) {
  const idx = state.compareList.indexOf(pid);
  if (idx > -1) {
    state.compareList.splice(idx, 1);
  } else {
    if (state.compareList.length >= 2) {
      alert("You can compare up to 2 products at a time!");
      return;
    }
    state.compareList.push(pid);
  }
  renderCompareDrawer();
  renderShopGrid();
}

function renderCompareDrawer() {
  const drawer = document.getElementById("compare-drawer");
  const grid = document.getElementById("compare-content-grid");
  const countVal = document.getElementById("compare-count-val");
  
  if (!drawer || !grid) return;
  
  const count = state.compareList.length;
  if (countVal) countVal.textContent = count;
  
  if (count === 0) {
    drawer.classList.remove("active");
    return;
  }
  
  drawer.classList.add("active");
  
  const selectedProds = state.compareList.map(pid => PRODUCTS.find(p => p.id === pid)).filter(Boolean);
  
  let headerRowHtml = `<th>Specification</th>`;
  let designRowHtml = `<td><strong>Design Symbol</strong></td>`;
  let verseRowHtml = `<td><strong>Scripture Verse</strong></td>`;
  let fabricRowHtml = `<td><strong>Material & Fabric</strong></td>`;
  let fitRowHtml = `<td><strong>Fit & Structure</strong></td>`;
  let priceRowHtml = `<td><strong>Price</strong></td>`;
  let purposeRowHtml = `<td><strong>Visual Purpose</strong></td>`;
  
  selectedProds.forEach(p => {
    headerRowHtml += `
      <td>
        <div class="compare-card-col">
          <img src="${p.image}" alt="${p.title}">
          <div>
            <h4>${p.title}</h4>
            <button class="compare-remove-item-btn" data-id="${p.id}">Remove</button>
          </div>
        </div>
      </td>
    `;
    designRowHtml += `<td>${p.id === 'tee-romans-13-12' ? 'Linear Shield Symbol' : 'Embroidered Olive Branch'}</td>`;
    verseRowHtml += `<td><em>${p.verseRef}</em>: "${p.verseQuote}"</td>`;
    fabricRowHtml += `<td>${p.fabricDetails.substring(0, 60)}...</td>`;
    fitRowHtml += `<td>${p.id === 'tee-romans-13-12' ? 'Oversized Boxy Cut, 240 GSM' : 'Ultra-heavy Combed French Terry, 380 GSM'}</td>`;
    priceRowHtml += `<td>₹${p.price}</td>`;
    purposeRowHtml += `<td>${p.verseMeaning.substring(0, 60)}...</td>`;
  });
  
  grid.innerHTML = `
    <table class="plp-compare-table">
      <thead>
        <tr>${headerRowHtml}</tr>
      </thead>
      <tbody>
        <tr>${designRowHtml}</tr>
        <tr>${verseRowHtml}</tr>
        <tr>${fabricRowHtml}</tr>
        <tr>${fitRowHtml}</tr>
        <tr>${priceRowHtml}</tr>
        <tr>${purposeRowHtml}</tr>
      </tbody>
    </table>
  `;
  
  grid.querySelectorAll(".compare-remove-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleCompare(btn.getAttribute("data-id"));
    });
  });
}

function openQuickAdd(pid) {
  const drawer = document.getElementById("quick-add-drawer");
  const wrapper = document.getElementById("quick-add-content-wrapper");
  
  if (!drawer || !wrapper) return;
  
  const product = PRODUCTS.find(p => p.id === pid);
  if (!product) return;
  
  const sizesHtml = product.sizes.map((size, idx) => `
    <button class="quick-add-size-btn ${idx === 0 ? 'selected' : ''}" data-size="${size}">${size}</button>
  `).join("");
  
  wrapper.innerHTML = `
    <div class="quick-add-prod-summary">
      <img src="${product.image}" alt="${product.title}">
      <div class="quick-add-prod-details">
        <h4>${product.title}</h4>
        <p>₹${product.price}</p>
        <span style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 500;">${product.verseRef}</span>
      </div>
    </div>
    
    <div class="quick-add-size-select-group">
      <h5>Select Fit Size</h5>
      <div class="quick-add-sizes-row">
        ${sizesHtml}
      </div>
    </div>
    
    <div class="quick-add-qty-group">
      <h5>Quantity</h5>
      <div class="quick-add-qty-selector">
        <button class="quick-add-qty-btn" id="qa-minus"><i data-lucide="minus" style="width: 14px;"></i></button>
        <input type="number" class="quick-add-qty-input" id="qa-qty" value="1" min="1" readonly>
        <button class="quick-add-qty-btn" id="qa-plus"><i data-lucide="plus" style="width: 14px;"></i></button>
      </div>
    </div>
    
    <button class="cta-button cta-button-primary" id="qa-submit-btn" style="margin-top: var(--spacing-sm); width: 100%;">Add to Studio Bag</button>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  const sizeBtns = wrapper.querySelectorAll(".quick-add-size-btn");
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
  
  const minus = wrapper.querySelector("#qa-minus");
  const plus = wrapper.querySelector("#qa-plus");
  const qtyInput = wrapper.querySelector("#qa-qty");
  
  minus.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });
  
  plus.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    qtyInput.value = val + 1;
  });
  
  wrapper.querySelector("#qa-submit-btn").addEventListener("click", () => {
    const selectedSize = wrapper.querySelector(".quick-add-size-btn.selected").getAttribute("data-size");
    const qty = parseInt(qtyInput.value);
    addToCart(product.id, selectedSize, qty);
    
    closeDrawer("quick-add");
    openDrawer("cart");
  });
  
  openDrawer("quick-add");
}

function updateHeroContent(category) {
  const titleEl = document.getElementById("shop-collection-title");
  const descEl = document.getElementById("shop-collection-desc");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  
  if (!titleEl || !descEl) return;
  
  let title = "Oversized Faith Collection";
  let desc = "Minimal clothing inspired by scripture and designed to spark conversations about Christ. Made from organic heavyweight cotton.";
  let breadcrumb = "All Drops";
  
  switch(category) {
    case "oversized-tees":
      title = "The Boxy Heavyweight Tees";
      desc = "Crafted in India using heavy 240 GSM organic cotton, featuring clean visual symbols of scripture.";
      breadcrumb = "Oversized Tees";
      break;
    case "hoodies":
      title = "The French Terry Hoodies";
      desc = "Ultra-heavy 380 GSM combed cotton fabrics, styled loopback for premium warmth, peace, and mental renewal.";
      breadcrumb = "Streetwear Hoodies";
      break;
    case "new-arrivals":
      title = "The Armor Drop Releases";
      desc = "Explore our latest releases representing spiritual defense, protection, and walk of light.";
      breadcrumb = "New Arrivals";
      break;
    case "best-sellers":
      title = "The Fellowship Favorites";
      desc = "Our most loved conversation starters worn across faith communities and creative circles.";
      breadcrumb = "Best Sellers";
      break;
    case "recently-viewed":
      title = "Your Viewed Reflections";
      desc = "Review the drops you recently explored during your search for identity and purpose.";
      breadcrumb = "Recently Viewed";
      break;
  }
  
  titleEl.textContent = title;
  descEl.textContent = desc;
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = breadcrumb;
}

function removeFilterValue(type, val) {
  if (type === "availability") {
    state.filters.availability = false;
  } else if (type === "search") {
    state.filters.search = "";
    const searchInput = document.getElementById("plp-collection-search");
    if (searchInput) searchInput.value = "";
    const searchClear = document.getElementById("plp-search-clear");
    if (searchClear) searchClear.style.display = "none";
  } else {
    state.filters[type] = state.filters[type].filter(v => v !== val);
  }
  renderShopGrid();
  syncFilterCheckboxStates();
}

function clearAllFilters() {
  state.filters.size = [];
  state.filters.price = [];
  state.filters.tag = [];
  state.filters.theme = [];
  state.filters.availability = false;
  state.filters.search = "";
  
  const searchInput = document.getElementById("plp-collection-search");
  if (searchInput) searchInput.value = "";
  const searchClear = document.getElementById("plp-search-clear");
  if (searchClear) searchClear.style.display = "none";
  
  renderShopGrid();
  syncFilterCheckboxStates();
}

function syncFilterCheckboxStates() {
  document.querySelectorAll(".plp-sidebar-filters .plp-filter-checkbox").forEach(box => {
    const type = box.getAttribute("data-filter-type");
    const val = box.getAttribute("data-value");
    if (type === "availability") {
      box.checked = state.filters.availability;
    } else {
      box.checked = state.filters[type].includes(val);
    }
  });

  document.querySelectorAll(".plp-sidebar-filters .plp-size-filter-btn").forEach(btn => {
    const val = btn.getAttribute("data-value");
    if (state.filters.size.includes(val)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".plp-bottom-sheet-filters .plp-filter-checkbox-mobile").forEach(box => {
    const type = box.getAttribute("data-filter-type");
    const val = box.getAttribute("data-value");
    box.checked = state.filters[type].includes(val);
  });

  document.querySelectorAll(".plp-bottom-sheet-filters .plp-size-filter-btn").forEach(btn => {
    const val = btn.getAttribute("data-value");
    if (state.filters.size.includes(val)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// 6. PRODUCT DETAILS PAGE RENDERING & ZOOM
function renderProductDetailPage() {
  const wrapper = document.getElementById("product-detail-wrapper");
  if (!wrapper) return;
  
  const product = PRODUCTS.find(p => p.id === state.currentProductDetail);
  if (!product) return;
  
  // Track recently viewed products
  if (!state.recentlyViewed.includes(product.id)) {
    state.recentlyViewed.unshift(product.id);
    if (state.recentlyViewed.length > 6) {
      state.recentlyViewed.pop();
    }
    localStorage.setItem("ruven_recently_viewed", JSON.stringify(state.recentlyViewed));
  } else {
    state.recentlyViewed = state.recentlyViewed.filter(id => id !== product.id);
    state.recentlyViewed.unshift(product.id);
    localStorage.setItem("ruven_recently_viewed", JSON.stringify(state.recentlyViewed));
  }
  
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
