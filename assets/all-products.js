class AllProducts extends HTMLElement {
  index = 0;
  constructor() {
    super();
    this.showMoreButton = this.querySelector(".show-more-button");
    this.productsPerRow = this.dataset.productsPerRow;
    this.remainingProducts = this.dataset.remainingProducts.split(",");
    this.grid = this.querySelector(".grid");
    this.showMoreButton.addEventListener(
      "click",
      this.showMoreProducts.bind(this)
    );
  }

  async showMoreProducts() {
    this.showMoreButton.setAttribute("disabled", "true");
    const productsToShow = this.remainingProducts.slice(
      this.index,
      this.index + this.productsPerRow
    );
    const products = await Promise.all(
      productsToShow.map(async (productHandle) => {
        const response = await fetch(
          `/products/${productHandle}?sections=card-product`
        );
        const data = await response.json();
        return data["card-product"];
      })
    );

    products.forEach((product) => {
      this.grid.innerHTML += product;
    });

    this.index += this.productsPerRow;
    if (this.index >= this.remainingProducts.length) {
      this.showMoreButton.style.display = "none";
    } else {
      this.showMoreButton.removeAttribute("disabled");
    }
  }
}

customElements.define("all-products", AllProducts);
