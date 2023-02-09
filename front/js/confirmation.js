function displayOrderId() {
    const confirmationURL = (new URL(window.location.href))
    let orderIdFromURL = confirmationURL.search.substring(1);

    let orderIdElement = document.getElementById("orderId");
    orderIdElement.textContent = orderIdFromURL;
}

displayOrderId();

//Dois-je supprimer le localStorage ?????