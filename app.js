SalesforceInteractions.init({
    consents: [
        {
            provider: "Website",
            purpose: SalesforceInteractions.ConsentPurpose.Tracking,
            status: SalesforceInteractions.ConsentStatus.OptIn
        }
    ]
})
.then(() => {

    console.log("Salesforce SDK initialized");

    console.log(
        "Current consents:",
        SalesforceInteractions.getConsents()
    );

    const buttons =
        document.querySelectorAll(".product-click");

    console.log(
        "Product buttons found:",
        buttons.length
    );

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const productId =
                this.dataset.productId;

            const productName =
                this.dataset.productName;

            const productCategory =
                this.dataset.productCategory;

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

            console.log(
                "sendEvent called for:",
                productId
            );

        });

    });

})
.catch(error => {

    console.error(
        "SDK ERROR:",
        error
    );

});
