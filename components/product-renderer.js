class ProductRenderer {
  constructor() {
    this.productsGrid = document.getElementById("productsGrid");
    this.noResults = document.getElementById("noResults");
  }
  renderProducts(products, containerId = "productsGrid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    container.innerHTML = products
      .map((product) => this.createProductCard(product))
      .join("");

    this.addCardAnimations();
  }

  populateCategoryFilter(categories) {
    const categoryFilter = document.getElementById("categoryFilter");
    if (!categoryFilter) return;
    const allOption = categoryFilter.querySelector('option[value=""]');
    categoryFilter.innerHTML = "";
    if (allOption) {
      categoryFilter.appendChild(allOption);
    } else {
      categoryFilter.innerHTML = '<option value="">All Categories</option>';
    }

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = this.capitalizeWords(category);
      categoryFilter.appendChild(option);
    });
  }

  createProductCard(product) {
    return `
            <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group" 
                 onclick="app.openProductDetail(${product.id})" 
                 data-aos="fade-up">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         class="product-image w-full h-64 object-cover"
                         onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                    <div class="absolute top-4 left-4">
                        <span class="category-badge">${this.capitalizeWords(
                          product.category
                        )}</span>
                    </div>
                    <div class="absolute top-4 right-4">
                        <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
                            <div class="rating-stars">
                                ${this.renderStars(product.rating?.rate || 0)}
                                <span class="ml-1 text-xs text-gray-600">(${
                                  product.rating?.count || 0
                                })</span>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div class="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button class="bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200">
                                <i class="fas fa-eye mr-2"></i>View Details
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        ${product.title}
                    </h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                        ${product.description}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="price-badge">$${product.price}</span>
                        <button class="text-blue-600 hover:text-blue-800 transition-colors duration-200" 
                                onclick="event.stopPropagation(); app.addToCart(${
                                  product.id
                                })">
                            <i class="fas fa-shopping-cart mr-1"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let starsHtml = "";

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star star"></i>';
    }

    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt star"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star star empty"></i>';
    }

    return starsHtml;
  }

  renderProductDetail(product) {
    return `
            <div class="relative">
                <button onclick="app.closeProductDetailModal()" 
                        class="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    <div class="space-y-4">
                        <div class="relative overflow-hidden rounded-2xl bg-gray-100">
                            <img src="${product.image}" 
                                 alt="${product.title}" 
                                 class="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                                 onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            <div class="bg-gray-100 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-blue-600">$${
                                  product.price
                                }</div>
                                <div class="text-sm text-gray-600">Price</div>
                            </div>
                            <div class="bg-gray-100 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-green-600">${
                                  product.rating?.rate || 0
                                }</div>
                                <div class="text-sm text-gray-600">Rating</div>
                            </div>
                            <div class="bg-gray-100 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-purple-600">${
                                  product.rating?.count || 0
                                }</div>
                                <div class="text-sm text-gray-600">Reviews</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <span class="category-badge mb-4 inline-block">${this.capitalizeWords(
                              product.category
                            )}</span>
                            <h2 class="text-3xl font-bold text-gray-800 mb-4">${
                              product.title
                            }</h2>
                            <div class="flex items-center mb-4">
                                <div class="rating-stars mr-3">
                                    ${this.renderStars(
                                      product.rating?.rate || 0
                                    )}
                                </div>
                                <span class="text-gray-600">(${
                                  product.rating?.count || 0
                                } reviews)</span>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p class="text-gray-600 leading-relaxed">${
                              product.description
                            }</p>
                        </div>
                        
                        <div class="space-y-3">
                            <button onclick="app.addToCart(${product.id})" 
                                    class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <i class="fas fa-shopping-cart mr-2"></i>Add to Cart - $${
                                  product.price
                                }
                            </button>
                            <button onclick="app.addToWishlist(${product.id})" 
                                    class="w-full border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-3 rounded-xl font-semibold transition-all duration-300">
                                <i class="far fa-heart mr-2"></i>Add to Wishlist
                            </button>
                        </div>
                        
                        <div class="bg-gray-50 rounded-xl p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">Product Features</h4>
                            <ul class="space-y-1 text-sm text-gray-600">
                                <li><i class="fas fa-check text-green-500 mr-2"></i>Free shipping on orders over $50</li>
                                <li><i class="fas fa-check text-green-500 mr-2"></i>30-day return policy</li>
                                <li><i class="fas fa-check text-green-500 mr-2"></i>1-year warranty included</li>
                                <li><i class="fas fa-check text-green-500 mr-2"></i>24/7 customer support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  addCardAnimations() {
    const cards = this.productsGrid.querySelectorAll(".product-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("animate-fade-in");
    });
  }

  showNoResults() {
    if (this.productsGrid) {
      this.productsGrid.innerHTML = "";
    }
    if (this.noResults) {
      this.noResults.classList.remove("hidden");
    }
  }

  hideNoResults() {
    if (this.noResults) {
      this.noResults.classList.add("hidden");
    }
  }

  capitalizeWords(str) {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

window.ProductRenderer = ProductRenderer;
