class FilterManager {
  constructor(products = []) {
    this.allProducts = products;
    this.filteredProducts = [...products];
    this.currentFilter = "";
    this.currentSort = "default";
    this.searchTerm = "";
  }

  setSearchTerm(searchTerm) {
    this.searchTerm = searchTerm.toLowerCase();
  }

  setCategoryFilter(category) {
    this.currentFilter = category;
  }

  setSortType(sortType) {
    this.currentSort = sortType;
  }

  updateProducts(products) {
    this.allProducts = products;
    this.applyFilters();
  }

  handleSearch(searchTerm) {
    this.setSearchTerm(searchTerm);
    this.applyFilters();
  }

  handleCategoryFilter(category) {
    this.setCategoryFilter(category);
    this.applyFilters();
  }

  handleSort(sortType) {
    this.setSortType(sortType);
    this.applyFilters();
  }

  applyFilters(products = null) {
    let filtered = [...(products || this.allProducts)];
    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(this.searchTerm) ||
          product.description.toLowerCase().includes(this.searchTerm) ||
          product.category.toLowerCase().includes(this.searchTerm)
      );
    }
    if (this.currentFilter) {
      filtered = filtered.filter(
        (product) => product.category === this.currentFilter
      );
    }

    filtered = this.sortProducts(filtered, this.currentSort);
    this.filteredProducts = filtered;
    this.dispatchFilterEvent();
    return filtered;
  }

  sortProducts(products, sortType) {
    const sorted = [...products];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort(
          (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)
        );
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }

  populateCategoryFilter(categories) {
    const categoryFilter = document.getElementById("categoryFilter");
    if (!categoryFilter) return;
    while (categoryFilter.children.length > 1) {
      categoryFilter.removeChild(categoryFilter.lastChild);
    }

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = this.capitalizeWords(category);
      categoryFilter.appendChild(option);
    });
  }

  getFilteredProducts() {
    return this.filteredProducts;
  }

  dispatchFilterEvent() {
    const event = new CustomEvent("productsFiltered", {
      detail: { products: this.filteredProducts },
    });
    document.dispatchEvent(event);
  }

  capitalizeWords(str) {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  resetFilters() {
    this.currentFilter = "";
    this.currentSort = "default";
    this.searchTerm = "";

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (sortFilter) sortFilter.value = "default";
    this.applyFilters();
  }
}

window.FilterManager = FilterManager;
