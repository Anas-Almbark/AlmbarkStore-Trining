class ApiService {
  constructor() {
    this.baseUrl = "https://fakestoreapi.com";
  }

  async fetchProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) throw new Error("failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("error fetching products:", error);
      throw error;
    }
  }

  async fetchCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/products/categories`);
      if (!response.ok) throw new Error("failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("error fetching categories:", error);
      throw error;
    }
  }

  async addProduct(productData) {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("failed to add product");
      return await response.json();
    } catch (error) {
      console.error("error adding product:", error);
      throw error;
    }
  }

  async fetchProductById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) throw new Error("failed to fetch product");
      return await response.json();
    } catch (error) {
      console.error("error fetching product:", error);
      throw error;
    }
  }
}

window.ApiService = ApiService; // :)
