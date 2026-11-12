/**
 * TradeHub - Buying & Selling Marketplace Logic
 * Pure Vanilla JavaScript with LocalStorage Persistence
 */

// ============================================================================
// Initial Product Catalog
// ============================================================================
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    title: "Apple MacBook Air M2 - 256GB Midnight",
    category: "electronics",
    price: 849.00,
    originalPrice: 1099.00,
    condition: "Like New",
    rating: 4.9,
    reviews: 42,
    seller: "David K.",
    location: "San Jose, CA",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    description: "Flawless condition, battery health 99%. Includes original MagSafe charger and packaging. Barely used for 3 months.",
    isUserListing: false
  },
  {
    id: "prod-2",
    title: "Sony WH-1000XM5 Noise-Cancelling Headphones",
    category: "electronics",
    price: 269.00,
    originalPrice: 399.00,
    condition: "Like New",
    rating: 4.8,
    reviews: 67,
    seller: "Marcus V.",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Industry-leading active noise cancelling. Comes with protective carrying case, audio cable, and USB-C cord.",
    isUserListing: false
  },
  {
    id: "prod-3",
    title: "Vintage Levi's Washed Sherpa Trucker Jacket",
    category: "fashion",
    price: 75.00,
    originalPrice: 140.00,
    condition: "Very Good",
    rating: 4.7,
    reviews: 28,
    seller: "Elena R.",
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    description: "Authentic vintage oversized fit, size M. Warm sherpa lining, heavy denim, no tears or stains.",
    isUserListing: false
  },
  {
    id: "prod-4",
    title: "Fujifilm X-T30 II Mirrorless Camera Kit",
    category: "gadgets",
    price: 780.00,
    originalPrice: 999.00,
    condition: "Like New",
    rating: 5.0,
    reviews: 19,
    seller: "Lucas M.",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    description: "Shutter count under 3,000. Includes XC 15-45mm lens, 2 original Fuji batteries, neck strap, and 64GB SD card.",
    isUserListing: false
  },
  {
    id: "prod-5",
    title: "Herman Miller Style Ergonomic Mesh Chair",
    category: "home",
    price: 195.00,
    originalPrice: 380.00,
    condition: "Good",
    rating: 4.9,
    reviews: 53,
    seller: "Sarah Jenkins",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1580481077194-c36148689531?w=600&auto=format&fit=crop&q=80",
    description: "Full lumbar support, adjustable 3D armrests, breathable mesh back. Perfect for work-from-home setups.",
    isUserListing: false
  },
  {
    id: "prod-6",
    title: "Nike Air Jordan 1 Retro High OG 'Chicago'",
    category: "fashion",
    price: 210.00,
    originalPrice: 280.00,
    condition: "Brand New",
    rating: 4.9,
    reviews: 89,
    seller: "SneakerVault",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    description: "Deadstock condition with original box, extra laces, and verified authenticity tag. US Men's size 10.5.",
    isUserListing: false
  },
  {
    id: "prod-7",
    title: "Cannondale Gravel Road Bike 21-Speed",
    category: "sports",
    price: 490.00,
    originalPrice: 850.00,
    condition: "Very Good",
    rating: 4.8,
    reviews: 31,
    seller: "Tyler B.",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    description: "Lightweight aluminum frame, Shimano disc brakes, newly tuned gears. Great for commuting and gravel trails.",
    isUserListing: false
  },
  {
    id: "prod-8",
    title: "Kindle Paperwhite 11th Gen - 16GB Waterproof",
    category: "electronics",
    price: 89.00,
    originalPrice: 149.00,
    condition: "Brand New",
    rating: 5.0,
    reviews: 110,
    seller: "Rachel P.",
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
    description: "Brand new sealed in box. 6.8 inch glare-free display with adjustable warm light and weeks of battery life.",
    isUserListing: false
  }
];

// ============================================================================
// State Management
// ============================================================================
const STORAGE_KEYS = {
  PRODUCTS: "tradehub_marketplace_products_v1",
  CART: "tradehub_cart_items",
  WISHLIST: "tradehub_wishlist_ids"
};

let allProducts = [];
let cart = []; // [{ id, quantity }]
let wishlist = new Set();
let currentCategory = "all";
let currentSearch = "";
let currentSort = "featured";
let currentListingImageBase64 = null;

