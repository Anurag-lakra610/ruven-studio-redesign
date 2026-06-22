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
    designStory: "This design marks Ruven Studio's commitment to visual ministry. The clean shield illustration merges modern minimalism with historic faith symbolism, acting as an open doorway for conversation on campus or in the creative office.",
    colors: [
      { name: "Vintage Black", hex: "#1c1b1b" },
      { name: "Slate Grey", hex: "#4e5256" }
    ],
    modelInfo: "Model is 6'0\" / 183cm and wears size M for a relaxed boxy fit.",
    gallery: [
      "/oversized_tee_product.png",
      "/brand_story_lifestyle.png",
      "/hero_lifestyle.png"
    ],
    detailsList: [
      { label: "Fabric", value: "100% Organic Ring-Spun Cotton" },
      { label: "Weight", value: "240 GSM Extra Heavy Knit" },
      { label: "Fit", value: "Oversized Boxy Silhouette with Drop Shoulders" },
      { label: "Print", value: "Premium Hand-Screened Plastisol Print" },
      { label: "Shrinkage", value: "Pre-shrunk to maintain shape over lifetime" },
      { label: "Origin", value: "Ethically Knitted & Printed in India" }
    ],
    reviews: [
      {
        id: "rev-tee-1",
        author: "Samuel K.",
        rating: 5,
        date: "2026-05-18",
        title: "Incredible weight and message",
        body: "The weight of this tee is unlike anything I've bought in India. Very boxy, heavy, but extremely breathable. I've had three conversations at my university campus about the Romans shield graphic already!",
        verified: true,
        helpfulCount: 14,
        avatarColor: "#B5A48F"
      },
      {
        id: "rev-tee-2",
        author: "Priyan D.",
        rating: 5,
        date: "2026-06-02",
        title: "Absolute premium streetwear",
        body: "Fits exactly like high-end Scandinavian streetwear brands but with a purpose. Ribbed collar is tight and doesn't stretch out after multiple washes. Love it.",
        verified: true,
        helpfulCount: 8,
        avatarColor: "#8D9A8D"
      },
      {
        id: "rev-tee-3",
        author: "Aaron J.",
        rating: 4,
        date: "2026-06-10",
        title: "Very oversized, consider sizing down",
        body: "Love the graphic and texture. It is quite oversized, so if you want a more standard fit, size down. Otherwise, the drape is incredible.",
        verified: true,
        helpfulCount: 3,
        avatarColor: "#9BA2B5"
      }
    ],
    faqs: [
      {
        question: "How should I wash the Armor of Light Tee?",
        answer: "Wash inside out in cold water on a gentle cycle. Hang dry in shade to prevent any shrinkage and preserve the screen-printed graphic. Avoid ironing directly on the printed graphic."
      },
      {
        question: "Is this tee suitable for hot Indian summers?",
        answer: "Yes. Even though it is a heavyweight 240 GSM knit, we use organic ring-spun cotton which is naturally highly breathable, keeping you comfortable even on warmer days."
      },
      {
        question: "Can I exchange if the size is too large?",
        answer: "We offer free size exchanges within 7 days of delivery. Because this features an oversized boxy cut, we recommend checking our Size Guide or choosing your normal size for a baggy street look."
      }
    ]
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
    designStory: "The delicate embroidered olive branch on the chest signifies peace, renewal, and spiritual restoration. Built to last a lifetime, this hoodie represents comfort, stillness, and mindful living.",
    colors: [
      { name: "Sage Green", hex: "#5C6B5E" },
      { name: "Oatmeal Melange", hex: "#E3DFD5" }
    ],
    modelInfo: "Model is 6'1\" / 185cm and wears size L for an authentic slouchy streetwear drape.",
    gallery: [
      "/faith_hoodie_product.png",
      "/hero2.png",
      "/brand_story_lifestyle.png"
    ],
    detailsList: [
      { label: "Fabric", value: "80% Organic Cotton / 20% Durable Polyester" },
      { label: "Weight", value: "380 GSM Ultra-Heavy combed French Terry" },
      { label: "Fit", value: "Clean Scandinavian Silhouette, Dropped Shoulders" },
      { label: "Hood", value: "Double-lined, Structured (No drawstrings)" },
      { label: "Detailing", value: "High-density chest embroidery of peace olive branch" },
      { label: "Origin", value: "Ethically Sourced & Embroidered in India" }
    ],
    reviews: [
      {
        id: "rev-hoodie-1",
        author: "Devang P.",
        rating: 5,
        date: "2026-04-20",
        title: "Best hoodie I own",
        body: "The double-lined hood stands up perfectly without drawstrings. The embroidery is super clean, and the interior French Terry loops are very soft. Worth every rupee.",
        verified: true,
        helpfulCount: 22,
        avatarColor: "#8D9A8D"
      },
      {
        id: "rev-hoodie-2",
        author: "Rohan S.",
        rating: 5,
        date: "2026-05-04",
        title: "Perfect minimal aesthetic",
        body: "Extremely warm and heavy. The Sage Green color looks even better in person—has a beautiful vintage pigment dye look. True to size for a premium fit.",
        verified: true,
        helpfulCount: 15,
        avatarColor: "#B5A48F"
      },
      {
        id: "rev-hoodie-3",
        author: "Joel M.",
        rating: 5,
        date: "2026-06-05",
        title: "Premium heavy cotton",
        body: "Very solid drape. It feels thick, robust, and the scripture meaning is a beautiful talking point when wearing it around peers. High recommend.",
        verified: true,
        helpfulCount: 9,
        avatarColor: "#9BA2B5"
      }
    ],
    faqs: [
      {
        question: "Is this hoodie brushed fleece inside?",
        answer: "No, it is premium French Terry with a loopback interior. This keeps the hoodie structured and heavyweight (380 GSM) while preventing lint-shedding and making it suitable for moderate to cool Indian climates."
      },
      {
        question: "Does the hoodie have pocket storage?",
        answer: "Yes, it features a clean double-entry kangaroo pocket integrated seamlessly into the side seams, preserving the sleek, minimal front aesthetic of the hoodie."
      },
      {
        question: "What is the return policy?",
        answer: "We offer 7-day hassle-free returns and exchanges for all unworn garments in their original packaging. Simply contact client services at care@ruvenstudio.in."
      }
    ]
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
const MOCK_ORDERS = [
  {
    id: "RV-2026-89104",
    date: "2026-05-14",
    status: "Delivered",
    items: [
      { id: "tee-romans-13-12", size: "L", qty: 1, price: 1999 }
    ],
    subtotal: 1999,
    shipping: 0,
    tax: 239.88,
    discount: 0,
    total: 2238.88,
    address: {
      firstName: "Samuel",
      lastName: "Ruven",
      email: "samuel@ruvenstudio.in",
      phone: "+91 99999 99999",
      address: "12, Creative District, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560038"
    },
    tracking: [
      { status: "Ordered", date: "May 14, 2026", time: "10:30 AM", log: "Order registered under God's protection." },
      { status: "Packed", date: "May 14, 2026", time: "02:15 PM", log: "Garment hand-inspected and custom packed." },
      { status: "Shipped", date: "May 15, 2026", time: "09:00 AM", log: "Handed over to BlueDart courier services." },
      { status: "Out for Delivery", date: "May 17, 2026", time: "11:00 AM", log: "Out for delivery with courier agent." },
      { status: "Delivered", date: "May 17, 2026", time: "03:45 PM", log: "Delivered with joy to recipient." }
    ]
  }
];

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
  recentlyViewed: JSON.parse(localStorage.getItem("ruven_recently_viewed")) || [],
  
  // Phase 7 State additions
  savedForLater: JSON.parse(localStorage.getItem("ruven_saved_for_later")) || [],
  orders: JSON.parse(localStorage.getItem("ruven_orders")) || MOCK_ORDERS,
  addresses: JSON.parse(localStorage.getItem("ruven_addresses")) || [
    {
      firstName: "Samuel",
      lastName: "Ruven",
      email: "samuel@ruvenstudio.in",
      phone: "+91 99999 99999",
      address: "12, Creative District, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560038",
      isDefault: true
    }
  ],
  loyaltyPoints: parseInt(localStorage.getItem("ruven_loyalty_points")) || 250,
  currentCoupon: 0,
  giftWrap: false,
  currentOrderTrackingId: "RV-2026-89104",
  customerIsLoggedIn: sessionStorage.getItem("ruven_customer_logged_in") === "true",
  customerUser: JSON.parse(sessionStorage.getItem("ruven_customer_user")) || null
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
  setupHeroSlideshow();
  
  // Render Dynamic Sections
  renderHomepageGrids();
  renderShopGrid();
  renderCart();
  renderWishlist();
  renderPrayerFeed();
  
  // Handle Initial Route (if hash exists)
  handleHashRoute();
  window.addEventListener("hashchange", handleHashRoute);
  
  // Header Scroll Effect (Throttled with requestAnimationFrame)
  let scrollRAF;
  window.addEventListener("scroll", () => {
    if (!scrollRAF) {
      scrollRAF = window.requestAnimationFrame(() => {
        const header = document.getElementById("site-header");
        if (header) {
          if (window.scrollY > 30) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
        }
        scrollRAF = null;
      });
    }
  }, { passive: true });
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
      closeDrawer("cart");
      closeDrawer("wishlist");
    }
  });
  
  // Mobile Hamburger Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  // Account Button Trigger
  const accountBtn = document.getElementById("account-btn");
  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      closeDrawer("cart");
      closeDrawer("wishlist");
      window.location.hash = "#account";
    });
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
  } else if (["home", "shop", "community", "story", "cart", "checkout", "confirmation", "tracking", "account"].includes(route)) {
    if (route === "story") {
      renderStoryPage();
    } else if (route === "community") {
      renderCommunityPage();
    } else if (route === "cart") {
      renderCartPage();
    } else if (route === "checkout") {
      renderCheckoutPage();
    } else if (route === "confirmation") {
      renderConfirmationPage();
    } else if (route === "tracking") {
      renderTrackingPage();
    } else if (route === "account") {
      renderAccountPage();
    }
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

  // Distraction-Free Layout Check (hide header/footer on checkout)
  const header = document.getElementById("site-header");
  const newsletter = document.getElementById("newsletter-section");
  const footer = document.querySelector("footer");
  
  if (viewName === "checkout") {
    if (header) header.style.display = "none";
    if (newsletter) newsletter.style.display = "none";
    if (footer) footer.style.display = "none";
  } else {
    if (header) header.style.display = "";
    if (newsletter) newsletter.style.display = "";
    if (footer) footer.style.display = "";
  }

  // Ensure drawers are closed
  closeDrawer("cart");
  closeDrawer("wishlist");
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
// 6. PRODUCT DETAILS PAGE RENDERING & ZOOM
function renderProductDetailPage() {
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

  // Inject SEO Schema Markup
  injectSeoSchema(product);

  // Set Breadcrumbs Title
  const breadcrumbTitle = document.getElementById("pdp-breadcrumb-title");
  if (breadcrumbTitle) breadcrumbTitle.textContent = product.title;

  // Local state scoped variables
  let currentImgIdx = 0;
  let selectedSize = product.sizes[0];
  let selectedQty = 1;
  let activeColor = product.colors[0].name;
  let pdpStarFilter = null;
  let pdpSortOrder = "newest";
  let activeSizeGuideTab = "measurements";

  // Render 1. Gallery
  const renderGallery = () => {
    const galleryTarget = document.getElementById("pdp-gallery-target");
    if (!galleryTarget) return;

    const thumbsHtml = product.gallery.map((img, idx) => `
      <button class="pdp-thumb-btn ${idx === currentImgIdx ? 'active' : ''}" data-idx="${idx}">
        <img src="${img}" alt="${product.title} View ${idx + 1}">
      </button>
    `).join("");

    galleryTarget.innerHTML = `
      <div class="pdp-gallery-grid">
        <div class="pdp-thumbnails-wrap">
          ${thumbsHtml}
        </div>
        <div class="pdp-main-image-wrap" id="zoom-container">
          <img src="${product.gallery[currentImgIdx]}" id="zoom-img" alt="${product.title}">
        </div>
      </div>
    `;

    // Hook thumbnail event listeners
    galleryTarget.querySelectorAll(".pdp-thumb-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentImgIdx = parseInt(btn.getAttribute("data-idx"));
        renderGallery();
        bindZoomEvents();
      });
    });
  };

  const bindZoomEvents = () => {
    const container = document.getElementById("zoom-container");
    const img = document.getElementById("zoom-img");
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
  };

  // Render 2. Info details
  const renderInfo = () => {
    const infoTarget = document.getElementById("pdp-info-target");
    if (!infoTarget) return;

    const swatchesHtml = product.colors.map(color => {
      const isSel = color.name === activeColor ? "selected" : "";
      return `
        <button class="pdp-swatch-btn ${isSel}" data-color-name="${color.name}">
          <div class="pdp-swatch-color" style="background-color: ${color.hex};"></div>
        </button>
      `;
    }).join("");

    const sizesHtml = product.sizes.map(size => {
      // Recommend 'L' for both Tee and Hoodie as the signature silhouette
      const isRec = size === "L" ? "recommended" : "";
      const isSel = size === selectedSize ? "selected" : "";
      return `<button class="pdp-size-btn ${isSel} ${isRec}" data-size="${size}">${size}</button>`;
    }).join("");

    const isWishlisted = state.wishlist.includes(product.id);

    infoTarget.innerHTML = `
      <div class="pdp-info-sticky">
        <div>
          <p class="pdp-collection-name">Sovereign Drop</p>
          <h1 class="pdp-product-title">${product.title}</h1>
          <div class="pdp-verse-ref-badge" style="margin-top: 8px;">
            <i data-lucide="book-open" style="width: 12px; height: 12px;"></i>
            <span>Inspired by ${product.verseRef}</span>
          </div>
        </div>

        <div class="pdp-price-row">
          <span class="pdp-price">₹${product.price}</span>
          <span class="pdp-original-price">₹${product.originalPrice}</span>
        </div>

        <p class="pdp-short-desc">${product.verseMeaning}</p>

        <!-- Color Selection -->
        <div class="pdp-color-picker">
          <h5>Color: <span id="pdp-active-color">${activeColor}</span></h5>
          <div class="pdp-color-swatches">
            ${swatchesHtml}
          </div>
        </div>

        <!-- Size Selection -->
        <div>
          <div class="pdp-size-picker-header">
            <h5>Select Size (Intended Oversized Cut)</h5>
            <button class="pdp-size-guide-trigger" id="pdp-size-modal-trigger">
              <i data-lucide="ruler" style="width: 14px; height: 14px;"></i> Size Details
            </button>
          </div>
          <div class="pdp-sizes-grid">
            ${sizesHtml}
          </div>
          <p class="pdp-model-height-info" style="margin-top: 8px;">
            ${product.modelInfo}
          </p>
        </div>

        <!-- Stock Indicator -->
        <div class="pdp-stock-status">
          <div class="pdp-stock-dot"></div>
          <span>Limited Drop. Only 7 items left in stock.</span>
        </div>

        <!-- Actions Row -->
        <div class="pdp-actions-row">
          <div class="pdp-qty-wrap">
            <button class="pdp-qty-btn" id="pdp-qty-minus"><i data-lucide="minus" style="width: 14px; height: 14px;"></i></button>
            <input type="number" class="pdp-qty-input" id="pdp-qty-val" value="${selectedQty}" min="1" readonly>
            <button class="pdp-qty-btn" id="pdp-qty-plus"><i data-lucide="plus" style="width: 14px; height: 14px;"></i></button>
          </div>
          <button class="pdp-add-to-bag-btn" id="pdp-add-btn">
            <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
            <span id="pdp-add-btn-text">Add to bag</span>
          </button>
          <button class="pdp-wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" id="pdp-wish-btn" data-id="${product.id}">
            <i data-lucide="heart" style="width: 18px; height: 18px; fill: ${isWishlisted ? 'var(--color-brand-burgundy)' : 'none'};"></i>
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="pdp-trust-indicators-grid">
          <div class="pdp-trust-item">
            <i class="pdp-trust-icon" data-lucide="award" style="width: 18px; height: 18px;"></i>
            <span class="pdp-trust-text">Organic Knit</span>
          </div>
          <div class="pdp-trust-item">
            <i class="pdp-trust-icon" data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
            <span class="pdp-trust-text">Faith Graphic</span>
          </div>
          <div class="pdp-trust-item">
            <i class="pdp-trust-icon" data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
            <span class="pdp-trust-text">Easy Exchange</span>
          </div>
        </div>
      </div>
    `;

    // Color Swatches Trigger
    infoTarget.querySelectorAll(".pdp-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeColor = btn.getAttribute("data-color-name");
        renderInfo();
        syncMobileStickyBar();
      });
    });

    // Size Selector Trigger
    infoTarget.querySelectorAll(".pdp-size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedSize = btn.getAttribute("data-size");
        renderInfo();
        syncMobileStickyBar();
      });
    });

    // Sizing Modal Trigger
    const modalTrigger = document.getElementById("pdp-size-modal-trigger");
    if (modalTrigger) {
      modalTrigger.addEventListener("click", openSizingModal);
    }

    // Qty Adjusters
    const minus = document.getElementById("pdp-qty-minus");
    const plus = document.getElementById("pdp-qty-plus");
    if (minus) {
      minus.addEventListener("click", () => {
        if (selectedQty > 1) {
          selectedQty--;
          document.getElementById("pdp-qty-val").value = selectedQty;
        }
      });
    }
    if (plus) {
      plus.addEventListener("click", () => {
        selectedQty++;
        document.getElementById("pdp-qty-val").value = selectedQty;
      });
    }

    // Add to Cart
    const addBtn = document.getElementById("pdp-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(product.id, selectedSize, selectedQty);
        
        // Success feedback
        addBtn.classList.add("success");
        const btnText = document.getElementById("pdp-add-btn-text");
        if (btnText) btnText.textContent = "Added to Bag!";
        
        setTimeout(() => {
          addBtn.classList.remove("success");
          if (btnText) btnText.textContent = "Add to bag";
        }, 1500);

        openDrawer("cart");
      });
    }

    // Wishlist Toggle
    const wishBtn = document.getElementById("pdp-wish-btn");
    if (wishBtn) {
      wishBtn.addEventListener("click", () => {
        toggleWishlist(product.id);
        renderInfo();
        renderHomepageGrids(); // Keep other views in sync
      });
    }

    if (window.lucide) window.lucide.createIcons();
  };

  // Render 3. Verse Highlight
  const renderVerse = () => {
    const verseTarget = document.getElementById("pdp-verse-target");
    if (!verseTarget) return;
    verseTarget.innerHTML = `
      <div class="pdp-verse-watermark">${product.verseRef.split(" ")[0]}</div>
      <div class="pdp-verse-inner">
        <p class="pdp-collection-name">Scriptural Context</p>
        <div class="pdp-verse-quote-box">"${product.verseQuote}"</div>
        <div class="pdp-verse-separator"></div>
        <div class="pdp-verse-ref-author">${product.verseRef}</div>
        <p class="pdp-verse-meaning-desc">${product.verseMeaning}</p>
      </div>
    `;
  };

  // Render 4. Story Behind Design
  const renderStory = () => {
    const storyTarget = document.getElementById("pdp-story-target");
    if (!storyTarget) return;
    storyTarget.innerHTML = `
      <div class="pdp-story-layout">
        <div class="pdp-story-content">
          <p class="pdp-story-tagline">Visual Ministry</p>
          <h2 class="pdp-story-heading">Every Thread a Message</h2>
          <p class="pdp-story-desc">${product.designStory}</p>
          <div class="pdp-story-quote">"We design clothing not to conform to modern patterns, but to be an open invitation to share faith in your creative workspaces."</div>
          <p class="pdp-story-desc">Crafted in collaboration with young designers across India, merging premium Scandinavian minimal styles with deeply rooted, conversational spiritual symbols.</p>
        </div>
        <div class="pdp-story-image-wrap">
          <img src="/brand_story_lifestyle.png" alt="Sovereign Collection design story lifestyle photo">
        </div>
      </div>
    `;
  };

  // Render 5. Fabric & Craftsmanship
  const renderFabricCraft = () => {
    const craftTarget = document.getElementById("pdp-craft-target");
    if (!craftTarget) return;

    const cardsHtml = product.detailsList.map(detail => {
      let icon = "info";
      if (detail.label.toLowerCase().includes("fabric")) icon = "scissors";
      if (detail.label.toLowerCase().includes("weight")) icon = "weight";
      if (detail.label.toLowerCase().includes("fit")) icon = "shirt";
      if (detail.label.toLowerCase().includes("print")) icon = "printer";
      if (detail.label.toLowerCase().includes("shrink")) icon = "shield-alert";
      if (detail.label.toLowerCase().includes("origin")) icon = "globe";
      
      return `
        <div class="pdp-craft-card">
          <div class="pdp-craft-card-icon"><i data-lucide="${icon}" style="width: 20px; height: 20px;"></i></div>
          <div class="pdp-craft-card-label">${detail.label}</div>
          <div class="pdp-craft-card-value">${detail.value}</div>
        </div>
      `;
    }).join("");

    craftTarget.innerHTML = `
      <h2 class="pdp-craft-title editorial-title" style="font-size: 1.8rem; font-weight: 700;">Fabric & Specification Blueprint</h2>
      <div class="pdp-craft-grid">
        ${cardsHtml}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  // Render 6. Lifestyle Spread
  const renderLifestyle = () => {
    const lifestyleTarget = document.getElementById("pdp-lifestyle-target");
    if (!lifestyleTarget) return;
    lifestyleTarget.innerHTML = `
      <div class="pdp-lifestyle-spread">
        <img src="/hero_lifestyle.png" alt="Ruven Sovereign lifestyle lookbook">
        <div class="pdp-lifestyle-overlay">
          <div class="pdp-lifestyle-content">
            <span class="pdp-lifestyle-tag">Lookbook Vol 02</span>
            <h2 class="pdp-lifestyle-title">Faith in Motion</h2>
            <p class="pdp-lifestyle-desc">Our garments are engineered to transition seamlessly from academic lecture halls to worship sessions, from quiet library studies to active community campaigns.</p>
          </div>
        </div>
      </div>
    `;
  };

  // Render 7. Sizing Guide Interactive Panel
  const renderSizeGuide = () => {
    const sizeguideTarget = document.getElementById("pdp-sizeguide-target");
    if (!sizeguideTarget) return;

    sizeguideTarget.innerHTML = `
      <div class="pdp-sizeguide-layout">
        <div class="pdp-sizeguide-info">
          <h3>Interactive Sizing Guide</h3>
          <p>This drop features a signature Scandinavian oversized cut. It is designed to drape naturally off the shoulders. Choose your regular size for the intended fit, or size down for a more standard appearance.</p>
          
          <div class="pdp-sizeguide-tabs">
            <button class="pdp-sizeguide-tab-btn ${activeSizeGuideTab === 'measurements' ? 'active' : ''}" data-tab="measurements">Measurements (CM)</button>
            <button class="pdp-sizeguide-tab-btn ${activeSizeGuideTab === 'recommendations' ? 'active' : ''}" data-tab="recommendations">Model Recommendations</button>
          </div>
          
          <div id="pdp-sizeguide-tab-content">
            <!-- Dynamic Content -->
          </div>
        </div>
        
        <div class="pdp-sizeguide-illustration">
          <svg class="pdp-size-sketch" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 20 L35 12 L42 18 L58 18 L65 12 L80 20 L75 35 L68 32 L68 90 L32 90 L32 32 L25 35 Z" stroke="var(--color-text-primary)"/>
            <line x1="32" y1="40" x2="68" y2="40" stroke="var(--color-brand-gold)" stroke-dasharray="2 2"/>
            <text x="50" y="38" fill="var(--color-brand-gold)" font-size="5" text-anchor="middle">A. CHEST</text>
            <line x1="50" y1="18" x2="50" y2="90" stroke="var(--color-brand-gold)" stroke-dasharray="2 2"/>
            <text x="52" y="55" fill="var(--color-brand-gold)" font-size="5" text-anchor="start">B. LENGTH</text>
          </svg>
          <p class="pdp-sketch-desc">Measurements are in centimeters. Width measured across chest, length from collar seam to hem.</p>
        </div>
      </div>
    `;

    const tabContent = document.getElementById("pdp-sizeguide-tab-content");
    if (tabContent) {
      if (activeSizeGuideTab === "measurements") {
        if (product.category === "oversized-tees") {
          tabContent.innerHTML = `
            <table class="pdp-sizeguide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest Width (cm)</th>
                  <th>Body Length (cm)</th>
                  <th>Sleeve Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>56</td><td>70</td><td>22</td></tr>
                <tr><td>M</td><td>59</td><td>72</td><td>23</td></tr>
                <tr><td>L</td><td>62</td><td>74</td><td>24</td></tr>
                <tr><td>XL</td><td>65</td><td>76</td><td>25</td></tr>
              </tbody>
            </table>
          `;
        } else {
          tabContent.innerHTML = `
            <table class="pdp-sizeguide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest Width (cm)</th>
                  <th>Body Length (cm)</th>
                  <th>Sleeve Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>M</td><td>61</td><td>71</td><td>63</td></tr>
                <tr><td>L</td><td>64</td><td>73</td><td>64</td></tr>
                <tr><td>XL</td><td>67</td><td>75</td><td>65</td></tr>
              </tbody>
            </table>
          `;
        }
      } else {
        tabContent.innerHTML = `
          <div class="pdp-size-recommendations" style="display: flex; flex-direction: column; gap: var(--spacing-xs); margin-top: 10px;">
            <div style="background: var(--color-white); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border);">
              <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 2px;">Standard Fit (Relaxed)</h4>
              <p style="font-size: 0.8rem; color: var(--color-text-muted);">Choose one size smaller than your standard size if you prefer a traditional, closer-to-body look.</p>
            </div>
            <div style="background: var(--color-white); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--color-border);">
              <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 2px;">Oversized Look (Intended)</h4>
              <p style="font-size: 0.8rem; color: var(--color-text-muted);">Choose your normal size. The shoulders are dropped, and chest is broad to create a modern slouchy shape.</p>
            </div>
          </div>
        `;
      }
    }

    // Sizing guide tabs click triggers
    sizeguideTarget.querySelectorAll(".pdp-sizeguide-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeSizeGuideTab = btn.getAttribute("data-tab");
        renderSizeGuide();
      });
    });
  };

  // Render 8. Accordions
  const renderSupportAccordions = () => {
    const supportTarget = document.getElementById("pdp-support-target");
    if (!supportTarget) return;

    const faqsHtml = product.faqs.map((faq, idx) => `
      <div class="pdp-accordion-item">
        <button class="pdp-accordion-header" data-idx="${idx}">
          <span>${faq.question}</span>
          <span class="pdp-accordion-header-icon"><i data-lucide="plus" style="width: 16px; height: 16px;"></i></span>
        </button>
        <div class="pdp-accordion-content">
          <div class="pdp-accordion-content-inner">
            <p>${faq.answer}</p>
          </div>
        </div>
      </div>
    `).join("");
    
    const defaultFaqHtml = `
      <div class="pdp-accordion-item">
        <button class="pdp-accordion-header" data-idx="default-ship">
          <span>What are your shipping rates and delivery times in India?</span>
          <span class="pdp-accordion-header-icon"><i data-lucide="plus" style="width: 16px; height: 16px;"></i></span>
        </button>
        <div class="pdp-accordion-content">
          <div class="pdp-accordion-content-inner">
            <p>We provide free express shipping on all orders above ₹1,500. Delivery to metropolitan cities (Mumbai, Bengaluru, Delhi) takes 3-4 business days. For rest of India, it takes 5-7 business days.</p>
          </div>
        </div>
      </div>
    `;

    supportTarget.innerHTML = `
      <div class="pdp-support-layout">
        <h2 class="pdp-support-title editorial-title" style="font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: var(--spacing-xl);">Care, Shipping & Support</h2>
        <div class="pdp-accordions-container" style="border-top: 1px solid var(--color-border);">
          ${faqsHtml}
          ${defaultFaqHtml}
        </div>
      </div>
    `;

    // Accordions expand click triggers
    supportTarget.querySelectorAll(".pdp-accordion-header").forEach(header => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const content = item.querySelector(".pdp-accordion-content");
        const isActive = header.classList.contains("active");

        // Close all other accordions first
        supportTarget.querySelectorAll(".pdp-accordion-header").forEach(h => {
          h.classList.remove("active");
          h.parentElement.querySelector(".pdp-accordion-content").style.maxHeight = null;
        });

        if (!isActive) {
          header.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  // Render 9. Customer Reviews Panel
  const renderReviews = () => {
    const reviewsTarget = document.getElementById("pdp-reviews-target");
    if (!reviewsTarget) return;

    // Filter reviews
    let filteredReviews = [...product.reviews];
    if (pdpStarFilter !== null) {
      filteredReviews = filteredReviews.filter(r => r.rating === pdpStarFilter);
    }

    // Sort reviews
    if (pdpSortOrder === "newest") {
      filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    const totalReviews = product.reviews.length;
    const avgRating = totalReviews > 0 
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

    const ratingBars = [5, 4, 3, 2, 1].map(stars => {
      const count = product.reviews.filter(r => r.rating === stars).length;
      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      const isActive = pdpStarFilter === stars ? "active" : "";
      return `
        <div class="pdp-distribution-row ${isActive}" data-stars="${stars}">
          <span>${stars} star</span>
          <div class="pdp-dist-bar-bg">
            <div class="pdp-dist-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span style="text-align: right; color: var(--color-text-muted);">${count}</span>
        </div>
      `;
    }).join("");

    const getStarsHtml = (rating) => {
      let stars = "";
      for (let i = 1; i <= 5; i++) {
        const isFilled = i <= rating ? "currentColor" : "none";
        stars += `<i data-lucide="star" style="width: 14px; height: 14px; fill: ${isFilled};"></i>`;
      }
      return stars;
    };

    const reviewCardsHtml = filteredReviews.map(rev => `
      <div class="pdp-review-card">
        <div class="pdp-review-meta">
          <div class="pdp-review-stars">
            ${getStarsHtml(rev.rating)}
          </div>
          <span class="pdp-review-date">${rev.date}</span>
        </div>
        <div class="pdp-review-author-row">
          <div class="pdp-review-avatar" style="background-color: ${rev.avatarColor};">${rev.author.charAt(0)}</div>
          <span class="pdp-review-author">${rev.author}</span>
          ${rev.verified ? `
            <span class="pdp-review-verified">
              <i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> Verified Purchase
            </span>
          ` : ""}
        </div>
        <h4 class="pdp-review-title">${rev.title}</h4>
        <p class="pdp-review-body">${rev.body}</p>
        <div class="pdp-review-helpful">
          <span>Was this review helpful?</span>
          <button class="pdp-review-helpful-btn" data-rev-id="${rev.id}">
            <i data-lucide="thumbs-up" style="width: 12px; height: 12px;"></i>
            <span>(${rev.helpfulCount})</span>
          </button>
        </div>
      </div>
    `).join("");

    reviewsTarget.innerHTML = `
      <div style="max-width: var(--max-width-site); margin: 0 auto;">
        <h2 class="pdp-craft-title editorial-title" style="font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: var(--spacing-xl);">Customer Reflections</h2>
        
        <div class="pdp-reviews-grid">
          <!-- Summary card left -->
          <div class="pdp-reviews-summary-card">
            <span class="pdp-reviews-score">${avgRating}</span>
            <div class="pdp-reviews-stars-wrap">
              ${getStarsHtml(Math.round(parseFloat(avgRating)))}
            </div>
            <span class="pdp-reviews-total-text">Based on ${totalReviews} verified reviews</span>
            <div class="pdp-reviews-distribution">
              ${ratingBars}
            </div>
            ${pdpStarFilter !== null ? `
              <button class="plp-compare-clear-btn" id="pdp-clear-review-filter" style="margin-top: 10px;">Clear Filter</button>
            ` : ""}
          </div>
          
          <!-- Reviews list right -->
          <div>
            <div class="pdp-reviews-toolbar">
              <span class="pdp-reviews-toolbar-title">${filteredReviews.length} Reflections</span>
              <div style="display: flex; gap: var(--spacing-sm); align-items: center;">
                <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Sort By:</label>
                <select class="plp-sort-dropdown" id="pdp-review-sort" style="padding: 6px 12px; font-size: 0.8rem;">
                  <option value="newest" ${pdpSortOrder === "newest" ? "selected" : ""}>Newest First</option>
                  <option value="helpful" ${pdpSortOrder === "helpful" ? "selected" : ""}>Most Helpful</option>
                </select>
              </div>
            </div>
            <div class="pdp-reviews-list-container">
              ${filteredReviews.length > 0 ? reviewCardsHtml : `
                <p style="text-align: center; color: var(--color-text-muted); padding: 40px 0;">No reviews matching selected rating.</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // Click triggers for Rating distribution rows
    reviewsTarget.querySelectorAll(".pdp-distribution-row").forEach(row => {
      row.addEventListener("click", () => {
        const star = parseInt(row.getAttribute("data-stars"));
        pdpStarFilter = pdpStarFilter === star ? null : star; // Toggle filter
        renderReviews();
      });
    });

    // Clear filter trigger
    const clearReviewFilter = document.getElementById("pdp-clear-review-filter");
    if (clearReviewFilter) {
      clearReviewFilter.addEventListener("click", () => {
        pdpStarFilter = null;
        renderReviews();
      });
    }

    // Sort order dropdown trigger
    const sortDropdown = document.getElementById("pdp-review-sort");
    if (sortDropdown) {
      sortDropdown.addEventListener("change", (e) => {
        pdpSortOrder = e.target.value;
        renderReviews();
      });
    }

    // Helpfulness clicks
    reviewsTarget.querySelectorAll(".pdp-review-helpful-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const revId = btn.getAttribute("data-rev-id");
        const review = product.reviews.find(r => r.id === revId);
        if (review) {
          review.helpfulCount++;
          renderReviews();
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  // Render 10. Related Products
  const renderRelated = () => {
    const relatedTarget = document.getElementById("pdp-related-target");
    if (!relatedTarget) return;

    // Recommend the other product
    const relatedProducts = PRODUCTS.filter(p => p.id !== product.id);

    const relatedCardsHtml = relatedProducts.map(p => `
      <div class="product-card" style="border: 1px solid var(--color-border); border-radius: var(--border-radius-md); overflow: hidden; background: var(--color-white);">
        <a href="#product/${p.id}" class="nav-trigger" data-view="product" style="display: block; aspect-ratio: 4/5; overflow: hidden; position: relative;">
          <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="plp-card-action-overlay">
            <span class="plp-card-quick-add-btn" style="text-align: center; display: block; font-size: 0.72rem; padding: 10px;">Explore Drop</span>
          </div>
        </a>
        <div class="plp-card-info" style="padding: 15px;">
          <div class="plp-card-meta">
            <span class="plp-card-verse-ref">${p.verseRef}</span>
          </div>
          <h4 class="plp-card-title" style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">${p.title}</h4>
          <div class="plp-card-price-row">
            <span class="plp-card-price">₹${p.price}</span>
          </div>
        </div>
      </div>
    `).join("");

    relatedTarget.innerHTML = `
      <div class="pdp-related-header">
        <p class="pdp-collection-name">Complete the Look</p>
        <h2 class="editorial-title" style="font-size: 1.8rem; font-weight: 700;">Styled with Purpose</h2>
      </div>
      <div class="pdp-related-grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
        ${relatedCardsHtml}
      </div>
    `;

    // Hook card navigations
    relatedTarget.querySelectorAll(".nav-trigger").forEach(link => {
      link.addEventListener("click", (e) => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    });
  };

  // Render 11. Recently Viewed
  const renderRecentlyViewed = () => {
    const recentTarget = document.getElementById("pdp-recent-section");
    if (!recentTarget) return;

    // Filter viewed items to exclude the current one
    const viewedIds = state.recentlyViewed.filter(id => id !== product.id);

    if (viewedIds.length === 0) {
      recentTarget.style.display = "none";
      return;
    }
    recentTarget.style.display = "block";

    const viewedProducts = viewedIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    const cardsHtml = viewedProducts.map(p => `
      <div class="pdp-recent-card" style="border: 1px solid var(--color-border); border-radius: var(--border-radius-md); overflow: hidden; background: var(--color-white);">
        <a href="#product/${p.id}" class="nav-trigger" data-view="product" style="display: block; aspect-ratio: 4/5; overflow: hidden; position: relative;">
          <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </a>
        <div style="padding: 12px;">
          <span style="font-size: 0.65rem; font-weight: 700; color: var(--color-brand-gold); text-transform: uppercase;">${p.verseRef}</span>
          <h4 style="font-size: 0.88rem; font-weight: 700; margin: 4px 0 6px;">${p.title}</h4>
          <span style="font-weight: 700; font-size: 0.88rem; color: var(--color-text-primary);">₹${p.price}</span>
        </div>
      </div>
    `).join("");

    recentTarget.innerHTML = `
      <div style="margin-bottom: var(--spacing-lg);">
        <p class="pdp-collection-name">Continue Browsing</p>
        <h2 class="editorial-title" style="font-size: 1.8rem; font-weight: 700;">Recently Explored</h2>
      </div>
      <div class="pdp-recent-carousel">
        ${cardsHtml}
      </div>
    `;

    // Hook navigations
    recentTarget.querySelectorAll(".nav-trigger").forEach(link => {
      link.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    });
  };

  // Render 12. Community UGC Gallery
  const renderCommunityInspiration = () => {
    const commTarget = document.getElementById("pdp-community-target");
    if (!commTarget) return;

    // Static community lookbook items matching local assets
    const ugcItems = [
      { img: "/brand_story_lifestyle.png", handle: "@amit_k12", caption: "Walking into college with purpose. Shield of Light Tee." },
      { img: "/hero_lifestyle.png", handle: "@christina_sharma", caption: "Renewed in mind, focused on fellowship. Love the Sage green tone." },
      { img: "/hero2.png", handle: "@sarah.m", caption: "Double lined hood structure is perfect. Romans 12:2." },
      { img: "/oversized_tee_product.png", handle: "@joel_mercy", caption: "Conversation starter indeed. Built heavy, worn with pride." }
    ];

    const cardsHtml = ugcItems.map(item => `
      <div class="pdp-community-card">
        <img src="${item.img}" alt="Community lookbook post by ${item.handle}">
        <div class="pdp-community-hover-overlay">
          <div class="pdp-community-handle">${item.handle}</div>
          <p class="pdp-community-caption">"${item.caption}"</p>
          <div style="margin-top: 10px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--color-brand-gold);">@ruven.studio</div>
        </div>
      </div>
    `).join("");

    commTarget.innerHTML = `
      <div class="pdp-related-header">
        <p class="pdp-collection-name">Fellowship Inspiration</p>
        <h2 class="editorial-title" style="font-size: 1.8rem; font-weight: 700;">Worn in Community</h2>
      </div>
      <div class="pdp-community-grid">
        ${cardsHtml}
      </div>
    `;
  };

  // Render 13. Mobile Sticky Purchase Bar
  const renderMobileStickyBar = () => {
    const stickyBar = document.getElementById("pdp-mobile-sticky-bar");
    if (!stickyBar) return;

    stickyBar.innerHTML = `
      <div class="pdp-mobile-bar-summary">
        <h4 style="font-size: 0.88rem; font-weight:700; margin-bottom:2px;">${product.title}</h4>
        <p style="font-size: 0.75rem; color: var(--color-text-muted);">₹${product.price} • Selected: <span id="pdp-mobile-selected-size" style="font-weight:700; color:var(--color-brand-burgundy);">${selectedSize}</span></p>
      </div>
      <div class="pdp-mobile-bar-actions">
        <button class="pdp-mobile-add-btn" id="pdp-mobile-add-btn-act">Add to Bag</button>
      </div>
    `;

    // Hook sticky button action
    const stickyAdd = document.getElementById("pdp-mobile-add-btn-act");
    if (stickyAdd) {
      stickyAdd.addEventListener("click", () => {
        addToCart(product.id, selectedSize, selectedQty);
        
        stickyAdd.textContent = "Added!";
        stickyAdd.style.backgroundColor = "var(--color-brand-sage)";
        setTimeout(() => {
          stickyAdd.textContent = "Add to Bag";
          stickyAdd.style.backgroundColor = "var(--color-brand-burgundy)";
        }, 1500);

        openDrawer("cart");
      });
    }
  };

  const syncMobileStickyBar = () => {
    const el = document.getElementById("pdp-mobile-selected-size");
    if (el) el.textContent = selectedSize;
  };

  // Render Sizing Modal content
  const openSizingModal = () => {
    const modal = document.getElementById("pdp-size-modal");
    const modalBody = document.getElementById("pdp-modal-body");
    if (!modal || !modalBody) return;

    let chartHtml = "";
    if (product.category === "oversized-tees") {
      chartHtml = `
        <table class="pdp-sizeguide-table" style="margin-top: 15px;">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest Width (cm)</th>
              <th>Body Length (cm)</th>
              <th>Sleeve Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>S</td><td>56</td><td>70</td><td>22</td></tr>
            <tr><td>M</td><td>59</td><td>72</td><td>23</td></tr>
            <tr><td>L</td><td>62</td><td>74</td><td>24</td></tr>
            <tr><td>XL</td><td>65</td><td>76</td><td>25</td></tr>
          </tbody>
        </table>
      `;
    } else {
      chartHtml = `
        <table class="pdp-sizeguide-table" style="margin-top: 15px;">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest Width (cm)</th>
              <th>Body Length (cm)</th>
              <th>Sleeve Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>M</td><td>61</td><td>71</td><td>63</td></tr>
            <tr><td>L</td><td>64</td><td>73</td><td>64</td></tr>
            <tr><td>XL</td><td>67</td><td>75</td><td>65</td></tr>
          </tbody>
        </table>
      `;
    }

    modalBody.innerHTML = `
      <h3 class="editorial-title" style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-sm);">${product.title} Dimension Chart</h3>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5;">This drops features dropped shoulders, extended sleeves, and a generous boxy chest cut. If you prefer a fitted look, select one size down from your usual size.</p>
      ${chartHtml}
      <div style="margin-top: 20px; text-align: center;">
        <button class="cta-button cta-button-primary" id="pdp-modal-close-action" style="padding: 10px 24px; font-size: 0.8rem;">Close Sizing Table</button>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable scroll behind modal

    // Close listeners
    const closeBtn = document.getElementById("pdp-modal-close-btn");
    const closeAct = document.getElementById("pdp-modal-close-action");
    const overlay = modal.querySelector(".pdp-modal-overlay");

    const closeHandler = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeHandler);
    if (closeAct) closeAct.addEventListener("click", closeHandler);
    if (overlay) overlay.addEventListener("click", closeHandler);
  };

  // Set Observer for Mobile Sticky Purchase Bar
  const setupMobileStickyBarObserver = () => {
    const targetBtn = document.getElementById("pdp-add-btn");
    const stickyBar = document.getElementById("pdp-mobile-sticky-bar");
    
    if (targetBtn && stickyBar && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Show on mobile when the main CTA is out of view
          if (!entry.isIntersecting && window.innerWidth <= 768) {
            stickyBar.classList.add("active");
          } else {
            stickyBar.classList.remove("active");
          }
        });
      }, { threshold: 0 });
      
      observer.observe(targetBtn);
    }
  };

  // Execute all renders
  renderGallery();
  bindZoomEvents();
  renderInfo();
  renderVerse();
  renderStory();
  renderFabricCraft();
  renderLifestyle();
  renderSizeGuide();
  renderSupportAccordions();
  renderReviews();
  renderRelated();
  renderRecentlyViewed();
  renderCommunityInspiration();
  renderMobileStickyBar();
  setupMobileStickyBarObserver();
}

