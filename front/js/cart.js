//Récupération de la fonction permettant la récupération des données depuis l'API
async function fetchProducts() {
    let response = await fetch("http://localhost:3000/api/products/");
    return await response.json();
}

//Récupération des données du localStrage
let cartContent = JSON.parse(localStorage.getItem("cart-items"));
console.log(cartContent);

//Génération des produits dans le panier
async function generateProductOnCart() {
    const productsInfoFromAPI = await fetchProducts();
    for (let i = 0; i < cartContent.length; i++) {
        const article = productsInfoFromAPI[i];

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
        productImage.src = productsInfoFromAPI[i].imageUrl;
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
        productDescriptionName.textContent = productsInfoFromAPI[i].name;
        productDescription.appendChild(productDescriptionName);

        const productDescriptionColor = document.createElement("p");
        productDescriptionColor.textContent = cartContent[i].color;
        productDescription.appendChild(productDescriptionColor);

        const productDescriptionPrice = document.createElement("p");       
        productDescriptionPrice.textContent = `${productsInfoFromAPI[i].price},00 €`;
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
        modifyProductFromCart(i, cartContent, productsInfoFromAPI);
    }
    deleteProductFromCart(productsInfoFromAPI);
    getTotals(productsInfoFromAPI);
}

function getTotals(productsInfoFromAPI) {
    //Calcul des valeurs totales de prix et de quantité
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let i = 0; i < cartContent.length; i++) {
        totalQuantity += parseInt(cartContent[i].quantity);
        totalPrice = totalQuantity * productsInfoFromAPI[i].price;
    }
    //Ajout de la quantité totale d'articles sur l'élément du DOM correspondant
    const displayTotalQuantity = document.getElementById("totalQuantity");
    displayTotalQuantity.textContent = `${totalQuantity}`;

    //Ajout du prix total des articles sur l'élément du DOM correspondant
    const displayTotalPrice = document.getElementById("totalPrice");
    displayTotalPrice.textContent = `${totalPrice},00`;
}


//Création d'une fonction pour modifier la quantité
function modifyProductFromCart(index, cartContent, productsInfoFromAPI) {
    //Récupération de l'élément input
    const productQuantityInput = document.getElementsByName("itemQuantity");

    let totalProductPrice = productsInfoFromAPI[index].price * cartContent[index].quantity;
    let totalQuantity = parseInt(cartContent[index].quantity);
    let currentValue = productQuantityInput[index].value;

    //Ajout d'une event listener
    productQuantityInput[index].addEventListener('change', () => {
        if (currentValue < productQuantityInput[index].value) {
            totalProductPrice += productsInfoFromAPI[index].price;
            totalQuantity++;
            currentValue = productQuantityInput[index].value;
        } else {
            totalProductPrice -= productsInfoFromAPI[index].price;
            totalQuantity--;
            currentValue = productQuantityInput[index].value;
        }
        //Modification de la valeur de la quantité dans le localStorage
        cartContent[index].quantity = productQuantityInput[index].value;
        
        //Stockage de la nouvelle quantité dans le localStorage
        let cartItem = JSON.stringify(cartContent);
        localStorage.setItem("cart-items", cartItem);

        //appel à la fonction qui fait les totaux
        getTotals(productsInfoFromAPI);
    })
    return {
        price: totalProductPrice,
        quantity: totalQuantity
    };
}

function deleteProductFromCart(productsInfoFromAPI) {
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
            getTotals(productsInfoFromAPI);
        })
    }
}

generateProductOnCart();