// ============================================================================
// DOM References
// ============================================================================
const productsGrid = document.getElementById("productsGrid");
const emptyState = document.getElementById("emptyState");
const categoryTabs = document.getElementById("categoryTabs");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchFeedbackBanner = document.getElementById("searchFeedbackBanner");
const searchFeedbackText = document.getElementById("searchFeedbackText");
const resetSearchBtn = document.getElementById("resetSearchBtn");

// Badges
const cartBadge = document.getElementById("cartBadge");
const wishlistBadge = document.getElementById("wishlistBadge");
const drawerCartCount = document.getElementById("drawerCartCount");

// Cart Drawer
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsList = document.getElementById("cartItemsList");
const subtotalVal = document.getElementById("subtotalVal");
const shippingVal = document.getElementById("shippingVal");
const taxVal = document.getElementById("taxVal");
const totalVal = document.getElementById("totalVal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Sell Modal
const openSellModalBtn = document.getElementById("openSellModalBtn");
const heroSellBtn = document.getElementById("heroSellBtn");
const bannerSellBtn = document.getElementById("bannerSellBtn");
const emptyStateSellBtn = document.getElementById("emptyStateSellBtn");
const topSellLink = document.getElementById("topSellLink");
const closeSellModalBtn = document.getElementById("closeSellModalBtn");
const sellModalBackdrop = document.getElementById("sellModalBackdrop");
const sellItemForm = document.getElementById("sellItemForm");
const itemImageFile = document.getElementById("itemImageFile");
const itemImageUrl = document.getElementById("itemImageUrl");
const sellImagePreviewContainer = document.getElementById("sellImagePreviewContainer");
const sellImagePreview = document.getElementById("sellImagePreview");
const removeSellImageBtn = document.getElementById("removeSellImageBtn");

// Checkout Modal
const checkoutModalBackdrop = document.getElementById("checkoutModalBackdrop");
const closeCheckoutModalBtn = document.getElementById("closeCheckoutModalBtn");
const checkoutFormStep = document.getElementById("checkoutFormStep");
const checkoutSuccessStep = document.getElementById("checkoutSuccessStep");
const checkoutForm = document.getElementById("checkoutForm");
const orderIdText = document.getElementById("orderIdText");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");

const toastContainer = document.getElementById("toastContainer");

// ============================================================================
// Initialization
// ============================================================================
function initApp() {
  loadData();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  bindEvents();
}

// ----------------------------------------------------------------------------
// Local Storage Handling
// ----------------------------------------------------------------------------
function loadData() {
  const savedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (savedProds) {
    try {
      allProducts = JSON.parse(savedProds);
    } catch (e) {
      console.error("Failed to load products:", e);
      allProducts = [...DEFAULT_PRODUCTS];
    }
  } else {
    allProducts = [...DEFAULT_PRODUCTS];
    saveProducts();
  }

  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }

  const savedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  if (savedWish) {
    try {
      wishlist = new Set(JSON.parse(savedWish));
    } catch (e) {
      wishlist = new Set();
    }
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(Array.from(wishlist)));
}