function injectSeoSchema(product) {
  let schemaEl = document.getElementById("pdp-seo-schema");
  if (!schemaEl) {
    schemaEl = document.createElement("script");
    schemaEl.type = "application/ld+json";
    schemaEl.id = "pdp-seo-schema";
    document.head.appendChild(schemaEl);
  }
  
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [
      window.location.origin + product.image
    ],
    "description": product.fabricDetails,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Ruven Studio"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-01-01",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": product.reviews.length.toString()
    }
  };
  
  schemaEl.textContent = JSON.stringify(productSchema);
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
  
  const checkoutAction = (e) => {
    if (state.cart.length === 0) {
      if (e) e.preventDefault();
      showToast("Your studio bag is empty!");
      return;
    }
    closeDrawer("cart");
    window.location.hash = "#checkout";
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
    const progressWrap = document.getElementById("drawer-shipping-progress-wrap");
    if (progressWrap) progressWrap.style.display = "none";

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
  
  // Calculate Subtotal & Shipping Progress
  let subtotal = 0;
  state.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) subtotal += product.price * item.qty;
  });

  const progressWrap = document.getElementById("drawer-shipping-progress-wrap");
  const progressText = document.getElementById("drawer-shipping-progress-needed");
  const progressBar = document.getElementById("drawer-shipping-progress-bar");
  
  if (progressWrap) {
    progressWrap.style.display = "block";
    const threshold = 3000;
    if (subtotal >= threshold) {
      if (progressText) progressText.innerHTML = `<span style="color:var(--color-brand-sage); font-weight:700;">Free Shipping Achieved!</span>`;
      if (progressBar) progressBar.style.width = "100%";
    } else {
      const diff = threshold - subtotal;
      if (progressText) progressText.innerHTML = `You're <strong>₹${diff}</strong> away from Free Shipping`;
      if (progressBar) progressBar.style.width = `${(subtotal / threshold) * 100}%`;
    }
  }

  document.getElementById("cart-drawer-footer").style.display = "block";
  
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

