//Création d'une fonction pour afficher le numéro de commande
function displayOrderId() {
    //Récupération de l'URL
    const orderIdFromURL = (new URL(window.location.href).searchParams.get("orderID"));
    //On récupère l'élément du DOM permettant d'afficher l'orderID
    let orderIdElement = document.getElementById("orderId");
    //On affiche l'orderID
    orderIdElement.textContent = orderIdFromURL;
}

//Appel de la fonction principale
displayOrderId();