/*------Section Panier------*/

//Récupération des données depuis l'API
async function fetchProducts(productId) {
    let response = await fetch(`http://localhost:3000/api/products/${productId}`);
    return await response.json();
}

//Récupération des données du localStrage
let cartContent = JSON.parse(localStorage.getItem("cart-items"));

//Génération des produits dans le panier
async function generateProductOnCart() {
    
    if (cartContent === null) {
        emptyCart();
    } else {
        for (let i = 0; i < cartContent.length; i++) {

            //Récupération des informations d'un produit via son id dans l'API
            let productInfoList = await fetchProducts(cartContent[i].id);

            //Récupération de l'élément du DOM qui accueillera le panier
            const cartSection = document.getElementById("cart__items");
            //Création d'une balise qui affichera chaque produit dans le panier
            const productSection = document.createElement("article");
            productSection.classList.add("cart__item");
            productSection.setAttribute("data-id",`${cartContent[i].id}`);
            productSection.setAttribute("data-color",`${cartContent[i].color}`);
            cartSection.appendChild(productSection);

            //Création d'une balise qui contiendra la balise image du produit
            const productImageSection = document.createElement("div")
            productImageSection.classList.add("cart__item__img");
            productSection.appendChild(productImageSection);

            //Création d'une balise d'image
            const productImage = document.createElement("img")
            productImage.src = productInfoList.imageUrl;
            productImage.setAttribute("alt", "Photographie d'un canapé");
            productImageSection.appendChild(productImage);

            //Création d'une balise qui affichera les informations du produit
            const productInfo = document.createElement("div");
            productInfo.classList.add("cart__item__content");
            productSection.appendChild(productInfo);

            //Création d'une balise qui affichera la description du produit
            const productDescription = document.createElement("div");
            productDescription.classList.add("cart__item__content__description");
            productInfo.appendChild(productDescription);

            //Création du contenu de la description du produit
            const productDescriptionName = document.createElement("h2");
            productDescriptionName.textContent = productInfoList.name;
            productDescription.appendChild(productDescriptionName);

            const productDescriptionColor = document.createElement("p");
            productDescriptionColor.textContent = cartContent[i].color;
            productDescription.appendChild(productDescriptionColor);

            const productDescriptionPrice = document.createElement("p");       
            productDescriptionPrice.textContent = `${productInfoList.price},00 €`;
            productDescription.appendChild(productDescriptionPrice);

            //Création d'une balise qui contiendra les paramètres du produit
            const productSettings = document.createElement("div");
            productSettings.classList.add("cart__item__content__settings");
            productInfo.appendChild(productSettings);

            //Création d'une balise qui contiendra les paramètres de quantité du produit
            const productSettingsQuantity = document.createElement("div");
            productSettingsQuantity.classList.add("cart__item__content__settings__quantity");
            productSettings.appendChild(productSettingsQuantity);

            //Création du contenu des paramètres du produit
            const productSettingsQuantityValue = document.createElement("p");
            productSettingsQuantityValue.textContent = "Qté :";
            productSettingsQuantity.appendChild(productSettingsQuantityValue);

            const productSettingsQuantityInput = document.createElement("input");
            productSettingsQuantityInput.classList.add("itemQuantity");
            productSettingsQuantityInput.setAttribute("type","number");
            productSettingsQuantityInput.setAttribute("name","itemQuantity");
            productSettingsQuantityInput.setAttribute("min","1");
            productSettingsQuantityInput.setAttribute("max","100");
            productSettingsQuantityInput.setAttribute("value",`${cartContent[i].quantity}`);
            productSettingsQuantity.appendChild(productSettingsQuantityInput);

            //Création d'une balise qui contiendra la suppression du produit
            const productSettingsDeletion = document.createElement("div");
            productSettingsDeletion.classList.add("cart__item__content__settings__delete");
            productSettings.appendChild(productSettingsDeletion);

            //Création du contenu de la suppression
            const productSettingsDeletionText = document.createElement("p");
            productSettingsDeletionText.classList.add("deleteItem");
            productSettingsDeletionText.textContent = "Supprimer";
            productSettingsDeletion.appendChild(productSettingsDeletionText);

            modifyProductFromCart(i);
        }
    }
    deleteProductFromCart();
    getTotals();
}