// 11. ANNOUNCEMENT BAR VALUE ROTATION (Now handled via CSS infinite marquee)
function setupAnnouncementBar() {
  // Infinite scroll marquee is fully managed via hardware-accelerated CSS animations in index.css
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

// 13b. HERO SLIDESHOW INTERACTION (Editorial Fade with Line Indicators)
function setupHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator-dot");
  if (slides.length <= 1) return;

  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000; // 5 seconds per slide

  function showSlide(index) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove("active");
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.remove("active");
    }

    // Set new slide index
    currentSlide = (index + slides.length) % slides.length;

    // Add active class to new slide and indicator
    slides[currentSlide].classList.add("active");
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add("active");
      
      // Force CSS reflow on indicators to restart the progress animation
      const activeIndicator = indicators[currentSlide];
      activeIndicator.style.animation = 'none';
      activeIndicator.offsetHeight; // trigger reflow
      activeIndicator.style.animation = null;
    }
  }

  function startSlideshow() {
    stopSlideshow();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Attach click events to indicators
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener("click", () => {
      showSlide(idx);
      startSlideshow(); // Reset timer after manual click
    });
  });

  // Start the autoplay slideshow
  startSlideshow();
}

// 14. SCROLL REVEAL MICRO-INTERACTION
function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -5% 0px"
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// ==========================================================================
// Phase 6: Brand, Community & Content Experience Datasets & Logic
// ==========================================================================

