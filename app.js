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

    const productButtons =
        document.querySelectorAll(".product-click");

    productButtons.forEach(button => {

        button.addEventListener("click", () => {

            const productId =
                button.dataset.productId;

            const productName =
                button.dataset.productName;

            const productCategory =
                button.dataset.productCategory;

            console.log("PRODUCT CLICKED:", {
                productId,
                productName,
                productCategory
            });

            SalesforceInteractions.sendEvent({

                interaction: {

                    name:
                        SalesforceInteractions
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
.catch(error => {

    console.error(
        "Salesforce SDK initialization failed:",
        error
    );

});
