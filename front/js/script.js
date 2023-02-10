//Récupération des données depuis l'API
async function fetchProducts() {
    let response = await fetch("http://localhost:3000/api/products");
    return await response.json();
}

//Insertion des produits sur la page d'accueil
async function generateProducts() {

    //Récupération des valeurs de l'API pour les exploiter
    const products = await fetchProducts();
    for (let i = 0; i < products.length; i++) {
        const article = products[i];

        //Récupération de l'élément du DOM qui accueillera les produits
        const itemsSection = document.querySelector(".items");

        //Génération d'un lien dynamique propre à chaque produit
        const productLink = document.createElement("a");
        productLink.href = `./product.html?id=${article._id}`;

        //Création d'une balise dédiée à un produit
        const productCard = document.createElement("article");

        //Création d'une balise qui affichera les images des produits
        const productImage = document.createElement("img");
        productImage.src = article.imageUrl;

        //Modification des légendes des images
        productImage.setAttribute("alt",`${article.altTxt}`)

        //Création d'une balise qui affichera les noms des produits
        const productName = document.createElement("h3");
        productName.textContent = article.name;
        //Ajout de la classe sur l'élement
        productName.classList.add("productName");

        //Création d'une balise qui affichera les noms des produits
        const productDescription = document.createElement("p");
        productDescription.textContent = article.description;
        //Ajout de la classe sur l'élement
        productDescription.classList.add("productDescription");

        //On rattache la balise a à la section
        itemsSection.appendChild(productLink);

        //On rattache la balise article à la balise a
        productLink.appendChild(productCard);

        //On rattache le contenu de l'article
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
    }
}

//Appel de la fonction principale
generateProducts();