const TIMELINE_EVENTS = [
  { date: "November 2025", title: "The Genesis", desc: "Ruven Studio is founded with a core vision: to design premium minimal streetwear that acts as an open invitation to share faith in Christ. Operating out of a small studio in Bengaluru, we set out to craft clothing that starts conversations." },
  { date: "February 2026", title: "The First Drop (Armor Collection)", desc: "We launched the first collections incorporating scripture (Romans 13:12 & Romans 12:2). 300 custom screen-printed units sold out in weeks. The design became a badge of identity and fellowship among campus youth." },
  { date: "June 2026", title: "Sovereign Drops & National Fellowship", desc: "We expanded our design blueprint, refined sizing templates, integrated community prayer walls, and partnered with youth chapters in over 15 campuses across metropolitan India." }
];

const STORY_VALUES = [
  { icon: "award", title: "Faith First", desc: "Every graphic print, custom cut, and embroidered thread is conceptualized through prayer. We prioritize spiritual message and visual ministry above raw retail numbers." },
  { icon: "sparkles", title: "Modern Creativity", desc: "No generic designs. We merge premium Scandinavian minimalism, boxy street draping, and muted organic color swatches with clean, historic scripture iconography." },
  { icon: "users", title: "Community Always", desc: "Ruven Studio is a collective movement. We stand in prayer with you, sponsor church youth fellowships, and support campus ministries nationwide." }
];

const BELIEFS = [
  { title: "Identity in Christ", desc: "You are not defined by modern labels or cultural conformity. We believe every youth is fearfully and wonderfully made, chosen for a specific divine purpose." },
  { title: "Grace & Love", desc: "We preach a welcoming, non-denominational faith centered on the message of Christ's grace and unconditional love for every individual." },
  { title: "Quiet Hope", desc: "In a noisy, anxious world, we design structured garments that serve as gentle, peaceful anchors to represent light in creative offices and classrooms." }
];

const CUSTOMER_TESTIMONIES = [
  { author: "Samuel K.", location: "Bengaluru College Chapter", text: "Wearing the Armor of Light Tee at campus opened up a 40-minute conversation about faith with my lab partner who had never stepped inside a church. The minimalist shield graphic works perfectly.", verse: "Romans 13:12", product: "Armor of Light Tee", avatarColor: "#B5A48F" },
  { author: "Christina S.", location: "Delhi Worship Circle", text: "The Renewal of Mind hoodie is my daily comfort layer. It's thick, structured, and the embroidered branch is a beautiful, quiet reminder of peace.", verse: "Romans 12:2", product: "Renewal French Terry Hoodie", avatarColor: "#8D9A8D" },
  { author: "Priyan J.", location: "Mumbai Creative Office", text: "The weight and stitch quality match premium high-end Scandinavian streetwear. Plus, the message and ministry behind it align with what I stand for.", verse: "John 1:5", product: "Armor of Light Tee", avatarColor: "#9BA2B5" }
];


function showToast(message) {
  const toast = document.getElementById("success-toast");
  const msgEl = document.getElementById("toast-message");
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  }
}

// 1. STORY PAGE RENDERER
function renderStoryPage() {
  const timelineTarget = document.getElementById("story-timeline-target");
  const founderTarget = document.getElementById("story-founder-target");
  const missionTarget = document.getElementById("story-mission-target");
  const beliefsTarget = document.getElementById("story-beliefs-target");

  // Timeline
  if (timelineTarget) {
    const itemsHtml = TIMELINE_EVENTS.map(ev => `
      <div class="timeline-item reveal-on-scroll">
        <div class="timeline-dot"></div>
        <div class="timeline-date">${ev.date}</div>
        <div class="timeline-content">
          <h3>${ev.title}</h3>
          <p>${ev.desc}</p>
        </div>
      </div>
    `).join("");

    timelineTarget.innerHTML = `
      <h2 class="timeline-title editorial-title" style="font-size: 1.8rem; font-weight: 700;">Our Journey</h2>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        ${itemsHtml}
      </div>
    `;
  }

  // Founder Section
  if (founderTarget) {
    founderTarget.innerHTML = `
      <div class="founder-layout">
        <div class="founder-img-wrap">
          <!-- Stylized initial avatar placeholder -->
          <span style="font-size: 5rem; font-weight: 300; color: var(--color-brand-gold);">SR</span>
        </div>
        <div class="founder-content">
          <p class="founder-tagline">Founder Letter</p>
          <h2 class="founder-title">A Message from Bengaluru</h2>
          <p class="founder-letter">
            "Ruven Studio was born out of a simple struggle: as young Christians, we wanted to wear premium streetwear that reflected our values without being cheesy or loud. We wanted something high-quality, minimal, and deeply intentional."
          </p>
          <p class="founder-letter">
            "We hope that when you put on a Ruven garment, it acts as more than just a layer of comfort—it serves as a quiet badge of identity and an invitation to speak about the light in your schools, coffee shops, and creative hubs."
          </p>
          <div class="founder-signature-box">
            <div class="founder-signature">Samuel Ruven</div>
            <div class="founder-role">Founder & Creative Director</div>
          </div>
        </div>
      </div>
    `;
  }

  // Mission Values
  if (missionTarget) {
    const valuesHtml = STORY_VALUES.map(val => `
      <div class="mission-value-card">
        <div class="mission-value-icon"><i data-lucide="${val.icon}" style="width: 24px; height: 24px;"></i></div>
        <h4 class="mission-value-title">${val.title}</h4>
        <p class="mission-value-desc">${val.desc}</p>
      </div>
    `).join("");

    missionTarget.innerHTML = `
      <h2 class="mission-title editorial-title" style="font-size: 1.8rem; font-weight: 700;">Core Values</h2>
      <div class="mission-values-grid">
        ${valuesHtml}
      </div>
    `;
  }

  // Beliefs
  if (beliefsTarget) {
    const itemsHtml = BELIEFS.map(bel => `
      <div class="belief-item">
        <h4 class="belief-title">${bel.title}</h4>
        <p class="belief-desc">${bel.desc}</p>
      </div>
    `).join("");

    beliefsTarget.innerHTML = `
      <div class="beliefs-layout">
        <h2 class="beliefs-heading editorial-title">What We Stand For</h2>
        <p class="beliefs-desc-text">
          Ruven Studio is an independent, non-denominational faith collective. We exist to encourage people through positive values and scriptural clarity, welcoming everyone on their unique spiritual journey.
        </p>
        <div class="beliefs-grid">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
  setupScrollReveal();
}

// 2. COMMUNITY PAGE RENDERER
function renderCommunityPage() {
  const statsTarget = document.getElementById("community-impact-target");
  const galleryTarget = document.getElementById("community-gallery-target");
  const feedTarget = document.getElementById("prayer-wall-feed-v3");
  const testimoniesTarget = document.getElementById("community-testimonies-target");

  // Dynamic Stats
  if (statsTarget) {
    statsTarget.innerHTML = `
      <div class="impact-stats-grid">
        <div class="impact-stat-card">
          <span class="impact-stat-number">15+</span>
          <span class="impact-stat-label">Campus Chapters</span>
        </div>
        <div class="impact-stat-card">
          <span class="impact-stat-number">5k+</span>
          <span class="impact-stat-label">Verses Shared</span>
        </div>
        <div class="impact-stat-card">
          <span class="impact-stat-number">1,200+</span>
          <span class="impact-stat-label">Lives Encouraged</span>
        </div>
        <div class="impact-stat-card">
          <span class="impact-stat-number">30+</span>
          <span class="impact-stat-label">Church Partnerships</span>
        </div>
      </div>
    `;
  }

  // UGC Gallery
  if (galleryTarget) {
    galleryTarget.innerHTML = `
      <h4>Fellowship Moments</h4>
      <div class="comm-widget-grid">
        <div class="comm-widget-item"><img src="/brand_story_lifestyle.png" alt="Worship Circle"></div>
        <div class="comm-widget-item"><img src="/hero_lifestyle.png" alt="Campus Meet"></div>
        <div class="comm-widget-item"><img src="/hero2.png" alt="Church Youth group"></div>
        <div class="comm-widget-item"><img src="/oversized_tee_product.png" alt="Creative office"></div>
        <div class="comm-widget-item"><img src="/faith_hoodie_product.png" alt="Cafe reflection"></div>
        <div class="comm-widget-item"><img src="/brand_story_lifestyle.png" alt="Fellowship gathering"></div>
      </div>
    `;
  }

  // Render testimonies
  if (testimoniesTarget) {
    const cardsHtml = CUSTOMER_TESTIMONIES.map(t => `
      <div class="testimony-card">
        <div class="testimony-header">
          <div class="testimony-avatar" style="background-color: ${t.avatarColor};">${t.author.charAt(0)}</div>
          <div class="testimony-meta">
            <h4>${t.author}</h4>
            <p>${t.location}</p>
          </div>
        </div>
        <p class="testimony-body">"${t.text}"</p>
        <div class="testimony-footer">
          <div class="testimony-fav-verse"><span>Favorite Quote:</span> ${t.verse}</div>
          <div class="testimony-fav-prod"><span>Favorite Fit:</span> ${t.product}</div>
        </div>
      </div>
    `).join("");

    testimoniesTarget.innerHTML = `
      <h2 class="editorial-title" style="font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: var(--spacing-xl);">Fellowship Stories</h2>
      <div class="testimonies-grid">
        ${cardsHtml}
      </div>
    `;
  }

  // Render active prayer feed
  const renderPrayersFeed = () => {
    if (!feedTarget) return;

    feedTarget.innerHTML = state.prayers.map(prayer => {
      const isVotedClass = prayer.voted ? "active" : "";
      return `
        <div class="prayer-card" style="border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); padding: var(--spacing-md); background: var(--color-white); display: flex; flex-direction: column; gap: var(--spacing-xs); margin-bottom: var(--spacing-sm); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: var(--border-radius-full); background: var(--color-brand-gold); color: var(--color-white); font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; justify-content: center;">
                ${prayer.author.charAt(0)}
              </div>
              <span style="font-weight: 700; font-size: 0.85rem;">${prayer.author}</span>
              <span style="color: var(--color-text-muted); font-size: 0.72rem;">• ${prayer.location}</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--color-brand-sage); font-weight: 700; text-transform: uppercase;">Prayer Wall</span>
          </div>
          <p style="font-size: 0.88rem; line-height: 1.5; color: var(--color-text-primary); font-style: italic;">"${prayer.message}"</p>
          <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 4px;">
            <button class="votw-btn ${isVotedClass}" data-prayer-id="${prayer.id}" style="padding: 6px 12px; font-size: 0.7rem; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="heart" style="width: 12px; height: 12px; fill: ${prayer.voted ? 'var(--color-brand-burgundy)' : 'none'};"></i>
              <span>Stand in Prayer (${prayer.count})</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Prayer counters triggers
    feedTarget.querySelectorAll(".votw-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-prayer-id"));
        const item = state.prayers.find(p => p.id === id);
        if (item) {
          if (!item.voted) {
            item.count++;
            item.voted = true;
            showToast("Added to prayer counts. Standing with you!");
          } else {
            item.count--;
            item.voted = false;
          }
          localStorage.setItem("ruven_prayers", JSON.stringify(state.prayers));
          renderPrayersFeed();
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  renderPrayersFeed();

  // Prayer submit form
  const form = document.getElementById("prayer-request-form-v3");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const authorVal = document.getElementById("prayer-author-v3").value;
      const locationVal = document.getElementById("prayer-location-v3").value;
      const messageVal = document.getElementById("prayer-message-v3").value;

      const newPrayer = {
        id: Date.now(),
        author: authorVal,
        location: locationVal,
        message: messageVal,
        count: 1,
        voted: true
      };

      state.prayers.unshift(newPrayer);
      localStorage.setItem("ruven_prayers", JSON.stringify(state.prayers));
      
      form.reset();
      showToast("Your prayer request has been submitted to the wall.");
      renderPrayersFeed();
    });
  }

  if (window.lucide) window.lucide.createIcons();
}



// ==========================================================================
// Phase 7 SPA Page Renderers & Event Handlers
// ==========================================================================

let activeAccountTab = "profile";
let activePaymentMethod = "card";
let checkoutShippingDetails = {};
let userCompletedChallenges = [];

