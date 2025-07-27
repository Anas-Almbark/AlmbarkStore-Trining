class FormValidator {
  constructor() {
    this.validationRules = {
      title: {
        required: true,
        minLength: 3,
        message: "Product name must be at least 3 characters long",
      },
      price: {
        required: true,
        type: "number",
        min: 0.01,
        message: "Price must be greater than 0",
      },
      description: {
        required: true,
        minLength: 10,
        message: "Description must be at least 10 characters long",
      },
      category: {
        required: true,
        message: "Please select a category",
      },
      image: {
        required: true,
        type: "url",
        message: "Please provide a valid image URL",
      },
    };
  }

  validateForm(formData) {
    const errors = [];

    for (const [field, value] of formData.entries()) {
      const rule = this.validationRules[field];
      if (!rule) continue;

      const fieldErrors = this.validateField(field, value, rule);
      errors.push(...fieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  highlightErrors(form, errors) {
    this.clearAllErrors();
    errors.forEach((error) => {
      if (error.includes("Product name") || error.includes("title")) {
        this.showFieldError("title", error);
      } else if (error.includes("Price") || error.includes("price")) {
        this.showFieldError("price", error);
      } else if (
        error.includes("Description") ||
        error.includes("description")
      ) {
        this.showFieldError("description", error);
      } else if (error.includes("Category") || error.includes("category")) {
        this.showFieldError("category", error);
      } else if (error.includes("Image") || error.includes("image")) {
        this.showFieldError("image", error);
      }
    });
  }

  validateField(fieldName, value, rule) {
    const errors = [];
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors.push(`${this.getFieldDisplayName(fieldName)} is required`);
      return errors;
    }

    if (!value || value.toString().trim() === "") {
      return errors;
    }
    if (rule.type === "number") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        errors.push(
          `${this.getFieldDisplayName(fieldName)} must be a valid number`
        );
        return errors;
      }
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push(
          rule.message ||
            `${this.getFieldDisplayName(fieldName)} must be at least ${
              rule.min
            }`
        );
      }
    }
    if (rule.type === "url" && !this.isValidUrl(value)) {
      errors.push(
        rule.message ||
          `${this.getFieldDisplayName(fieldName)} must be a valid URL`
      );
    }
    if (rule.minLength && value.toString().trim().length < rule.minLength) {
      errors.push(
        rule.message ||
          `${this.getFieldDisplayName(fieldName)} must be at least ${
            rule.minLength
          } characters long`
      );
    }
    if (rule.maxLength && value.toString().trim().length > rule.maxLength) {
      errors.push(
        `${this.getFieldDisplayName(fieldName)} must be no more than ${
          rule.maxLength
        } characters long`
      );
    }

    return errors;
  }

  validateProductData(productData) {
    const errors = [];

    if (!productData.title || productData.title.trim().length < 3) {
      errors.push("Product name must be at least 3 characters long");
    }

    if (!productData.price || productData.price <= 0) {
      errors.push("Price must be greater than 0");
    }

    if (
      !productData.description ||
      productData.description.trim().length < 10
    ) {
      errors.push("Description must be at least 10 characters long");
    }

    if (!productData.category) {
      errors.push("Please select a category");
    }

    if (!productData.image) {
      errors.push("Please provide an image (upload or URL)");
    } else if (
      productData.image.startsWith("http") &&
      !this.isValidUrl(productData.image)
    ) {
      errors.push("Please provide a valid image URL");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  getFieldDisplayName(fieldName) {
    const displayNames = {
      title: "Product Name",
      price: "Price",
      description: "Description",
      category: "Category",
      image: "Image URL",
    };

    return displayNames[fieldName] || fieldName;
  }

  showFieldError(fieldName, message) {
    const field = document.getElementById(
      `product${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    );
    if (!field) return;

    field.classList.add(
      "border-red-500",
      "focus:border-red-500",
      "focus:ring-red-500"
    );
    field.classList.remove(
      "border-gray-300",
      "focus:border-blue-500",
      "focus:ring-blue-500"
    );

    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-red-500 text-sm mt-1";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);

    const removeError = () => {
      field.classList.remove(
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-500"
      );
      field.classList.add(
        "border-gray-300",
        "focus:border-blue-500",
        "focus:ring-blue-500"
      );
      const errorMsg = field.parentNode.querySelector(".error-message");
      if (errorMsg) errorMsg.remove();
      field.removeEventListener("input", removeError);
    };

    field.addEventListener("input", removeError);
  }

  clearAllErrors() {
    document.querySelectorAll(".border-red-500").forEach((field) => {
      field.classList.remove(
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-500"
      );
      field.classList.add(
        "border-gray-300",
        "focus:border-blue-500",
        "focus:ring-blue-500"
      );
    });

    document.querySelectorAll(".error-message").forEach((msg) => {
      msg.remove();
    });
  }
}

window.FormValidator = FormValidator;
