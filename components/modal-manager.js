class ModalManager {
  constructor() {
    this.addProductModal = document.getElementById("addProductModal");
    this.productDetailModal = document.getElementById("productDetailModal");
    this.modalContent = document.getElementById("modalContent");
    this.detailModalContent = document.getElementById("detailModalContent");
  }

  setupModalClickOutside(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.addEventListener("click", (e) => {
      if (e.target.id === modalId) {
        if (modalId === "addProductModal") {
          this.closeAddProductModal();
        } else if (modalId === "productDetailModal") {
          this.closeProductDetailModal();
        }
      }
    });
  }

  openModal(modalId, contentId) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);

    if (!modal || !content) return;

    modal.classList.remove("hidden");
    setTimeout(() => {
      content.classList.remove("scale-95", "opacity-0");
      content.classList.add("scale-100", "opacity-100");
    }, 10);
  }

  closeModal(modalId, contentId) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);

    if (!modal || !content) return;

    content.classList.remove("scale-100", "opacity-100");
    content.classList.add("scale-95", "opacity-0");

    setTimeout(() => {
      modal.classList.add("hidden");
      if (modalId === "addProductModal") {
        const form = document.getElementById("addProductForm");
        if (form) form.reset();
      }
    }, 300);
  }

  focusFirstInput(modalId) {
    if (modalId === "addProductModal") {
      setTimeout(() => {
        const firstInput = document.getElementById("productTitle");
        if (firstInput) firstInput.focus();
      }, 300);
    }
  }

  openAddProductModal() {
    this.openModal("addProductModal", "modalContent");
    this.focusFirstInput("addProductModal");
  }

  closeAddProductModal() {
    this.closeModal("addProductModal", "modalContent");
  }

  openProductDetailModal(product) {
    if (!this.productDetailModal || !this.detailModalContent) return;

    const renderer = new ProductRenderer();
    this.detailModalContent.innerHTML = renderer.renderProductDetail(product);

    this.openModal("productDetailModal", "detailModalContent");
  }

  closeProductDetailModal() {
    this.closeModal("productDetailModal", "detailModalContent");
  }

  showLoadingState(button) {
    if (!button) return;

    button.classList.add("loading");
    button.disabled = true;

    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';

    return () => {
      button.classList.remove("loading");
      button.disabled = false;
      button.innerHTML = originalText;
    };
  }
}

window.ModalManager = ModalManager;
