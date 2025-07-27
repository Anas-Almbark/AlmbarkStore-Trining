class FakeStoreApp {
  constructor() {
    this.apiService = new ApiService();
    this.productRenderer = new ProductRenderer();
    this.modalManager = new ModalManager();
    this.filterManager = new FilterManager();
    this.formValidator = new FormValidator();
    this.notificationManager = new NotificationManager();

    this.products = [];
    this.filteredProducts = [];
    this.categories = [];

    this.init();
  }

  async init() {
    try {
      this.setupEventListeners();
      await this.loadInitialData();
      this.updateStats();
      window.cartManager.init();
      this.hideLoading();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.notificationManager.showError(
        "Failed to load application. Please refresh the page."
      );
    }
  }

  async loadInitialData() {
    try {
      const [products, categories] = await Promise.all([
        this.apiService.fetchProducts(),
        this.apiService.fetchCategories(),
      ]);

      this.products = products;
      this.categories = categories;
      this.filteredProducts = [...this.products];

      this.productRenderer.renderProducts(
        this.filteredProducts,
        "productsGrid"
      );
      this.productRenderer.populateCategoryFilter(this.categories);
    } catch (error) {
      console.error("Error loading initial data:", error);
      throw error;
    }
  }

  setupEventListeners() {
    document.getElementById("addProductBtn").addEventListener("click", () => {
      this.openAddProductModal();
    });

    document
      .getElementById("addProductForm")
      .addEventListener("submit", (e) => this.handleAddProduct(e));

    document.getElementById("closeModal").addEventListener("click", () => {
      this.closeAddProductModal();
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.closeAddProductModal();
    });

    this.setupImageUpload();

    document
      .getElementById("searchInput")
      .addEventListener("input", (e) => this.handleSearch(e.target.value));

    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) =>
        this.handleCategoryFilter(e.target.value)
      );
    document
      .getElementById("sortFilter")
      .addEventListener("change", (e) => this.handleSort(e.target.value));

    this.modalManager.setupModalClickOutside("addProductModal");
    this.modalManager.setupModalClickOutside("productDetailModal");

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.getElementById("searchInput").focus();
      }
      if (e.key === "Escape") {
        this.modalManager.closeModal("addProductModal", "modalContent");
        this.modalManager.closeModal(
          "productDetailModal",
          "detailModalContent"
        );
      }
    });
  }

  setupImageUpload() {
    const uploadBtn = document.getElementById("uploadImageBtn");
    const fileInput = document.getElementById("productImageFile");
    const imagePreview = document.getElementById("imagePreview");
    const previewImg = document.getElementById("previewImg");
    const removeBtn = document.getElementById("removeImageBtn");
    const uploadText = document.getElementById("uploadText");
    const urlInput = document.getElementById("productImage");

    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          this.notificationManager.showError(
            "Please select a valid image file"
          );
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          this.notificationManager.showError(
            "Image size should be less than 5MB"
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          imagePreview.classList.remove("hidden");
          uploadText.textContent = file.name;
          urlInput.value = "";
        };
        reader.readAsDataURL(file);
      }
    });

    removeBtn.addEventListener("click", () => {
      fileInput.value = "";
      imagePreview.classList.add("hidden");
      uploadText.textContent = "Click to upload image";
      previewImg.src = "";
    });

    urlInput.addEventListener("input", () => {
      if (urlInput.value) {
        fileInput.value = "";
        imagePreview.classList.add("hidden");
        uploadText.textContent = "Click to upload image";
      }
    });
  }

  handleSearch(searchTerm) {
    this.filterManager.setSearchTerm(searchTerm);
    this.applyFilters();
  }

  handleCategoryFilter(category) {
    this.filterManager.setCategoryFilter(category);
    this.applyFilters();
  }

  handleSort(sortType) {
    this.filterManager.setSortType(sortType);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.filterManager.applyFilters(this.products);
    this.productRenderer.renderProducts(this.filteredProducts, "productsGrid");
  }

  openAddProductModal() {
    this.modalManager.openModal("addProductModal", "modalContent");
    this.modalManager.focusFirstInput("addProductModal");
  }

  closeAddProductModal() {
    this.modalManager.closeModal("addProductModal", "modalContent");
  }

  openProductDetail(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById("detailModalContent");
    modalContent.innerHTML = this.productRenderer.renderProductDetail(product);

    this.modalManager.openModal("productDetailModal", "detailModalContent");
  }

  closeProductDetailModal() {
    this.modalManager.closeModal("productDetailModal", "detailModalContent");
  }

  async handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    let imageUrl = "";
    const fileInput = document.getElementById("productImageFile");
    const urlInput = document.getElementById("productImage");

    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      imageUrl = await this.convertFileToBase64(file);
    } else if (urlInput.value) {
      imageUrl = urlInput.value;
    } else {
      this.notificationManager.showError(
        "Please provide an image (upload or URL)"
      );
      return;
    }

    const productData = {
      title: formData.get("title"),
      price: parseFloat(formData.get("price")),
      description: formData.get("description"),
      image: imageUrl,
      category: formData.get("category"),
    };

    const validation = this.formValidator.validateProductData(productData);

    if (!validation.isValid) {
      this.formValidator.highlightErrors(e.target, validation.errors);
      this.notificationManager.showError(validation.errors.join("\n"));
      return;
    }

    try {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      this.setLoadingState(submitBtn, true);

      await this.apiService.addProduct(productData);

      const localProduct = {
        ...productData,
        id: Date.now(),
        rating: { rate: 0, count: 0 },
      };

      this.products.unshift(localProduct);
      this.applyFilters();
      this.updateStats();

      this.notificationManager.showSuccess("Product added successfully!");
      this.closeAddProductModal();
      this.resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      this.notificationManager.showError(
        "Failed to add product. Please try again."
      );
    } finally {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      this.setLoadingState(submitBtn, false);
    }
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  resetForm() {
    document.getElementById("addProductForm").reset();
    document.getElementById("imagePreview").classList.add("hidden");
    document.getElementById("uploadText").textContent = "Click to upload image";
    this.formValidator.clearAllErrors();
  }

  addToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      this.notificationManager.showError("Product not found!");
      return;
    }

    const success = window.cartManager.addToCart(product);
    if (success) {
      this.notificationManager.showSuccess(`${product.title} added to cart!`);
      this.animateButton(
        event.target,
        '<i class="fas fa-check mr-2"></i>Added!'
      );
    }
  }

  addToWishlist(productId) {
    this.notificationManager.showSuccess("Product added to wishlist!");

    const button = event.target;
    const icon = button.querySelector("i");
    icon.classList.remove("far");
    icon.classList.add("fas", "text-red-500");
    button.classList.add("text-red-500", "border-red-500");
  }

  updateStats() {
    document.getElementById("productCount").textContent = this.products.length;
    document.getElementById("categoryCount").textContent =
      this.categories.length;
  }

  hideLoading() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }
  }

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.disabled = true;
    } else {
      button.classList.remove("loading");
      button.disabled = false;
    }
  }

  animateButton(button, newText) {
    const originalText = button.innerHTML;
    button.innerHTML = newText;
    button.classList.add("success-animation");
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove("success-animation");
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.notificationManager = new NotificationManager();
  window.cartManager = new CartManager();
  window.app = new FakeStoreApp();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  let lastScrollTop = 0;
  const nav = document.querySelector("nav");

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector("section");
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
});