// 1. SHOPPING CART PAGE RENDERER
function renderCartPage() {
  const shippingTarget = document.getElementById("cart-page-shipping-container");
  const itemsTarget = document.getElementById("cart-page-items-target");
  const savedTarget = document.getElementById("cart-page-saved-target");
  const rowsTarget = document.getElementById("cart-page-summary-rows");
  const totalValTarget = document.getElementById("cart-page-total-val");
  const upsellTarget = document.getElementById("cart-upsell-target");
  const giftCheck = document.getElementById("cart-gift-wrap-check");

  if (!itemsTarget) return;

  // Calculate subtotal
  let subtotal = 0;
  state.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) subtotal += product.price * item.qty;
  });

  // Calculate discount
  let discountAmount = Math.round(subtotal * (state.currentCoupon / 100));

  // Gift wrap cost
  let giftWrapCost = state.giftWrap ? 100 : 0;

  // Shipping cost
  const threshold = 3000;
  let shippingCost = 0;
  if (subtotal > 0) {
    shippingCost = subtotal >= threshold ? 0 : 150;
  }

  let grandTotal = subtotal - discountAmount + shippingCost + giftWrapCost;

  // Free shipping progress rendering
  if (shippingTarget) {
    if (subtotal === 0) {
      shippingTarget.style.display = "none";
    } else {
      shippingTarget.style.display = "block";
      if (subtotal >= threshold) {
        shippingTarget.innerHTML = `
          <div style="display:flex; justify-content:space-between; font-size: 0.8rem; font-weight:700; text-transform:uppercase; margin-bottom: 6px; color: var(--color-brand-sage);">
            <span>Free Shipping Unlocked!</span>
            <span>100% Achieved</span>
          </div>
          <div style="height: 6px; background: var(--color-border); border-radius: var(--border-radius-full); overflow: hidden;">
            <div style="height: 100%; background: var(--color-brand-sage); width: 100%;"></div>
          </div>
        `;
      } else {
        const diff = threshold - subtotal;
        const pct = (subtotal / threshold) * 100;
        shippingTarget.innerHTML = `
          <div style="display:flex; justify-content:space-between; font-size: 0.8rem; font-weight:700; text-transform:uppercase; margin-bottom: 6px;">
            <span>Standard Shipping</span>
            <span>You're ₹${diff} away from Free Shipping</span>
          </div>
          <div style="height: 6px; background: var(--color-border); border-radius: var(--border-radius-full); overflow: hidden;">
            <div style="height: 100%; background: var(--color-brand-gold); width: ${pct}%;"></div>
          </div>
        `;
      }
    }
  }

  // Render items list
  if (state.cart.length === 0) {
    itemsTarget.innerHTML = `
      <div style="text-align: center; padding: var(--spacing-xl) 0;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; stroke-width: 1px; color: var(--color-text-muted); margin-bottom: var(--spacing-sm);"></i>
        <p style="font-family: var(--font-editorial); font-style: italic; font-size: 1.3rem; margin-bottom: var(--spacing-xs);">Your Shopping Bag is empty</p>
        <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: var(--spacing-md);">Add GOTS certified apparel crafted with positive scriptural reminders.</p>
        <a href="#shop" class="cta-button cta-button-primary nav-trigger" data-view="shop" style="padding: 10px 24px; font-size: 0.75rem;">Browse Collection</a>
      </div>
    `;
    if (rowsTarget) rowsTarget.innerHTML = "";
    if (totalValTarget) totalValTarget.textContent = "₹0.00";
    if (upsellTarget) upsellTarget.style.display = "none";
  } else {
    itemsTarget.innerHTML = state.cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return "";
      const itemTotal = product.price * item.qty;
      return `
        <div class="cart-page-item">
          <div class="cart-page-item-img">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="cart-page-item-info">
            <h4 class="cart-page-item-title">${product.title}</h4>
            <div class="cart-page-item-meta">
              <span>Size: ${item.size}</span>
              <span>Price: ₹${product.price}</span>
            </div>
            <div class="cart-page-item-qty">
              <button class="cart-page-item-qty-btn chg-page-qty" data-id="${product.id}" data-size="${item.size}" data-chg="-1"><i data-lucide="minus" style="width: 10px;"></i></button>
              <span class="cart-page-item-qty-val">${item.qty}</span>
              <button class="cart-page-item-qty-btn chg-page-qty" data-id="${product.id}" data-size="${item.size}" data-chg="1"><i data-lucide="plus" style="width: 10px;"></i></button>
            </div>
          </div>
          <div class="cart-page-item-actions">
            <span class="cart-page-item-price">₹${itemTotal}</span>
            <button class="cart-page-action-link page-remove-item" data-id="${product.id}" data-size="${item.size}">Remove</button>
            <button class="cart-page-action-link page-save-later" data-id="${product.id}" data-size="${item.size}">Save for Later</button>
            <button class="cart-page-action-link page-add-wishlist" data-id="${product.id}">Add to Wishlist</button>
          </div>
        </div>
      `;
    }).join("");

    // Summary pricing rows
    if (rowsTarget) {
      let rowsHtml = `
        <div class="summary-row" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--color-text-muted); margin-bottom:6px;"><span>Subtotal</span><span>₹${subtotal}</span></div>
        <div class="summary-row" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--color-text-muted); margin-bottom:6px;"><span>Estimated GST (12%)</span><span>₹${Math.round(subtotal * 0.12)}</span></div>
      `;
      if (state.currentCoupon > 0) {
        rowsHtml += `
          <div class="summary-row discount-row" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--color-brand-sage); font-weight:700; margin-bottom:6px;">
            <span>Coupon Applied (${state.currentCoupon}%)</span>
            <span>-₹${discountAmount}</span>
          </div>
        `;
      }
      rowsHtml += `
        <div class="summary-row" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--color-text-muted); margin-bottom:6px;">
          <span>Standard Shipping</span>
          <span>${shippingCost === 0 ? "Free" : "₹" + shippingCost}</span>
        </div>
      `;
      if (state.giftWrap) {
        rowsHtml += `<div class="summary-row" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--color-text-muted); margin-bottom:6px;"><span>Premium Gift Wrap</span><span>₹100</span></div>`;
      }
      rowsTarget.innerHTML = rowsHtml;
    }

    if (totalValTarget) {
      totalValTarget.textContent = `₹${grandTotal}`;
    }

    // Recommended upsell card list
    if (upsellTarget) {
      upsellTarget.style.display = "block";
      const notInCart = PRODUCTS.filter(p => !state.cart.some(item => item.id === p.id)).slice(0, 2);
      if (notInCart.length > 0) {
        const upsellItems = notInCart.map(prod => `
          <div style="display:flex; gap: var(--spacing-md); align-items:center; background: var(--color-white); border: 1px solid var(--color-border); padding:var(--spacing-sm); border-radius: var(--border-radius-sm);">
            <img src="${prod.image}" alt="${prod.title}" style="width: 50px; height: 60px; object-fit: cover; border-radius: var(--border-radius-sm);">
            <div style="flex-grow:1;">
              <h5 style="margin:0; font-size:0.82rem; font-weight:700;">${prod.title}</h5>
              <span style="font-size:0.72rem; color:var(--color-text-muted);">₹${prod.price}</span>
            </div>
            <button class="cta-button cta-button-primary page-upsell-add-btn" data-id="${prod.id}" style="padding: 6px 12px; font-size: 0.65rem; width: auto; margin:0;">Quick Add</button>
          </div>
        `).join("");

        upsellTarget.innerHTML = `
          <h3 class="cart-save-later-title" style="font-size: 1.15rem; margin-bottom: var(--spacing-sm);">Complete the Look</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--spacing-sm);">
            ${upsellItems}
          </div>
        `;

        upsellTarget.querySelectorAll(".page-upsell-add-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const prod = PRODUCTS.find(p => p.id === id);
            addToCart(id, prod.sizes[0], 1);
            showToast("Added matching item to your bag!");
            renderCartPage();
            renderCart();
          });
        });
      } else {
        upsellTarget.style.display = "none";
      }
    }
  }

  // Render Saved For Later products
  if (savedTarget) {
    if (state.savedForLater.length === 0) {
      savedTarget.style.display = "none";
    } else {
      savedTarget.style.display = "block";
      const savedList = state.savedForLater.map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return "";
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding: 12px 0;">
            <div style="display:flex; gap:var(--spacing-sm); align-items:center;">
              <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 60px; object-fit: cover; border-radius: var(--border-radius-sm); border:1px solid var(--color-border);">
              <div>
                <h5 style="margin:0; font-size:0.85rem; font-weight:700;">${product.title}</h5>
                <span style="font-size:0.75rem; color:var(--color-text-muted);">Size: ${item.size} • ₹${product.price}</span>
              </div>
            </div>
            <div style="display:flex; gap:12px; align-items:center;">
              <button class="cart-page-action-link saved-move-to-cart" data-id="${item.id}" data-size="${item.size}">Move to Bag</button>
              <button class="cart-page-action-link saved-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
            </div>
          </div>
        `;
      }).join("");

      savedTarget.innerHTML = `
        <h3 class="cart-save-later-title">Saved for Later</h3>
        <div style="border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: var(--spacing-sm) var(--spacing-md); background:var(--color-white);">
          ${savedList}
        </div>
      `;

      savedTarget.querySelectorAll(".saved-move-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const size = btn.getAttribute("data-size");
          addToCart(id, size, 1);
          state.savedForLater = state.savedForLater.filter(i => !(i.id === id && i.size === size));
          localStorage.setItem("ruven_saved_for_later", JSON.stringify(state.savedForLater));
          showToast("Moved item back to bag.");
          renderCartPage();
          renderCart();
        });
      });

      savedTarget.querySelectorAll(".saved-remove").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const size = btn.getAttribute("data-size");
          state.savedForLater = state.savedForLater.filter(i => !(i.id === id && i.size === size));
          localStorage.setItem("ruven_saved_for_later", JSON.stringify(state.savedForLater));
          showToast("Removed from saved list.");
          renderCartPage();
        });
      });
    }
  }

  // Setup Gift Wrap trigger
  if (giftCheck) {
    giftCheck.checked = state.giftWrap;
    const clone = giftCheck.cloneNode(true);
    giftCheck.parentNode.replaceChild(clone, giftCheck);
    clone.addEventListener("change", (e) => {
      state.giftWrap = e.target.checked;
      renderCartPage();
    });
  }

  // Setup Coupon trigger
  const couponBtn = document.getElementById("cart-coupon-btn");
  const couponInput = document.getElementById("cart-coupon-input");
  const couponMsg = document.getElementById("coupon-message");
  if (couponBtn && couponInput) {
    if (state.currentCoupon > 0) {
      couponInput.value = "FAITH10";
      couponInput.disabled = true;
      couponBtn.textContent = "Remove";
      if (couponMsg) {
        couponMsg.textContent = "Coupon FAITH10 applied successfully!";
        couponMsg.style.color = "var(--color-brand-sage)";
        couponMsg.style.display = "block";
      }
    } else {
      couponInput.value = "";
      couponInput.disabled = false;
      couponBtn.textContent = "Apply";
      if (couponMsg) couponMsg.style.display = "none";
    }

    const btnClone = couponBtn.cloneNode(true);
    couponBtn.parentNode.replaceChild(btnClone, couponBtn);
    btnClone.addEventListener("click", () => {
      if (state.currentCoupon > 0) {
        state.currentCoupon = 0;
        showToast("Coupon removed.");
        renderCartPage();
      } else {
        const val = couponInput.value.trim().toUpperCase();
        if (val === "FAITH10") {
          state.currentCoupon = 10;
          showToast("Coupon applied! 10% discount subtracted.");
          renderCartPage();
        } else if (val === "") {
          showToast("Please enter a coupon code.");
        } else {
          if (couponMsg) {
            couponMsg.textContent = "Invalid code. Try FAITH10.";
            couponMsg.style.color = "var(--color-brand-burgundy)";
            couponMsg.style.display = "block";
          }
        }
      }
    });
  }

  // Listeners for page quantity buttons
  itemsTarget.querySelectorAll(".chg-page-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const size = btn.getAttribute("data-size");
      const chg = parseInt(btn.getAttribute("data-chg"));
      updateCartQty(id, size, chg);
      renderCartPage();
    });
  });

  itemsTarget.querySelectorAll(".page-remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const size = btn.getAttribute("data-size");
      removeFromCart(id, size);
      showToast("Removed item from bag.");
      renderCartPage();
    });
  });

  itemsTarget.querySelectorAll(".page-save-later").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const size = btn.getAttribute("data-size");
      
      const exists = state.savedForLater.some(i => i.id === id && i.size === size);
      if (!exists) {
        state.savedForLater.push({ id, size });
        localStorage.setItem("ruven_saved_for_later", JSON.stringify(state.savedForLater));
      }
      
      removeFromCart(id, size);
      showToast("Saved item for later.");
      renderCartPage();
      renderCart();
    });
  });

  itemsTarget.querySelectorAll(".page-add-wishlist").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      toggleWishlist(id);
      showToast("Added item to wishlist.");
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// 2. CHECKOUT PAGE RENDERER
function renderCheckoutPage() {
  const shippingForm = document.getElementById("checkout-shipping-form");
  const paymentForm = document.getElementById("checkout-payment-form");
  const itemsTarget = document.getElementById("checkout-summary-items-target");
  const totalsTarget = document.getElementById("checkout-summary-totals-target");
  const paymentFields = document.getElementById("checkout-payment-fields");
  const shippingPanel = document.getElementById("checkout-step-shipping-panel");
  const paymentPanel = document.getElementById("checkout-step-payment-panel");

  const indicatorShipping = document.getElementById("step-indicator-shipping");
  const indicatorPayment = document.getElementById("step-indicator-payment");

  if (!itemsTarget) return;

  // Prefill default shipping address
  const defaultAddr = state.addresses.find(a => a.isDefault) || state.addresses[0];
  if (defaultAddr) {
    document.getElementById("chk-first-name").value = defaultAddr.firstName || "";
    document.getElementById("chk-last-name").value = defaultAddr.lastName || "";
    document.getElementById("chk-email").value = defaultAddr.email || "";
    document.getElementById("chk-phone").value = defaultAddr.phone || "";
    document.getElementById("chk-address").value = defaultAddr.address || "";
    document.getElementById("chk-city").value = defaultAddr.city || "";
    document.getElementById("chk-state").value = defaultAddr.state || "";
    document.getElementById("chk-zip").value = defaultAddr.zip || "";
  }

  // Pricing math
  let subtotal = 0;
  state.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) subtotal += product.price * item.qty;
  });

  const shippingMethod = document.querySelector('input[name="chk-shipping-method"]:checked')?.value || "standard";
  
  let shippingCost = 0;
  if (shippingMethod === "express") {
    shippingCost = 250;
  } else {
    shippingCost = subtotal >= 3000 ? 0 : 150;
  }

  const stdPriceLabel = document.getElementById("chk-shipping-standard-price");
  if (stdPriceLabel) {
    stdPriceLabel.textContent = subtotal >= 3000 ? "Free" : "₹150";
  }

  let discountAmount = Math.round(subtotal * (state.currentCoupon / 100));
  let giftWrapCost = state.giftWrap ? 100 : 0;
  let taxCost = Math.round((subtotal - discountAmount) * 0.12);
  let grandTotal = subtotal - discountAmount + shippingCost + giftWrapCost + taxCost;

  // Render items summary (Right Column)
  itemsTarget.innerHTML = state.cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return "";
    return `
      <div class="checkout-summary-item" style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
        <div class="checkout-summary-item-img" style="width:50px; height:60px; overflow:hidden; border-radius:4px; border:1px solid var(--color-border); flex-shrink:0;">
          <img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="checkout-summary-item-info" style="flex-grow:1;">
          <h5 style="margin:0; font-size:0.8rem; font-weight:700;">${product.title}</h5>
          <span style="font-size:0.72rem; color:var(--color-text-muted);">Size: ${item.size} • Qty: ${item.qty}</span>
        </div>
        <span style="font-size:0.82rem; font-weight:700; flex-shrink:0;">₹${product.price * item.qty}</span>
      </div>
    `;
  }).join("");

  // Render totals breakdown (Right Column)
  let totalsHtml = `
    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
      <span>Subtotal</span><span>₹${subtotal}</span>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
      <span>Estimated GST (12%)</span><span>₹${taxCost}</span>
    </div>
  `;
  if (state.currentCoupon > 0) {
    totalsHtml += `
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-brand-sage); font-weight:700; margin-bottom:6px;">
        <span>Coupon Discount (${state.currentCoupon}%)</span><span>-₹${discountAmount}</span>
      </div>
    `;
  }
  totalsHtml += `
    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
      <span>Shipping (${shippingMethod === "express" ? "Express" : "Standard"})</span>
      <span>${shippingCost === 0 ? "Free" : "₹" + shippingCost}</span>
    </div>
  `;
  if (state.giftWrap) {
    totalsHtml += `
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
        <span>Gift Wrapping Box</span><span>₹100</span>
      </div>
    `;
  }
  totalsHtml += `
    <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:700; border-top:1px solid var(--color-border); padding-top:8px; margin-top:8px;">
      <span>Grand Total</span><span>₹${grandTotal}</span>
    </div>
  `;
  totalsTarget.innerHTML = totalsHtml;

  const placeOrderBtn = document.getElementById("checkout-place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.textContent = `Pay & Place Order (₹${grandTotal})`;
  }

  // Payment field tabs builder
  const renderPaymentFields = () => {
    if (!paymentFields) return;
    if (activePaymentMethod === "card") {
      paymentFields.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div class="contact-form-group floating-group" style="position:relative; margin-bottom:4px;">
            <input type="text" id="chk-card-num" class="contact-input floating-input" placeholder=" " required minlength="16" maxlength="16" style="width:100%; padding:12px; border:1px solid var(--color-border); font-size:0.85rem; border-radius:var(--border-radius-sm);">
            <label for="chk-card-num" class="floating-label" style="position:absolute; left:12px; top:12px; font-size:0.85rem; color:var(--color-text-muted); transition:all 0.2s ease; pointer-events:none;">Card Number (16-Digit)</label>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="contact-form-group floating-group" style="position:relative; margin:0;">
              <input type="text" id="chk-card-expiry" class="contact-input floating-input" placeholder=" " required maxlength="5" style="width:100%; padding:12px; border:1px solid var(--color-border); font-size:0.85rem; border-radius:var(--border-radius-sm);">
              <label for="chk-card-expiry" class="floating-label" style="position:absolute; left:12px; top:12px; font-size:0.85rem; color:var(--color-text-muted); transition:all 0.2s ease; pointer-events:none;">Expiry (MM/YY)</label>
            </div>
            <div class="contact-form-group floating-group" style="position:relative; margin:0;">
              <input type="password" id="chk-card-cvv" class="contact-input floating-input" placeholder=" " required maxlength="3" style="width:100%; padding:12px; border:1px solid var(--color-border); font-size:0.85rem; border-radius:var(--border-radius-sm);">
              <label for="chk-card-cvv" class="floating-label" style="position:absolute; left:12px; top:12px; font-size:0.85rem; color:var(--color-text-muted); transition:all 0.2s ease; pointer-events:none;">CVV Code</label>
            </div>
          </div>
        </div>
      `;
    } else if (activePaymentMethod === "upi") {
      paymentFields.innerHTML = `
        <div class="contact-form-group floating-group" style="position:relative; margin:0;">
          <input type="text" id="chk-upi-vpa" class="contact-input floating-input" placeholder=" " required style="width:100%; padding:12px; border:1px solid var(--color-border); font-size:0.85rem; border-radius:var(--border-radius-sm);">
          <label for="chk-upi-vpa" class="floating-label" style="position:absolute; left:12px; top:12px; font-size:0.85rem; color:var(--color-text-muted); transition:all 0.2s ease; pointer-events:none;">UPI ID (e.g. user@okaxis)</label>
        </div>
      `;
    } else {
      paymentFields.innerHTML = `
        <div style="background:rgba(91,107,90,0.05); padding:12px; border-radius:4px; border:1px solid var(--color-border);">
          <p style="font-size:0.82rem; margin:0; line-height:1.4; color:var(--color-text-primary);">
            <strong>Cash on Delivery (COD) Selected.</strong> COD handling fee is completely waived as a blessing. Please keep exact cash ready upon delivery.
          </p>
        </div>
      `;
    }
  };

  renderPaymentFields();

  // Attach Shipping Method toggle
  document.querySelectorAll('input[name="chk-shipping-method"]').forEach(radio => {
    const clone = radio.cloneNode(true);
    radio.parentNode.replaceChild(clone, radio);
    clone.addEventListener("change", (e) => {
      document.querySelectorAll(".delivery-method-label").forEach(l => l.classList.remove("selected"));
      e.target.parentElement.classList.add("selected");
      renderCheckoutPage();
    });
  });

  // Shipping form handler
  if (shippingForm) {
    const cloneForm = shippingForm.cloneNode(true);
    shippingForm.parentNode.replaceChild(cloneForm, shippingForm);
    cloneForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      checkoutShippingDetails = {
        firstName: document.getElementById("chk-first-name").value,
        lastName: document.getElementById("chk-last-name").value,
        email: document.getElementById("chk-email").value,
        phone: document.getElementById("chk-phone").value,
        address: document.getElementById("chk-address").value,
        city: document.getElementById("chk-city").value,
        state: document.getElementById("chk-state").value,
        zip: document.getElementById("chk-zip").value
      };

      const exists = state.addresses.some(a => a.address === checkoutShippingDetails.address && a.zip === checkoutShippingDetails.zip);
      if (!exists) {
        state.addresses.push({ ...checkoutShippingDetails, isDefault: false });
        localStorage.setItem("ruven_addresses", JSON.stringify(state.addresses));
      }

      if (shippingPanel) shippingPanel.style.display = "none";
      if (paymentPanel) paymentPanel.style.display = "block";
      if (indicatorShipping) indicatorShipping.style.color = "var(--color-text-muted)";
      if (indicatorPayment) indicatorPayment.style.color = "var(--color-brand-burgundy)";
    });
  }

  // Payment tab triggers
  document.querySelectorAll(".payment-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".payment-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePaymentMethod = btn.getAttribute("data-pay");
      renderPaymentFields();
    });
  });

  // Back button trigger
  const backBtn = document.getElementById("checkout-back-to-shipping");
  if (backBtn) {
    const cloneBack = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(cloneBack, backBtn);
    cloneBack.addEventListener("click", () => {
      if (shippingPanel) shippingPanel.style.display = "block";
      if (paymentPanel) paymentPanel.style.display = "none";
      if (indicatorShipping) indicatorShipping.style.color = "var(--color-brand-burgundy)";
      if (indicatorPayment) indicatorPayment.style.color = "var(--color-text-muted)";
    });
  }

  // Place Order handler
  if (paymentForm) {
    const clonePay = paymentForm.cloneNode(true);
    paymentForm.parentNode.replaceChild(clonePay, paymentForm);
    clonePay.addEventListener("submit", (e) => {
      e.preventDefault();

      const orderId = "RV-2026-" + Math.floor(Math.random() * 90000 + 10000);
      const today = new Date().toISOString().split("T")[0];
      
      const newOrder = {
        id: orderId,
        date: today,
        status: "Ordered",
        items: [...state.cart],
        subtotal: subtotal,
        shipping: shippingCost,
        tax: taxCost,
        discount: discountAmount,
        total: grandTotal,
        address: { ...checkoutShippingDetails },
        tracking: [
          { status: "Ordered", date: today, time: "08:15 PM", log: "Order placed. Preparing hand packaging." },
          { status: "Packed", date: "Pending", time: "Pending", log: "Item awaiting custom inspection." },
          { status: "Shipped", date: "Pending", time: "Pending", log: "BlueDart courier booking awaiting package dispatch." }
        ]
      };

      state.orders.unshift(newOrder);
      localStorage.setItem("ruven_orders", JSON.stringify(state.orders));

      const pointsEarned = Math.round(grandTotal / 10);
      state.loyaltyPoints += pointsEarned;
      localStorage.setItem("ruven_loyalty_points", state.loyaltyPoints);

      state.cart = [];
      saveCartState();
      renderCart();
      state.currentCoupon = 0;
      state.giftWrap = false;

      state.currentOrderTrackingId = orderId;
      showToast(`Order placed successfully! Earned ${pointsEarned} loyalty points.`);
      
      window.location.hash = "#confirmation";
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

// 3. ORDER CONFIRMATION PAGE RENDERER
function renderConfirmationPage() {
  const order = state.orders[0] || MOCK_ORDERS[0];
  const orderNumEl = document.getElementById("confirm-order-number");
  const deliveryEl = document.getElementById("confirm-delivery-window");
  
  if (orderNumEl) orderNumEl.textContent = order.id;
  
  if (deliveryEl) {
    const d = new Date(order.date);
    const minD = new Date(d.setDate(d.getDate() + 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxD = new Date(d.setDate(d.getDate() + 2)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    deliveryEl.textContent = `${minD} - ${maxD}`;
  }

  const invoiceBtn = document.getElementById("confirm-invoice-btn");
  if (invoiceBtn) {
    const clone = invoiceBtn.cloneNode(true);
    invoiceBtn.parentNode.replaceChild(clone, invoiceBtn);
    clone.addEventListener("click", () => {
      showToast("Invoice downloaded to your device storage.");
    });
  }

  const trackBtn = document.getElementById("confirm-track-btn");
  if (trackBtn) {
    const clone = trackBtn.cloneNode(true);
    trackBtn.parentNode.replaceChild(clone, trackBtn);
    clone.addEventListener("click", () => {
      state.currentOrderTrackingId = order.id;
      window.location.hash = "#tracking";
    });
  }

  const copyBtn = document.getElementById("chk-copy-referral-btn");
  if (copyBtn) {
    const clone = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(clone, copyBtn);
    clone.addEventListener("click", () => {
      const code = document.getElementById("chk-referral-code").value;
      navigator.clipboard.writeText(code);
      showToast("Referral link copied! Share to earn credits.");
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

// 4. ORDER TRACKING PAGE RENDERER
function renderTrackingPage() {
  const summaryTarget = document.getElementById("tracking-summary-target");
  const timelineTarget = document.getElementById("tracking-timeline-target");
  
  const orderId = state.currentOrderTrackingId || (state.orders[0]?.id) || MOCK_ORDERS[0].id;
  const order = state.orders.find(o => o.id === orderId) || state.orders[0] || MOCK_ORDERS[0];

  if (!summaryTarget || !timelineTarget) return;

  summaryTarget.innerHTML = `
    <div style="background:var(--color-bg-warm); border:1.5px dashed var(--color-brand-gold); padding: var(--spacing-md); border-radius: var(--border-radius-md); text-align: left; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="margin:0; font-size:0.75rem; text-transform:uppercase; color:var(--color-text-muted);">Tracking Shipment</h4>
        <span style="font-size:1.15rem; font-weight:700; color:var(--color-brand-burgundy);">${order.id}</span>
      </div>
      <div style="text-align:right;">
        <span class="pdp-fit-label" style="background:var(--color-bg-card); color:var(--color-brand-sage); padding:4px 8px; border-radius:12px; font-weight:700; font-size:0.75rem;">${order.status}</span>
        <p style="font-size:0.7rem; color:var(--color-text-muted); margin:4px 0 0;">Updated June 22, 2026</p>
      </div>
    </div>
  `;

  const stages = [
    { label: "Ordered", icon: "clipboard", desc: "Order registered under God's protection." },
    { label: "Packed", icon: "box", desc: "Garment hand-inspected and custom packed." },
    { label: "Shipped", icon: "truck", desc: "Handed over to BlueDart courier services." },
    { label: "Out for Delivery", icon: "navigation", desc: "Out for delivery with courier agent." },
    { label: "Delivered", icon: "check-circle", desc: "Delivered with joy to recipient." }
  ];

  const statusIndexMap = { "Ordered": 0, "Packed": 1, "Shipped": 2, "Out for Delivery": 3, "Delivered": 4, "Return Requested": 2, "Exchange Pending": 2 };
  const currentActiveIdx = statusIndexMap[order.status] ?? 0;

  timelineTarget.innerHTML = stages.map((stg, idx) => {
    const isActive = idx <= currentActiveIdx ? "active" : "";
    const orderLog = order.tracking?.find(t => t.status === stg.label);
    const dateStr = orderLog ? orderLog.date : (idx <= currentActiveIdx ? "June 22, 2026" : "Awaiting dispatch");
    const timeStr = orderLog ? orderLog.time : (idx <= currentActiveIdx ? "08:15 PM" : "");
    const descStr = orderLog ? orderLog.log : stg.desc;

    return `
      <div class="tracking-timeline-item ${isActive}">
        <div class="tracking-dot">
          <i data-lucide="${stg.icon}" style="width: 16px; height: 16px;"></i>
        </div>
        <div class="tracking-content">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 class="tracking-status" style="font-size:0.9rem; font-weight:700; margin:2px 0;">${stg.label}</h4>
            <span class="tracking-time" style="font-size:0.72rem; color:var(--color-text-muted);">${dateStr} ${timeStr}</span>
          </div>
          <p class="tracking-log" style="font-size:0.78rem; color:var(--color-text-muted); margin:0;">${descStr}</p>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

// 5. CUSTOMER ACCOUNT DASHBOARD RENDERER
function renderLoginForm() {
  const container = document.getElementById("customer-login-view");
  if (!container) return;

  container.innerHTML = `
    <div class="account-login-card" style="max-width: 440px; margin: 60px auto; padding: 40px var(--spacing-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
      <div style="width: 50px; height: 50px; background: var(--color-brand-burgundy); color: var(--color-white); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-sm); font-family: var(--font-sans);">R</div>
      <h2 style="font-family: var(--font-editorial); font-style: italic; font-size: 1.8rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px;">Ruven Studio Account</h2>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 24px;">Sign in to access your profile settings, order history, and rewards.</p>
      
      <form id="front-login-form" style="display: flex; flex-direction: column; gap: var(--spacing-sm); text-align: left;">
        <div class="contact-form-group">
          <label style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; display: block;">Email Address</label>
          <input type="email" id="front-login-email" class="contact-input" required placeholder="customer@example.com" style="width: 100%; padding: 12px; border: 1px solid var(--color-border); background: var(--color-white); font-size: 0.85rem;">
        </div>
        
        <div id="front-password-group" style="display: none; margin-top: 8px;">
          <label style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; display: block;">Administrator Password</label>
          <input type="password" id="front-login-password" class="contact-input" placeholder="Enter admin password" style="width: 100%; padding: 12px; border: 1px solid var(--color-border); background: var(--color-white); font-size: 0.85rem;">
        </div>

        <div id="front-login-error" style="display: none; color: var(--color-brand-burgundy); font-size: 0.8rem; margin-top: 8px; font-weight: 700;"></div>

        <button type="submit" id="front-login-submit" class="cta-button cta-button-primary" style="padding: 14px; font-size: 0.8rem; font-weight: 700; width: 100%; text-transform: uppercase; margin-top: 12px; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none;">
          Continue
        </button>
      </form>

      <div style="margin-top: 24px; border-top: 1px solid var(--color-border); padding-top: 20px;">
        <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 8px;">
          Ruven Studio Staff or Administrator?
        </p>
        <a href="/admin/index.html" class="cta-button nav-trigger" style="display: inline-block; padding: 10px 20px; font-size: 0.75rem; border: 1px solid var(--color-brand-burgundy); color: var(--color-brand-burgundy); background: none; font-weight: 700; text-transform: uppercase; text-decoration: none;">
          Go to Admin Portal →
        </a>
      </div>
    </div>
  `;

  const form = document.getElementById("front-login-form");
  const emailInput = document.getElementById("front-login-email");
  const passwordInput = document.getElementById("front-login-password");
  const passwordGroup = document.getElementById("front-password-group");
  const submitBtn = document.getElementById("front-login-submit");
  const errorBox = document.getElementById("front-login-error");

  if (!form || !emailInput || !passwordInput || !passwordGroup || !submitBtn || !errorBox) return;

  const updateFormState = () => {
    const email = emailInput.value.trim().toLowerCase();
    const isAdmin = ["samuel@ruvenstudio.in", "admin@ruvenstudio.com", "admin@ruvenstudio.in"].includes(email);
    if (isAdmin) {
      passwordGroup.style.display = "block";
      passwordInput.required = true;
      submitBtn.textContent = "Sign In as Admin";
    } else {
      passwordGroup.style.display = "none";
      passwordInput.required = false;
      submitBtn.textContent = "Continue";
    }
  };

  emailInput.addEventListener("input", updateFormState);
  emailInput.addEventListener("change", updateFormState);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorBox.style.display = "none";
    
    const email = emailInput.value.trim().toLowerCase();
    const isAdmin = ["samuel@ruvenstudio.in", "admin@ruvenstudio.com", "admin@ruvenstudio.in"].includes(email);

    if (isAdmin) {
      const password = passwordInput.value.trim();
      if (password === "Ruven@2026") {
        sessionStorage.setItem("rs_admin_auth", "true");
        sessionStorage.setItem("rs_admin_user", JSON.stringify({
          name: email.includes("samuel") ? "Samuel Ruven" : "Super Admin",
          email: email,
          role: "super-admin",
          initials: email.includes("samuel") ? "SR" : "SA"
        }));

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Opening Admin Portal...";
        
        showToast("Access granted. Opening Admin Portal...");
        setTimeout(() => {
          window.location.href = "/admin/index.html";
        }, 1000);
      } else {
        errorBox.textContent = "❌ Incorrect admin password. (Hint: Ruven@2026)";
        errorBox.style.display = "block";
      }
    } else {
      // Normal Customer login
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Signing in...";

      setTimeout(() => {
        state.customerIsLoggedIn = true;
        state.customerUser = {
          firstName: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          lastName: "Customer",
          email: email,
          phone: "+91 99999 99999"
        };
        sessionStorage.setItem("ruven_customer_logged_in", "true");
        sessionStorage.setItem("ruven_customer_user", JSON.stringify(state.customerUser));

        showToast("Signed in successfully.");
        renderAccountPage();
      }, 800);
    }
  });
}

function renderAccountPage() {
  const loginView = document.getElementById("customer-login-view");
  const dashboardView = document.getElementById("customer-dashboard-view");
  const panelTarget = document.getElementById("account-panels-target");
  const tabBtns = document.querySelectorAll(".account-nav-tab-btn");

  if (!panelTarget || !loginView || !dashboardView) return;

  if (!state.customerIsLoggedIn) {
    loginView.style.display = "block";
    dashboardView.style.display = "none";
    renderLoginForm();
    return;
  }

  loginView.style.display = "none";
  dashboardView.style.display = "grid";

  // Update user profile details in sidebar if user is set
  if (state.customerUser) {
    const avatarEl = document.getElementById("account-profile-avatar-char");
    const nameEl = document.getElementById("account-profile-display-name");
    const emailEl = document.getElementById("account-profile-display-email");
    if (avatarEl) avatarEl.textContent = state.customerUser.firstName.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = `${state.customerUser.firstName} ${state.customerUser.lastName}`;
    if (emailEl) emailEl.textContent = state.customerUser.email;
  }

  // Active state styling
  tabBtns.forEach(btn => {
    if (btn.getAttribute("data-tab") === activeAccountTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const renderActivePanel = () => {
    if (activeAccountTab === "profile") {
      panelTarget.innerHTML = `
        <div class="account-panel-card">
          <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin-bottom:var(--spacing-md); border-bottom:1px solid var(--color-border); padding-bottom:8px;">Profile Settings</h2>
          <form id="account-profile-form" style="display:flex; flex-direction:column; gap: var(--spacing-sm);">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--spacing-sm);">
              <div class="contact-form-group">
                <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">First Name</label>
                <input type="text" id="acc-first-name" class="contact-input" value="Samuel" required style="width:100%; padding:10px; border:1px solid var(--color-border); font-size:0.85rem;">
              </div>
              <div class="contact-form-group">
                <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Last Name</label>
                <input type="text" id="acc-last-name" class="contact-input" value="Ruven" required style="width:100%; padding:10px; border:1px solid var(--color-border); font-size:0.85rem;">
              </div>
            </div>
            <div class="contact-form-group">
              <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Email Address</label>
              <input type="email" id="acc-email" class="contact-input" value="samuel@ruvenstudio.in" required style="width:100%; padding:10px; border:1px solid var(--color-border); font-size:0.85rem;">
            </div>
            <div class="contact-form-group">
              <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">WhatsApp Number</label>
              <input type="text" id="acc-phone" class="contact-input" value="+91 99999 99999" required style="width:100%; padding:10px; border:1px solid var(--color-border); font-size:0.85rem;">
            </div>
            <button type="submit" class="cta-button cta-button-primary" style="padding:12px; font-size:0.8rem; width:max-content; margin-top:4px;">Save Settings</button>
          </form>
        </div>
      `;

      document.getElementById("account-profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = document.getElementById("acc-first-name").value;
        const l = document.getElementById("acc-last-name").value;
        const em = document.getElementById("acc-email").value;

        document.getElementById("account-profile-display-name").textContent = `${f} ${l}`;
        document.getElementById("account-profile-display-email").textContent = em;
        document.getElementById("account-profile-avatar-char").textContent = f.charAt(0);

        showToast("Profile settings saved successfully.");
      });

    } else if (activeAccountTab === "orders") {
      if (state.orders.length === 0) {
        panelTarget.innerHTML = `
          <div class="account-panel-card" style="text-align:center; padding: var(--spacing-xl) 0;">
            <i data-lucide="package" style="width:40px; height:40px; color:var(--color-text-muted); margin-bottom:var(--spacing-xs);"></i>
            <h3 style="font-family:var(--font-editorial); font-style:italic; font-size:1.3rem; margin-bottom:4px;">No purchases logged yet</h3>
            <p style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:var(--spacing-md);">Your orders will appear here once placed.</p>
            <a href="#shop" class="cta-button cta-button-primary nav-trigger" data-view="shop" style="padding: 10px 24px; font-size:0.75rem;">Browse Shop</a>
          </div>
        `;
      } else {
        const ordersHtml = state.orders.map(order => {
          const itemsListHtml = order.items.map(item => {
            const product = PRODUCTS.find(p => p.id === item.id);
            if (!product) return "";
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding:8px 0;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <img src="${product.image}" alt="${product.title}" style="width:40px; height:48px; object-fit:cover; border-radius:3px; border:1px solid var(--color-border);">
                  <div>
                    <h5 style="margin:0; font-size:0.8rem; font-weight:700;">${product.title}</h5>
                    <span style="font-size:0.7rem; color:var(--color-text-muted);">Size: ${item.size} • Qty: ${item.qty}</span>
                  </div>
                </div>
                <span style="font-size:0.8rem; font-weight:700;">₹${product.price * item.qty}</span>
              </div>
            `;
          }).join("");

          return `
            <div style="border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: var(--spacing-md); background:var(--color-white); margin-bottom:var(--spacing-sm); box-shadow:var(--shadow-subtle);">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:8px; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                <div>
                  <h4 style="margin:0; font-size:0.85rem; font-weight:700; color:var(--color-brand-burgundy);">${order.id}</h4>
                  <span style="font-size:0.7rem; color:var(--color-text-muted);">Placed on ${order.date}</span>
                </div>
                <div style="text-align:right;">
                  <span class="pdp-fit-label" style="background:var(--color-bg-card); color:var(--color-brand-sage); padding:3px 10px; border-radius:12px; font-weight:700; font-size:0.7rem;">${order.status}</span>
                  <p style="font-size:0.8rem; font-weight:700; margin:4px 0 0;">Total: ₹${order.total}</p>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">
                ${itemsListHtml}
              </div>
              <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--color-border); padding-top:8px;">
                <button class="cta-button chk-track-order-btn" data-id="${order.id}" style="padding:6px 12px; font-size:0.7rem; background:none; border:1px solid var(--color-border); width:auto; color:var(--color-text-primary);"><i data-lucide="map-pin" style="width:12px; vertical-align:middle; margin-right:3px;"></i> Track Delivery</button>
                <button class="cta-button cta-button-primary chk-reorder-btn" data-idx="${order.id}" style="padding:6px 12px; font-size:0.7rem; width:auto; margin:0;"><i data-lucide="refresh-cw" style="width:12px; vertical-align:middle; margin-right:3px;"></i> Reorder Items</button>
              </div>
            </div>
          `;
        }).join("");

        panelTarget.innerHTML = `
          <div class="account-panel-card">
            <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin-bottom:var(--spacing-md); border-bottom:1px solid var(--color-border); padding-bottom:8px;">Order History</h2>
            ${ordersHtml}
          </div>
        `;

        panelTarget.querySelectorAll(".chk-track-order-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            state.currentOrderTrackingId = btn.getAttribute("data-id");
            window.location.hash = "#tracking";
          });
        });

        panelTarget.querySelectorAll(".chk-reorder-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const orderId = btn.getAttribute("data-idx");
            const orderObj = state.orders.find(o => o.id === orderId);
            if (orderObj) {
              orderObj.items.forEach(item => {
                addToCart(item.id, item.size, item.qty);
              });
              showToast("Cloned items into your studio bag!");
              openDrawer("cart");
            }
          });
        });
      }

    } else if (activeAccountTab === "wishlist") {
      if (state.wishlist.length === 0) {
        panelTarget.innerHTML = `
          <div class="account-panel-card" style="text-align:center; padding: var(--spacing-xl) 0;">
            <i data-lucide="heart" style="width:40px; height:40px; color:var(--color-text-muted); margin-bottom:var(--spacing-xs);"></i>
            <h3 style="font-family:var(--font-editorial); font-style:italic; font-size:1.3rem; margin-bottom:4px;">Wishlist is empty</h3>
            <p style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:var(--spacing-md);">Browse GOTS products to add to your wishlist.</p>
            <a href="#shop" class="cta-button cta-button-primary nav-trigger" data-view="shop" style="padding: 10px 24px; font-size:0.75rem;">Explore Drops</a>
          </div>
        `;
      } else {
        const itemsHtml = state.wishlist.map(pid => {
          const product = PRODUCTS.find(p => p.id === pid);
          if (!product) return "";
          return `
            <div style="border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); padding:var(--spacing-sm); display:flex; gap:12px; align-items:center; background:var(--color-white);">
              <img src="${product.image}" alt="${product.title}" style="width:60px; height:70px; object-fit:cover; border-radius:var(--border-radius-sm); border:1px solid var(--color-border); flex-shrink:0;">
              <div style="flex-grow:1;">
                <h4 style="margin:0; font-size:0.88rem; font-weight:700;">${product.title}</h4>
                <p style="font-size:0.75rem; color:var(--color-text-muted); margin:2px 0 4px;">₹${product.price}</p>
                <div style="display:flex; gap:8px; align-items:center;">
                  <button class="cta-button cta-button-primary acc-wish-move-btn" data-id="${product.id}" style="padding:4px 10px; font-size:0.65rem; width:auto; margin:0; border-radius:12px;">Move to Bag</button>
                  <button class="cart-page-action-link acc-wish-remove-btn" data-id="${product.id}">Remove</button>
                </div>
              </div>
            </div>
          `;
        }).join("");

        panelTarget.innerHTML = `
          <div class="account-panel-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:8px; margin-bottom:var(--spacing-md);">
              <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin:0;">Wishlist Manager</h2>
              <button id="acc-wishlist-share" class="cart-page-action-link" style="font-weight:700;"><i data-lucide="share" style="width:12px; vertical-align:middle; margin-right:3px;"></i> Share List</button>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--spacing-sm); margin-bottom:var(--spacing-md);">
              ${itemsHtml}
            </div>

            <div style="background:var(--color-bg-warm); border:1px solid var(--color-border); border-radius:var(--border-radius-md); padding:var(--spacing-sm) var(--spacing-md); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h5 style="margin:0; font-size:0.85rem; font-weight:700;">Alert Notifications</h5>
                <p style="font-size:0.72rem; color:var(--color-text-muted); margin:2px 0 0;">Notify me via email/WhatsApp on back-in-stock drops and price drops.</p>
              </div>
              <label style="position:relative; display:inline-block; width:44px; height:22px; cursor:pointer;">
                <input type="checkbox" checked style="opacity:0; width:0; height:0;">
                <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--color-brand-sage); transition:.4s; border-radius:34px;"></span>
              </label>
            </div>
          </div>
        `;

        document.getElementById("acc-wishlist-share").addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.origin + "#shop");
          showToast("Wishlist sharing link copied to clipboard!");
        });

        panelTarget.querySelectorAll(".acc-wish-move-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const prod = PRODUCTS.find(p => p.id === id);
            addToCart(id, prod.sizes[0], 1);
            toggleWishlist(id);
            showToast("Moved wishlist item to bag.");
            renderAccountPage();
            renderCart();
          });
        });

        panelTarget.querySelectorAll(".acc-wish-remove-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            toggleWishlist(id);
            showToast("Removed wishlist item.");
            renderAccountPage();
          });
        });
      }

    } else if (activeAccountTab === "addresses") {
      const addressesHtml = state.addresses.map((addr, index) => `
        <div style="border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); padding: var(--spacing-sm) var(--spacing-md); background:var(--color-white); position:relative; margin-bottom:var(--spacing-xs);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="font-size:0.85rem;">${addr.firstName} ${addr.lastName}</strong>
            ${addr.isDefault ? `<span style="font-size:0.65rem; color:var(--color-brand-sage); font-weight:700; text-transform:uppercase; border:1px solid var(--color-brand-sage); padding:2px 6px; border-radius:8px;">Default</span>` : ""}
          </div>
          <p style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.4; margin:0;">
            ${addr.address}, ${addr.city}, ${addr.state} - ${addr.zip}<br>
            Phone: ${addr.phone}
          </p>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px; border-top:1px solid var(--color-border); padding-top:6px;">
            ${!addr.isDefault ? `<button class="cart-page-action-link addr-set-def" data-idx="${index}">Set Default</button>` : ""}
            <button class="cart-page-action-link addr-del" data-idx="${index}" style="color:var(--color-brand-burgundy);">Delete Address</button>
          </div>
        </div>
      `).join("");

      panelTarget.innerHTML = `
        <div class="account-panel-card">
          <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin-bottom:var(--spacing-md); border-bottom:1px solid var(--color-border); padding-bottom:8px;">Saved Address Register</h2>
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:var(--spacing-md);">
            ${addressesHtml}
          </div>
          
          <h3 style="font-family:var(--font-editorial); font-size:1.15rem; font-weight:700; margin-bottom:var(--spacing-xs);">Add New Address</h3>
          <form id="account-add-address-form" style="display:flex; flex-direction:column; gap:8px; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); padding: var(--spacing-sm); background: var(--color-bg-warm);">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input type="text" id="add-addr-fn" class="contact-input" placeholder="First Name" required style="padding:8px;">
              <input type="text" id="add-addr-ln" class="contact-input" placeholder="Last Name" required style="padding:8px;">
            </div>
            <input type="text" id="add-addr-street" class="contact-input" placeholder="Street Address" required style="padding:8px;">
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
              <input type="text" id="add-addr-city" class="contact-input" placeholder="City" required style="padding:8px;">
              <input type="text" id="add-addr-state" class="contact-input" placeholder="State" required style="padding:8px;">
              <input type="text" id="add-addr-zip" class="contact-input" placeholder="PIN Code" required style="padding:8px;">
            </div>
            <input type="tel" id="add-addr-phone" class="contact-input" placeholder="WhatsApp / Phone" required style="padding:8px;">
            <button type="submit" class="cta-button cta-button-primary" style="padding:10px; font-size:0.75rem; width:max-content; margin-top:4px;">Add Address Record</button>
          </form>
        </div>
      `;

      panelTarget.querySelectorAll(".addr-set-def").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          state.addresses.forEach((a, i) => a.isDefault = i === idx);
          localStorage.setItem("ruven_addresses", JSON.stringify(state.addresses));
          showToast("Default address updated.");
          renderAccountPage();
        });
      });

      panelTarget.querySelectorAll(".addr-del").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          state.addresses.splice(idx, 1);
          localStorage.setItem("ruven_addresses", JSON.stringify(state.addresses));
          showToast("Address record removed.");
          renderAccountPage();
        });
      });

      document.getElementById("account-add-address-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const newAddr = {
          firstName: document.getElementById("add-addr-fn").value,
          lastName: document.getElementById("add-addr-ln").value,
          address: document.getElementById("add-addr-street").value,
          city: document.getElementById("add-addr-city").value,
          state: document.getElementById("add-addr-state").value,
          zip: document.getElementById("add-addr-zip").value,
          phone: document.getElementById("add-addr-phone").value,
          email: "samuel@ruvenstudio.in",
          isDefault: state.addresses.length === 0
        };

        state.addresses.push(newAddr);
        localStorage.setItem("ruven_addresses", JSON.stringify(state.addresses));
        showToast("New address added successfully.");
        renderAccountPage();
      });

    } else if (activeAccountTab === "returns") {
      const deliveredOrders = state.orders.filter(o => o.status === "Delivered");
      
      if (deliveredOrders.length === 0) {
        panelTarget.innerHTML = `
          <div class="account-panel-card" style="text-align:center; padding: var(--spacing-xl) 0;">
            <i data-lucide="refresh-cw" style="width:40px; height:40px; color:var(--color-text-muted); margin-bottom:var(--spacing-xs);"></i>
            <h3 style="font-family:var(--font-editorial); font-style:italic; font-size:1.3rem; margin-bottom:4px;">No returnable purchases</h3>
            <p style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:var(--spacing-md);">Only orders with status "Delivered" can be returned or exchanged within 7 days.</p>
            <a href="#shop" class="cta-button cta-button-primary nav-trigger" data-view="shop" style="padding: 10px 24px; font-size:0.75rem;">Browse Shop</a>
          </div>
        `;
      } else {
        const optionsHtml = deliveredOrders.map(o => `<option value="${o.id}">${o.id} - Total: ₹${o.total}</option>`).join("");
        
        panelTarget.innerHTML = `
          <div class="account-panel-card">
            <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin-bottom:var(--spacing-md); border-bottom:1px solid var(--color-border); padding-bottom:8px;">Returns & Exchanges Center</h2>
            <form id="account-returns-form" style="display:flex; flex-direction:column; gap: var(--spacing-sm);">
              <div class="contact-form-group">
                <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Select Order</label>
                <select id="ret-order-select" class="contact-input" style="padding:10px; width:100%; border:1px solid var(--color-border);">
                  <option value="" disabled selected>Select an Order</option>
                  ${optionsHtml}
                </select>
              </div>
              <div id="ret-items-target" style="display:flex; flex-direction:column; gap:4px; margin-bottom:4px;">
                <!-- Dynamically filled -->
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--spacing-sm);">
                <div class="contact-form-group">
                  <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Request Type</label>
                  <select id="ret-type-select" class="contact-input" style="padding:10px; width:100%; border:1px solid var(--color-border);">
                    <option value="exchange">Exchange for different size</option>
                    <option value="return">Return for full refund</option>
                  </select>
                </div>
                <div class="contact-form-group">
                  <label style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Reason for Request</label>
                  <select id="ret-reason-select" class="contact-input" style="padding:10px; width:100%; border:1px solid var(--color-border);">
                    <option value="sizing">Size didn't fit (Too small/large)</option>
                    <option value="quality">Fabric or stitch defect</option>
                    <option value="expectation">Did not meet expectations</option>
                    <option value="change">Changed mind</option>
                  </select>
                </div>
              </div>
              <button type="submit" id="ret-submit-btn" class="cta-button cta-button-primary" style="padding:12px; font-size:0.8rem; width:100%; margin-top:4px;" disabled>Submit Request</button>
            </form>
          </div>
        `;

        const selectEl = document.getElementById("ret-order-select");
        const itemsTarget = document.getElementById("ret-items-target");
        const submitBtn = document.getElementById("ret-submit-btn");

        selectEl.addEventListener("change", () => {
          const ordId = selectEl.value;
          const order = state.orders.find(o => o.id === ordId);
          if (order) {
            itemsTarget.innerHTML = `
              <label style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted); margin-bottom:4px; display:block;">Select Item</label>
              ${order.items.map((item, index) => {
                const prod = PRODUCTS.find(p => p.id === item.id);
                if (!prod) return "";
                return `
                  <label style="display:flex; justify-content:space-between; align-items:center; border:1px solid var(--color-border); border-radius:var(--border-radius-sm); padding:var(--spacing-sm); background:var(--color-bg-warm); cursor:pointer;">
                    <div style="display:flex; gap:10px; align-items:center;">
                      <input type="radio" name="ret-item-radio" value="${prod.id}" checked style="cursor:pointer;">
                      <img src="${prod.image}" alt="${prod.title}" style="width:30px; height:36px; object-fit:cover; border-radius:2px; flex-shrink:0;">
                      <span style="font-size:0.8rem; font-weight:700;">${prod.title} (Size: ${item.size})</span>
                    </div>
                    <span style="font-size:0.8rem; font-weight:700; flex-shrink:0;">₹${prod.price}</span>
                  </label>
                `;
              }).join("")}
            `;
            submitBtn.disabled = false;
          }
        });

        document.getElementById("account-returns-form").addEventListener("submit", (e) => {
          e.preventDefault();
          const ordId = selectEl.value;
          const retType = document.getElementById("ret-type-select").value;
          const reason = document.getElementById("ret-reason-select").value;
          const itemId = document.querySelector('input[name="ret-item-radio"]:checked')?.value;
          
          const order = state.orders.find(o => o.id === ordId);
          if (order) {
            order.status = retType === "exchange" ? "Exchange Pending" : "Return Requested";
            order.tracking.push({
              status: order.status,
              date: "June 22, 2026",
              time: "08:30 PM",
              log: `Self-service return request submitted. Reason: ${reason}. Pickup scheduled in 48 hours.`
            });
            localStorage.setItem("ruven_orders", JSON.stringify(state.orders));
            showToast(`Request registered. Pick-up scheduled in 48 hours.`);
            renderAccountPage();
          }
        });
      }

    } else if (activeAccountTab === "loyalty") {
      const challenges = [
        { id: "scripture", title: "Share daily scripture prompt to WhatsApp status", points: 30, desc: "Promote faith conversation within your friend circles." },
        { id: "devotional", title: "Read weekly journal reflection devotional", points: 20, desc: "Spend five minutes in quiet devotion of the renew-your-mind series." },
        { id: "review", title: "Review your recent clothing purchase on the store", points: 50, desc: "Help fellow believers discover standard drapes." }
      ];

      const chalHtml = challenges.map(ch => {
        const isDone = userCompletedChallenges.includes(ch.id);
        return `
          <div style="background:var(--color-white); border:1px solid var(--color-border); border-radius:var(--border-radius-sm); padding:var(--spacing-sm) var(--spacing-md); display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-xs);">
            <div style="padding-right: var(--spacing-sm);">
              <h5 style="margin:0; font-size:0.82rem; font-weight:700;">${ch.title}</h5>
              <p style="font-size:0.72rem; color:var(--color-text-muted); margin:2px 0 0;">${ch.desc}</p>
            </div>
            <div>
              ${isDone 
                ? `<span style="font-size:0.72rem; color:var(--color-brand-sage); font-weight:700; text-transform:uppercase;"><i data-lucide="check-circle" style="width:14px; vertical-align:middle; margin-right:2px;"></i> Claimed</span>`
                : `<button class="cta-button cta-button-primary claim-points-btn" data-id="${ch.id}" data-pts="${ch.points}" style="padding:6px 12px; font-size:0.65rem; width:auto; margin:0; border-radius:12px;">+${ch.points} Pts</button>`
              }
            </div>
          </div>
        `;
      }).join("");

      panelTarget.innerHTML = `
        <div class="account-panel-card">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--color-border); padding-bottom:8px; margin-bottom:var(--spacing-md); flex-wrap:wrap; gap:8px;">
            <div>
              <h2 style="font-family:var(--font-editorial); font-size:1.5rem; font-weight:700; margin:0;">Ruven Circle Fellowship</h2>
              <p style="font-size:0.72rem; color:var(--color-text-muted); margin:2px 0 0;">Join the movement. Every order and challenge builds points that convert to checkout cash.</p>
            </div>
            <div style="text-align:center;">
              <span style="font-size:0.65rem; text-transform:uppercase; font-weight:700; color:var(--color-text-muted);">Points Balance</span>
              <div class="loyalty-points-circle" style="margin:4px 0 0; width:80px; height:80px;">
                <span class="loyalty-points-number" style="font-size:1.3rem;">${state.loyaltyPoints}</span>
                <span class="loyalty-points-label" style="font-size:0.5rem;">Points</span>
              </div>
            </div>
          </div>

          <h3 style="font-family:var(--font-editorial); font-size:1.2rem; font-weight:700; margin-bottom:var(--spacing-sm);">Milestone Badges</h3>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; text-align:center; margin-bottom:var(--spacing-md);">
            <div style="border:1px solid var(--color-border); padding:8px; border-radius: var(--border-radius-sm); background: var(--color-bg-warm);">
              <i data-lucide="sun" style="width:24px; color:var(--color-brand-gold); stroke-width:1.5px; margin: 0 auto 4px;"></i>
              <h5 style="margin:0; font-size:0.75rem; font-weight:700;">Seeker of Light</h5>
              <span style="font-size:0.65rem; color:var(--color-brand-sage); font-weight:700;">Unlocked</span>
            </div>
            <div style="border:1px solid ${state.loyaltyPoints >= 200 ? 'var(--color-border)' : 'dashed var(--color-border)'}; padding:8px; border-radius: var(--border-radius-sm); background: ${state.loyaltyPoints >= 200 ? 'var(--color-bg-warm)' : 'none'}; opacity: ${state.loyaltyPoints >= 200 ? '1' : '0.5'};">
              <i data-lucide="award" style="width:24px; color:var(--color-brand-gold); stroke-width:1.5px; margin: 0 auto 4px;"></i>
              <h5 style="margin:0; font-size:0.75rem; font-weight:700;">Ambassador</h5>
              <span style="font-size:0.65rem; color:${state.loyaltyPoints >= 200 ? 'var(--color-brand-sage)' : 'var(--color-text-muted)'}; font-weight:700;">${state.loyaltyPoints >= 200 ? 'Unlocked' : 'Need 200 pts'}</span>
            </div>
            <div style="border:1px dashed var(--color-border); padding:8px; border-radius: var(--border-radius-sm); opacity:0.5;">
              <i data-lucide="shield" style="width:24px; color:var(--color-text-muted); stroke-width:1.5px; margin: 0 auto 4px;"></i>
              <h5 style="margin:0; font-size:0.75rem; font-weight:700;">Faith Leader</h5>
              <span style="font-size:0.65rem; color:var(--color-text-muted); font-weight:700;">Need 500 pts</span>
            </div>
          </div>

          <h3 style="font-family:var(--font-editorial); font-size:1.2rem; font-weight:700; margin-bottom:var(--spacing-sm);">Daily Faith Challenges</h3>
          <div style="background:var(--color-bg-warm); padding:var(--spacing-sm); border-radius: var(--border-radius-md); border:1px solid var(--color-border);">
            ${chalHtml}
          </div>
        </div>
      `;

      panelTarget.querySelectorAll(".claim-points-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const cid = btn.getAttribute("data-id");
          const pts = parseInt(btn.getAttribute("data-pts"));
          state.loyaltyPoints += pts;
          localStorage.setItem("ruven_loyalty_points", state.loyaltyPoints);
          userCompletedChallenges.push(cid);
          showToast(`Challenge completed! Earned +${pts} points.`);
          renderAccountPage();
        });
      });
    }

    if (window.lucide) window.lucide.createIcons();
  };

  renderActivePanel();

  tabBtns.forEach(btn => {
    if (btn.id === "customer-logout-btn") return;
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener("click", () => {
      activeAccountTab = clone.getAttribute("data-tab");
      renderAccountPage();
    });
  });

  const logoutBtn = document.getElementById("customer-logout-btn");
  if (logoutBtn) {
    const clone = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(clone, logoutBtn);
    clone.addEventListener("click", () => {
      state.customerIsLoggedIn = false;
      state.customerUser = null;
      sessionStorage.removeItem("ruven_customer_logged_in");
      sessionStorage.removeItem("ruven_customer_user");
      showToast("Signed out successfully.");
      renderAccountPage();
    });
  }

  if (window.lucide) window.lucide.createIcons();
}
