class NotificationManager {
  constructor() {
    this.successToast = document.getElementById("successToast");
    this.toastMessage = document.getElementById("toastMessage");
  }

  showSuccess(message) {
    this.showSuccessToast(message);
  }

  showError(message) {
    this.showErrorToast(message);
  }

  showInfo(message) {
    this.showInfoToast(message);
  }

  showWarning(message) {
    this.showWarningToast(message);
  }

  showSuccessToast(message) {
    if (!this.successToast || !this.toastMessage) {
      console.log("Success:", message);
      return;
    }

    this.toastMessage.textContent = message;
    this.successToast.classList.remove("translate-x-full");
    this.successToast.classList.add("translate-x-0");

    setTimeout(() => {
      this.successToast.classList.remove("translate-x-0");
      this.successToast.classList.add("translate-x-full");
    }, 3000);
  }

  showErrorToast(message) {
    let errorToast = document.getElementById("errorToast");

    if (!errorToast) {
      errorToast = this.createErrorToast();
      document.body.appendChild(errorToast);
    }

    const messageElement = errorToast.querySelector(".toast-message");
    messageElement.textContent = message;

    errorToast.classList.remove("translate-x-full");
    errorToast.classList.add("translate-x-0");

    setTimeout(() => {
      errorToast.classList.remove("translate-x-0");
      errorToast.classList.add("translate-x-full");
    }, 4000);
  }

  createErrorToast() {
    const errorToast = document.createElement("div");
    errorToast.id = "errorToast";
    errorToast.className =
      "fixed top-16 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50";
    errorToast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span class="toast-message">Error message</span>
            </div>
        `;

    return errorToast;
  }

  showInfoToast(message) {
    const infoToast = document.createElement("div");
    infoToast.className =
      "fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50";
    infoToast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-info-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(infoToast);

    setTimeout(() => {
      infoToast.classList.remove("translate-x-full");
      infoToast.classList.add("translate-x-0");
    }, 10);

    setTimeout(() => {
      infoToast.classList.remove("translate-x-0");
      infoToast.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(infoToast)) {
          document.body.removeChild(infoToast);
        }
      }, 300);
    }, 3000);
  }

  showWarningToast(message) {
    const warningToast = document.createElement("div");
    warningToast.className =
      "fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50";
    warningToast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(warningToast);

    setTimeout(() => {
      warningToast.classList.remove("translate-x-full");
      warningToast.classList.add("translate-x-0");
    }, 10);

    setTimeout(() => {
      warningToast.classList.remove("translate-x-0");
      warningToast.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(warningToast)) {
          document.body.removeChild(warningToast);
        }
      }, 300);
    }, 3500);
  }

  showLoadingToast(message = "Loading...") {
    const loadingToast = document.createElement("div");
    loadingToast.id = "loadingToast";
    loadingToast.className =
      "fixed top-4 right-4 bg-gray-600 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50";
    loadingToast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(loadingToast);

    setTimeout(() => {
      loadingToast.classList.remove("translate-x-full");
      loadingToast.classList.add("translate-x-0");
    }, 10);

    return loadingToast;
  }

  hideLoadingToast() {
    const loadingToast = document.getElementById("loadingToast");
    if (loadingToast) {
      loadingToast.classList.remove("translate-x-0");
      loadingToast.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
      }, 300);
    }
  }

  showMultipleErrors(errors) {
    if (errors.length === 1) {
      this.showErrorToast(errors[0]);
      return;
    }

    const errorList = errors.map((error) => `• ${error}`).join("\n");
    this.showErrorToast(`Multiple errors:\n${errorList}`);
  }
}

window.NotificationManager = NotificationManager;
