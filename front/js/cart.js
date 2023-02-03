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

    //Ajout d'une event listener
    productQuantityInput[i].addEventListener('change', () => {

        //Modification de la valeur de la quantité dans le localStorage
        cartContent[i].quantity = parseInt(productQuantityInput[i].value);
        
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
                console.log(cartContent.length);

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

function checkInputData() {
    //Récupération de l'élément du DOM correspondant au Prénom
    const inputFirstName = document.getElementById("firstName");
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");

    inputFirstName.addEventListener("change", () => {
        //déclare la regexp
        //regexp != value
        //insert p avec message d'erreur
        let firstNameMask = /\d/;
        if (firstNameMask.test(inputFirstName.value)) {
            firstNameErrorMsg.textContent = "Merci de rentrer un prénom valide"
        } else {
            firstNameErrorMsg.textContent = '';
        };
    })
}

checkInputData();