//Création d'une fonction pour afficher un texte quand le panier est vide
function emptyCart() {
    //Récupération de l'élément du DOM qui accueillera le panier
    const cartSection = document.getElementById("cart__items");

    const emptyCart = document.createElement("p");
    emptyCart.textContent = "Votre panier est vide !"
    cartSection.appendChild(emptyCart);
}

//Création d'une fonction pour calculer le total des prix/quantités
async function getTotals() {
    if (cartContent !== null) {
        //Calcul des valeurs totales de prix et de quantité
        let totalQuantity = 0;
        let totalPrice = 0;
        let totalPricePerProducts = 0;
        for (let i = 0; i < cartContent.length; i++) {
            //Récupération des informations d'un produit via son id dans l'API
            let productInfoList = await fetchProducts(cartContent[i].id);

            //Calculs des totaux
            totalQuantity += parseInt(cartContent[i].quantity);
            totalPricePerProducts = cartContent[i].quantity * productInfoList.price;
            totalPrice += totalPricePerProducts;
        }
        //Ajout de la quantité totale d'articles sur l'élément du DOM correspondant
        const displayTotalQuantity = document.getElementById("totalQuantity");
        displayTotalQuantity.textContent = `${totalQuantity}`;

        //Ajout du prix total des articles sur l'élément du DOM correspondant
        const displayTotalPrice = document.getElementById("totalPrice");
        displayTotalPrice.textContent = `${totalPrice},00`;
    } else {
        //Ajout de la quantité nulle d'articles sur l'élément du DOM correspondant
        const displayTotalQuantity = document.getElementById("totalQuantity");
        displayTotalQuantity.textContent = "0";

        //Ajout du prix nul total des articles sur l'élément du DOM correspondant
        const displayTotalPrice = document.getElementById("totalPrice");
        displayTotalPrice.textContent = "0";
    }
}


//Création d'une fonction pour modifier la quantité
function modifyProductFromCart(i) {
    //Récupération de l'élément input
    const productQuantityInput = document.getElementsByName("itemQuantity");
    let element = document.querySelectorAll('[data-id]');

    //Ajout d'une event listener
    productQuantityInput[i].addEventListener('change', () => {

        let innerIndex = cartContent.findIndex(item => item.id === element[i].dataset.id && item.color === element[i].dataset.color);

        //Modification de la valeur de la quantité dans le localStorage
        cartContent[innerIndex].quantity = parseInt(productQuantityInput[i].value);
        
        //Stockage de la nouvelle quantité dans le localStorage
        let cartItem = JSON.stringify(cartContent);
        localStorage.setItem("cart-items", cartItem);

        //appel à la fonction qui fait les totaux
        getTotals();
    })
}

//Création d'une fonction pour supprimer un produit du panier
function deleteProductFromCart() {
    if (cartContent !== null) {
        //Récupération de l'élement input
        const deleteElement = document.getElementsByClassName("deleteItem");
        let element = document.querySelectorAll('[data-id]');


        // for (let i = cartContent.length - 1; i >= 0; i--) {
        for (let i = 0; i < cartContent.length; i++) {

            deleteElement[i].addEventListener('click', () => {

                let innerIndex = cartContent.findIndex(item => item.id === element[i].dataset.id && item.color === element[i].dataset.color);

                //Si la valeur des attributs "data-id" et "data-color" correspond à l'id et à la color du produit
                if (element[i].dataset.id === cartContent[innerIndex].id && element[i].dataset.color === cartContent[innerIndex].color) {
                    element[i].style.display= "none";
                }

                //On retire le produit du panier
                cartContent.splice(innerIndex, 1);

                //On stocke le nouveau tableau dans le localStorage
                let cartItem = JSON.stringify(cartContent);
                localStorage.setItem("cart-items", cartItem);

                //On recalcule les totaux
                getTotals();

                if (cartContent.length === 0) {
                    localStorage.removeItem("cart-items");
                    emptyCart();
                }
            })
        }
    }
}

//Appel à la fonction principale
generateProductOnCart();






/*------Section Formulaire------*/





