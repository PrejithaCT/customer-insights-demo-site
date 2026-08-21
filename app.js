console.log("app.js loaded");

SalesforceInteractions.init({
    consents: [
        {
            provider: "Website",
            purpose: "Tracking",
            status: "OptIn"
        }
    ]
})
.then(() => {

    console.log("Salesforce SDK initialized");

    const buttons = document.querySelectorAll(".product-click");

    console.log("Product buttons found:", buttons.length);

    buttons.forEach((button) => {

        button.addEventListener("click", function () {

            console.log("🔥 CLICK DETECTED");

            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productCategory = this.dataset.productCategory;

            console.log("PRODUCT CLICKED:", {
                productId,
                productName,
                productCategory
            });

            SalesforceInteractions.sendEvent({

                interaction: {

                    name: SalesforceInteractions
                        .CatalogObjectInteractionName
                        .ViewCatalogObject,

                    catalogObject: {

                        type: "Product",

                        id: productId,

                        attributes: {
                            name: productName,
                            category: productCategory
                        }

                    }

                }

            });

        });

    });

})
.catch((error) => {

    console.error("SDK ERROR:", error);

});