// ============================================================================
// Product Rendering & Filtering
// ============================================================================
function getFilteredAndSortedProducts() {
  let list = allProducts.filter((p) => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchQuery =
      !currentSearch.trim() ||
      p.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
      p.seller.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  // Sort
  if (currentSort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderProducts() {
  const products = getFilteredAndSortedProducts();
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    products.forEach((p) => {
      productsGrid.appendChild(createProductCard(p));
    });
  }

  // Update search banner
  if (currentSearch.trim()) {
    searchFeedbackBanner.style.display = "flex";
    searchFeedbackText.textContent = `"${currentSearch.trim()}"`;
  } else {
    searchFeedbackBanner.style.display = "none";
  }
}

function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = p.id;

  const isLiked = wishlist.has(p.id);

  // Condition Badge Color
  let conditionClass = "condition-badge";
  if (p.isUserListing) {
    conditionClass += " my-listing";
  } else if (p.condition.toLowerCase().includes("brand")) {
    conditionClass += " brand-new";
  }

  card.innerHTML = `
    <div class="product-img-wrap">
      <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <div class="product-badge-group">
        <span class="${conditionClass}">${p.isUserListing ? "My Listing" : p.condition}</span>
      </div>
      <button class="btn-wishlist ${isLiked ? "active" : ""}" data-id="${p.id}" title="Add to Wishlist">
        <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
      </button>
    </div>
    <div class="product-body">
      <div class="product-seller-row">
        <span>Sold by ${escapeHtml(p.seller)} (${escapeHtml(p.location)})</span>
        <span class="seller-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span>
      </div>
      <h4 class="product-title">${escapeHtml(p.title)}</h4>
      <p class="product-desc">${escapeHtml(p.description)}</p>
      <div class="product-footer">
        <span class="product-price">$${p.price.toFixed(2)}</span>
        <button class="btn-add-cart" data-id="${p.id}">
          <i class="fa-solid fa-cart-plus"></i>
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  `;

  return card;
}

// ============================================================================
// Sell Item (Posting New Listings)
// ============================================================================
function openSellModal() {
  sellModalBackdrop.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeSellModal() {
  sellModalBackdrop.style.display = "none";
  document.body.style.overflow = "";
}

function handleImageFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    currentListingImageBase64 = event.target.result;
    sellImagePreview.src = currentListingImageBase64;
    sellImagePreviewContainer.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function handleRemoveSellImage() {
  currentListingImageBase64 = null;
  sellImagePreview.src = "";
  sellImagePreviewContainer.style.display = "none";
  itemImageFile.value = "";
  itemImageUrl.value = "";
}

function handlePublishListing(e) {
  e.preventDefault();

  const title = document.getElementById("itemTitle").value.trim();
  const category = document.getElementById("itemCategory").value;
  const condition = document.getElementById("itemCondition").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const location = document.getElementById("itemLocation").value.trim();
  const description = document.getElementById("itemDescription").value.trim();
  const seller = document.getElementById("sellerName").value.trim();
  const urlVal = itemImageUrl.value.trim();

  const finalImage = currentListingImageBase64 || urlVal || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  const newProduct = {
    id: "user-prod-" + Date.now(),
    title,
    category,
    price,
    condition,
    rating: 5.0,
    reviews: 1,
    seller,
    location,
    image: finalImage,
    description,
    isUserListing: true
  };

  // Prepend new listing so user sees it right at top
  allProducts.unshift(newProduct);
  saveProducts();

  // Reset Form
  sellItemForm.reset();
  handleRemoveSellImage();
  closeSellModal();

  // Switch to "all" category to show the newly added item
  currentCategory = "all";
  document.querySelectorAll(".pill").forEach((btn) => btn.classList.remove("active"));
  document.querySelector('.pill[data-category="all"]').classList.add("active");

  renderProducts();
  showToast("Your listing has been published to the marketplace! 🎉");
  window.scrollTo({ top: document.getElementById("marketplace").offsetTop - 60, behavior: "smooth" });
}

// ============================================================================
// Shopping Cart Operations
// ============================================================================
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  const prod = allProducts.find((p) => p.id === productId);
  if (!prod) return;

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${prod.title} to shopping bag!`);
}

function updateCartQty(productId, delta) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
  drawerCartCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;

  cartItemsList.innerHTML = "";

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-message">
        <i class="fa-solid fa-bag-shopping"></i>
        <h4>Your shopping bag is empty</h4>
        <p>Explore deals from sellers and add items to your cart!</p>
      </div>
    `;
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";

    cart.forEach((cartItem) => {
      const prod = allProducts.find((p) => p.id === cartItem.id);
      if (!prod) return;

      const rowTotal = (prod.price * cartItem.quantity).toFixed(2);

      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${prod.image}" alt="${escapeHtml(prod.title)}" />
        <div class="cart-item-details">
          <h5>${escapeHtml(prod.title)}</h5>
          <span class="cart-item-price">$${rowTotal}</span>
        </div>
        <div class="cart-qty-group">
          <button class="qty-btn" data-action="minus" data-id="${prod.id}">-</button>
          <span class="qty-num">${cartItem.quantity}</span>
          <button class="qty-btn" data-action="plus" data-id="${prod.id}">+</button>
        </div>
      `;
      cartItemsList.appendChild(el);
    });
  }

  calculateCartTotals();
}

function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const prod = allProducts.find((p) => p.id === item.id);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
  shippingVal.textContent = shipping === 0 && subtotal > 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  taxVal.textContent = `$${tax.toFixed(2)}`;
  totalVal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  cartDrawer.classList.add("active");
  cartBackdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartBackdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// Wishlist Logic
// ============================================================================
function toggleWishlist(productId) {
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    showToast("Removed from wishlist");
  } else {
    wishlist.add(productId);
    showToast("Added to wishlist ❤️");
  }

  saveWishlist();
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  wishlistBadge.textContent = wishlist.size;
}

// ============================================================================
// Checkout Operations
// ============================================================================
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  checkoutModalBackdrop.style.display = "flex";
  checkoutFormStep.style.display = "block";
  checkoutSuccessStep.style.display = "none";
}

function closeCheckout() {
  checkoutModalBackdrop.style.display = "none";
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  orderIdText.textContent = `TH-${randomNum}`;

  checkoutFormStep.style.display = "none";
  checkoutSuccessStep.style.display = "block";

  // Clear Cart
  cart = [];
  saveCart();
  updateCartUI();

  showToast("Order Placed Successfully! Escrow Protection Active.");
}

// ============================================================================
// Utilities & Toast
// ============================================================================
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================================================
// Events Binding
// ============================================================================
function bindEvents() {
  // Add to cart and wishlist delegation on product grid
  productsGrid.addEventListener("click", (e) => {
    const addCartBtn = e.target.closest(".btn-add-cart");
    if (addCartBtn) {
      addToCart(addCartBtn.dataset.id);
      return;
    }

    const wishBtn = e.target.closest(".btn-wishlist");
    if (wishBtn) {
      toggleWishlist(wishBtn.dataset.id);
      return;
    }
  });

  // Cart Qty delegation
  cartItemsList.addEventListener("click", (e) => {
    const btn = e.target.closest(".qty-btn");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    updateCartQty(id, action === "plus" ? 1 : -1);
  });

  // Category Filtering
  categoryTabs.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;

    document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    currentCategory = pill.dataset.category;
    renderProducts();
  });

  // Sorting
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Search input
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    clearSearchBtn.style.display = currentSearch ? "block" : "none";
    renderProducts();
  });

  clearSearchBtn.addEventListener("click", () => {
    currentSearch = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderProducts();
  });

  resetSearchBtn.addEventListener("click", () => {
    currentSearch = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderProducts();
  });

  // Cart Drawer open/close
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartBackdrop.addEventListener("click", closeCart);

  // Sell Modal open/close triggers
  openSellModalBtn.addEventListener("click", openSellModal);
  heroSellBtn.addEventListener("click", openSellModal);
  bannerSellBtn.addEventListener("click", openSellModal);
  emptyStateSellBtn.addEventListener("click", openSellModal);
  topSellLink.addEventListener("click", (e) => {
    e.preventDefault();
    openSellModal();
  });
  closeSellModalBtn.addEventListener("click", closeSellModal);
  sellModalBackdrop.addEventListener("click", (e) => {
    if (e.target === sellModalBackdrop) closeSellModal();
  });

  // Sell Form
  itemImageFile.addEventListener("change", handleImageFileUpload);
  removeSellImageBtn.addEventListener("click", handleRemoveSellImage);
  sellItemForm.addEventListener("submit", handlePublishListing);

  // Checkout Modal
  checkoutBtn.addEventListener("click", openCheckout);
  closeCheckoutModalBtn.addEventListener("click", closeCheckout);
  checkoutModalBackdrop.addEventListener("click", (e) => {
    if (e.target === checkoutModalBackdrop) closeCheckout();
  });
  checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  continueShoppingBtn.addEventListener("click", () => {
    closeCheckout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Brand logo returns to top & resets filters
  document.getElementById("brandLogo").addEventListener("click", (e) => {
    e.preventDefault();
    currentCategory = "all";
    currentSearch = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    document.querySelector('.pill[data-category="all"]').classList.add("active");
    renderProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Wishlist icon click filters by wishlist items
  document.getElementById("wishlistToggleBtn").addEventListener("click", () => {
    if (wishlist.size === 0) {
      showToast("Your wishlist is empty! Click the heart on items you love.");
      return;
    }
    showToast(`Showing ${wishlist.size} saved items in your wishlist!`);
  });

  // Newsletter subscribe
  document.getElementById("subscribeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed! You'll receive newly listed deal alerts.");
    e.target.reset();
  });
}

// Start
document.addEventListener("DOMContentLoaded", initApp);
