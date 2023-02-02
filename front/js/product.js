//Récupération de l'ID du produit
const productId = (new URL(window.location.href)).searchParams.get("id");

//Récupération des données depuis l'API
async function fetchProductsFromdId() {
    let response = await fetch(`http://localhost:3000/api/products/${productId}`);
    return await response.json()
}

//Insertion du produit sur la page produit
async function generateProductOnPage() {

    //Récupération des valeurs de l'API pour les exploiter
    const product = await fetchProductsFromdId();

    //Récupération de l'élément du DOM qui accueillera l'image du produit
    const imageSection = document.querySelector(".item__img");
    //Création d'une balise qui affichera l'images du produit
    const productImage = document.createElement("img");
    productImage.src = product.imageUrl;
    //Modification des légendes des images
    productImage.setAttribute("alt",`${product.altTxt}`)
    //On rattache la balise img à la balise div
    imageSection.appendChild(productImage);
    
    //Récupération de l'élément du DOM qui accueillera le nom du produit
    const productTitle = document.getElementById("title");
    //Création du contenu de la balise
    productTitle.textContent = product.name;

    //Récupération de l'élément du DOM qui accueillera le prix du produit
    const productPrice = document.getElementById("price");
    //Création du contenu de la balise
    productPrice.textContent = product.price;

    //Récupération de l'élément du DOM qui accueillera la description du produit
    const productDescription = document.getElementById("description");
    //Création du contenu de la balise
    productDescription.textContent = product.description;

    //Récupération de l'élément du DOM qui accueillera les couleurs du produit
    const colorsSection = document.getElementById("colors");
    //Création de balises qui vont afficher les différentes couleurs
    for (let i = 0; i < product.colors.length; i++) {
        const productColor = document.createElement("option");
        productColor.value = productColor.textContent = product.colors[i];
    
        //On rattache les options à la balise select
        colorsSection.appendChild(productColor);
    }
}

async function stockProductOnCart(productInfo) {
    //Initialisation du panier dans le localStorage
    let cartContent = localStorage.getItem("cart-items");
    cartContent = cartContent ? JSON.parse(cartContent) : [];

    //Récupération de l'élément bouton qui permettra l'envoi des données
    const addToCardButton = document.getElementById("addToCart");
    addToCardButton.addEventListener("click", () => {
        //Récupération de la valeur de la quantité
        let productChosenQuantity = parseInt(document.getElementById("quantity").value, 10);
        //Récupération de la couleur
        let colorList = document.getElementById("colors");
        //Récupération la couleur
        let productChosenColor = colorList.options[colorList.selectedIndex].text;
        //Récupération de l'index du choix de couleur
        let colorIndex = colorList.selectedIndex;
        //Vérification de l'existence d'un produit via son index
        const myIndex = cartContent.findIndex(item => item.id === productId && item.color === productChosenColor);

        //Si la couleur est choisie ET que la quantité est supérieur à 0
        if (colorIndex > 0 && productChosenQuantity > 0) {
            //Si le produit existe déjà
            if (myIndex > - 1) {
                cartContent[myIndex].quantity += productChosenQuantity;
            }
            //Si le produit n'existe pas
            else {
                cartContent.push({
                    id: productId,
                    color: productChosenColor,
                    quantity: productChosenQuantity,
                })
            }
            //Stockage des données dans localStorage
            let cartItem = JSON.stringify(cartContent);
            localStorage.setItem("cart-items", cartItem);
        }
    })
}

//Création d'une fonction "principale"
async function mainFunction() {
    let productInfo = await generateProductOnPage();
    stockProductOnCart(productInfo);
}

mainFunction();

