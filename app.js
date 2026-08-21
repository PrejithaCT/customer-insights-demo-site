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
})
.catch((error) => {
    console.error("Salesforce SDK initialization failed:", error);
});
