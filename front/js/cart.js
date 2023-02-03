//Récupération des données depuis l'API
async function fetchProducts(productId) {
    let response = await fetch(`http://localhost:3000/api/products/${productId}`);
    return await response.json();
}


//Récupération des données du localStrage
let cartContent = JSON.parse(localStorage.getItem("cart-items"));
console.log(cartContent);

//Génération des produits dans le panier
async function generateProductOnCart() {

    //Il faut récupérer les données de l'API via productID qui est égale à
    //cartContent[i].id 
    for (let i = 0; i < cartContent.length; i++) {

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
        productImage.src = productInfoList.imageUrl; // = imageUrl de la réponse API de l'objet partageant l'ID du cartContent
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
        productDescriptionName.textContent = cartContent[i].name;
        productDescription.appendChild(productDescriptionName);

        const productDescriptionColor = document.createElement("p");
        productDescriptionColor.textContent = cartContent[i].color;
        productDescription.appendChild(productDescriptionColor);

        const productDescriptionPrice = document.createElement("p");       
        productDescriptionPrice.textContent = `${cartContent[i].price},00 €`;
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
        //Appel de la fonction de modification de la quantité

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
    deleteProductFromCart();
    getTotals();
}

function getTotals() {
    //Calcul des valeurs totales de prix et de quantité
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let i = 0; i < cartContent.length; i++) {
        totalQuantity += parseInt(cartContent[i].quantity);
        totalPrice = totalQuantity * cartContent[i].price;
    }
    //Ajout de la quantité totale d'articles sur l'élément du DOM correspondant
    const displayTotalQuantity = document.getElementById("totalQuantity");
    displayTotalQuantity.textContent = `${totalQuantity}`;

    //Ajout du prix total des articles sur l'élément du DOM correspondant
    const displayTotalPrice = document.getElementById("totalPrice");
    displayTotalPrice.textContent = `${totalPrice},00`;
}


//Création d'une fonction pour modifier la quantité
function modifyProductFromCart(i) {
    //Récupération de l'élément input
    const productQuantityInput = document.getElementsByName("itemQuantity");

    let totalProductPrice = cartContent[i].price * cartContent[i].quantity;
    let totalQuantity = parseInt(cartContent[i].quantity);
    let currentValue = productQuantityInput[i].value;

    //Ajout d'une event listener
    productQuantityInput[i].addEventListener('change', () => {
        if (currentValue < productQuantityInput[i].value) {
            totalProductPrice += cartContent[i].price;
            totalQuantity++;
            currentValue = productQuantityInput[i].value;
        } else {
            totalProductPrice -= cartContent[i].price;
            totalQuantity--;
            currentValue = productQuantityInput[i].value;
        }
        //Modification de la valeur de la quantité dans le localStorage
        cartContent[i].quantity = parseInt(productQuantityInput[i].value);
        
        //Stockage de la nouvelle quantité dans le localStorage
        let cartItem = JSON.stringify(cartContent);
        localStorage.setItem("cart-items", cartItem);

        //appel à la fonction qui fait les totaux
        getTotals();
    })
    return {
        price: totalProductPrice,
        quantity: totalQuantity
    };
}

function deleteProductFromCart() {
    //Récupération de l'élement input
    const deleteElement = document.getElementsByClassName("deleteItem");
    let element = document.querySelectorAll('[data-id]');


    for (let i = cartContent.length - 1; i >= 0; i--) {
    // for (let i = 0; i < cartContent.length; i++) {

        deleteElement[i].addEventListener('click', () => {

            if (element[i].dataset.id === cartContent[i].id && element[i].dataset.color === cartContent[i].color) {
                element[i].style.display= "none";
            }

            cartContent.splice(i, 1);

            let cartItem = JSON.stringify(cartContent);
            localStorage.setItem("cart-items", cartItem);
            getTotals();
        })
    }
}

generateProductOnCart();
