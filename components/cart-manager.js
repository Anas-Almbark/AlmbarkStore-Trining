class CartManager {
  constructor() {
    this.cart = this.loadCartFromStorage();
    this.isDropdownOpen = false;
    this.setupEventListeners();
  }

  createCartItemHTML(item) {
    // Love ES6
    return `
            <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200" data-item-id="${
              item.id
            }">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <img src="${item.image}" alt="${item.title}" 
                             class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                             onerror="this.src='https://via.placeholder.com/64x64?text=No+Image'">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-800 truncate">${
                          item.title
                        }</h4>
                        <p class="text-xs text-gray-500 capitalize">${
                          item.category
                        }</p>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-lg font-bold text-blue-600">$${(
                              item.price * item.quantity
                            ).toFixed(2)}</span>
                            <div class="flex items-center space-x-2">
                                <button class="quantity-btn decrease-btn w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200" 
                                        data-product-id="${
                                          item.id
                                        }" data-action="decrease">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="w-8 text-center font-medium">${
                                  item.quantity
                                }</span>
                                <button class="quantity-btn increase-btn w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200" 
                                        data-product-id="${
                                          item.id
                                        }" data-action="increase">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="remove-btn text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200" 
                            data-product-id="${item.id}">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    document.getElementById("cartBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleCartDropdown();
    });

    document.getElementById("clearCartBtn").addEventListener("click", () => {
      this.clearCart();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#cartBtn") && !e.target.closest("#cartDropdown")) {
        this.closeCartDropdown();
      }
    });

    document.getElementById("cartDropdown").addEventListener("click", (e) => {
      e.stopPropagation();
    });

    document.getElementById("cartItems").addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;
      const productId = parseInt(target.dataset.productId);

      if (target.classList.contains("remove-btn")) {
        this.removeFromCart(productId);
      } else if (target.classList.contains("quantity-btn")) {
        const action = target.dataset.action;
        const currentItem = this.cart.find((item) => item.id === productId);

        if (currentItem) {
          if (action === "increase") {
            this.updateQuantity(productId, currentItem.quantity + 1);
          } else if (action === "decrease") {
            this.updateQuantity(productId, currentItem.quantity - 1);
          }
        }
      }
    });
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
      });
    }
    this.saveCartToStorage();
    this.updateCartUI();
    this.animateCartIcon();
    return true;
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCartToStorage();
    this.updateCartUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
        this.updateCartUI();
      }
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.updateCartUI();
    if (window.notificationManager) {
      window.notificationManager.showInfo("Cart cleared successfully!");
    }
  }

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getCartItemCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }
  updateCartUI() {
    this.updateCartCount();
    this.renderCartItems();
    this.updateCartTotal();
    this.toggleCartFooter();
  }

  updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const count = this.getCartItemCount();
    cartCount.textContent = count;
    if (count > 0) {
      cartCount.classList.remove("scale-0");
      cartCount.classList.add("scale-100");
    } else {
      cartCount.classList.remove("scale-100");
      cartCount.classList.add("scale-0");
    }
  }
  renderCartItems() {
    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");

    if (this.cart.length === 0) {
      cartItems.innerHTML = "";
      cartEmpty.classList.remove("hidden");
    } else {
      cartEmpty.classList.add("hidden");
      cartItems.innerHTML = this.cart
        .map((item) => this.createCartItemHTML(item))
        .join("");
    }
  }

  updateCartTotal() {
    const cartTotal = document.getElementById("cartTotal");
    const total = this.getCartTotal();
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  toggleCartFooter() {
    const cartFooter = document.getElementById("cartFooter");
    if (this.cart.length > 0) {
      cartFooter.classList.remove("hidden");
    } else {
      cartFooter.classList.add("hidden");
    }
  }

  toggleCartDropdown() {
    const dropdown = document.getElementById("cartDropdown");
    if (this.isDropdownOpen) {
      this.closeCartDropdown();
    } else {
      this.openCartDropdown();
    }
  }

  openCartDropdown() {
    const dropdown = document.getElementById("cartDropdown");
    dropdown.classList.remove("opacity-0", "invisible", "translate-y-2");
    dropdown.classList.add("opacity-100", "visible", "translate-y-0");
    this.isDropdownOpen = true;
  }

  closeCartDropdown() {
    const dropdown = document.getElementById("cartDropdown");
    dropdown.classList.remove("opacity-100", "visible", "translate-y-0");
    dropdown.classList.add("opacity-0", "invisible", "translate-y-2");
    this.isDropdownOpen = false;
  }

  animateCartIcon() {
    const cartBtn = document.getElementById("cartBtn");
    const cartIcon = cartBtn.querySelector("i");
    cartIcon.classList.add("animate-cart-bounce");
    setTimeout(() => {
      cartIcon.classList.remove("animate-cart-bounce");
    }, 600);
  }

  saveCartToStorage() {
    try {
      localStorage.setItem("fakestore_cart", JSON.stringify(this.cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem("fakestore_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  }

  getCartData() {
    return {
      items: [...this.cart],
      total: this.getCartTotal(),
      itemCount: this.getCartItemCount(),
    };
  }

  init() {
    this.updateCartUI();
  }
}

window.CartManager = CartManager;