//Création d'une fonction pour vérifier la validité du formulaire
async function checkInputData() {
    //Initialisation des conteneurs de données récupérés via la validation du formulaire
    const contact = {};
    let productArray = [];

    //Définition d'une regex pour Prénom, Nom et Ville
    const nameMask = /[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

    //Récupération et paramétrage de l'élément du DOM correspondant au Prénom
    const inputFirstName = document.getElementById("firstName");
    const firstNameErrorElement = document.getElementById("firstNameErrorMsg");
    const firstNameErrorMsg = "Merci de rentrer un prénom valide";

    //Vérification de la valeur de l'input
    inputFirstName.addEventListener("change", () => {
        if (!nameMask.test(inputFirstName.value)) {
            firstNameErrorElement.textContent = firstNameErrorMsg;
        } else {
            firstNameErrorElement.textContent = '';
            contact.firstName = inputFirstName.value;
        };
    })

    //Récupération et paramétrage de l'élément du DOM correspondant au Nom
    const inputLastName = document.getElementById("lastName");
    const lastNameErrorElement = document.getElementById("lastNameErrorMsg");
    const lastNameErrorMsg = "Merci de rentrer un nom valide";

    //Vérification de la valeur de l'input
    inputLastName.addEventListener("change", () => {
        if (!nameMask.test(inputLastName.value)) {
            lastNameErrorElement.textContent = lastNameErrorMsg;
        } else {
            lastNameErrorElement.textContent = '';
            contact.lastName = inputLastName.value
        };
    })

    //Récupération et paramétrage de l'élément du DOM correspondant à l'adresse
    const addressMask = /[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    const inputAddress = document.getElementById("address");
    const addressErrorElement = document.getElementById("addressErrorMsg");
    const addressErrorMsg = "Merci de rentrer une adresse valide";

    //Vérification de la valeur de l'input
    inputAddress.addEventListener("change", () => {
        if (!addressMask.test(inputAddress.value)) {
            addressErrorElement.textContent = addressErrorMsg;
        } else {
            addressErrorElement.textContent = '';
            contact.address = inputAddress.value
        };
    })

    //Récupération et paramétrage de l'élément du DOM correspondant à la ville
    const inputCity = document.getElementById("city");
    const cityErrorElement = document.getElementById("cityErrorMsg");
    const cityErrorMsg = "Merci de rentrer une ville valide";
    
    //Vérification de la valeur de l'input
    inputCity.addEventListener("change", () => {
        if (!nameMask.test(inputCity.value)) {
            cityErrorElement.textContent = cityErrorMsg;
        } else {
            cityErrorElement.textContent = '';
            contact.city = inputCity.value
        };
    })

    //Récupération et paramétrage de l'élément du DOM correspondant à l'adresse mail
    const emailMask = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const inputEmail = document.getElementById("email");
    const emailErrorElement = document.getElementById("emailErrorMsg");
    const emailErrorMsg = "Merci de rentrer une adresse email valide";

    //Vérification de la valeur de l'input
    inputEmail.addEventListener("change", () => {
        if (!emailMask.test(inputEmail.value)) {
            emailErrorElement.textContent = emailErrorMsg;
        } else {
            emailErrorElement.textContent = '';
            contact.email = inputEmail.value
        };
    })

    //Appel de la fonction pur valider la commande
    order(contact, productArray);
}

//Créatin d'une fonction pour valider la commande
function order(contactObject, productArray) {
    //Initialisation de l'objet à envoyer à l'API
    let orderInfo = {
        contact: contactObject,
        products: productArray,
    };
    //Récupération de l'élément du DOM permettant de commander
    let submitButton = document.getElementById("order");

    //Ajout d'un event listener sur le bouton "Commander"
    submitButton.addEventListener("click", async function (event) {
        //Pour que la page ne se recharge pas lors du clic
        event.preventDefault();
        //Récupération des prooduits du panier depuis le localStorage pour les envoyer à l'API
        for(let i = 0; i < cartContent.length; i++) {
            productArray.push(cartContent[i].id);
        }
        //Si l'objet de contact possède tous les champs requis et qu'il y a un objet dans le panier 
        if(Object.keys(contactObject).length >= 5 && productArray.length) {
            //Envoi des données à l'API
            let response = await fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderInfo),
            });
            //Récupération de la réponse avec l'order-ID
            let result = await response.json();
            //Suppression des produits du localStorage
            localStorage.removeItem("cart-items");
            //Renvoi sur la page de confirmation de commande
            window.location.replace(`../html/confirmation.html?${result.orderId}`);
        }
        else {
            
            window.alert("Veuillez remplir correctement le formulaire !")
        }
    })
}

//Appel de la fonction principale
checkInputData();


