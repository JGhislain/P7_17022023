//--------------------------------------------------------------------------------------//
//                     Import du tableau issu du fichier recipes.js                     //
//--------------------------------------------------------------------------------------//


import { recipes } from "../assets/json/recipes.js";


//--------------------------------------------------------------------------------------//
//                               Appel du DOM nécessaire                                //
//--------------------------------------------------------------------------------------//


const sectionRecettes = document.querySelector('.section-recettes');
const cadreTags = document.querySelector('.cadre-tags');
const cadreListeIngredients = document.querySelector('.liste-ingredient');
const cadreListeAppareils = document.querySelector('.liste-appareil');
const cadreListeUstensiles = document.querySelector('.liste-ustensile');
const cadreTagsIngredients = document.querySelector('.tags-ingredients');
const cadreTagsAppareils = document.querySelector('.tags-appareils');
const cadreTagsUstensiles = document.querySelector('.tags-ustensiles');
const inputRecherche = document.querySelector('.search-bar');
const inputIngredient = document.querySelector('.search-ingredient');
const inputAppareil = document.querySelector('.search-appareil');
const inputUstensile = document.querySelector('.search-ustensile');
const boutonIngredients = document.querySelector('.bouton-ingredients');
const boutonAppareils = document.querySelector('.bouton-appareils');
const boutonUstensiles = document.querySelector('.bouton-ustensiles');



//--------------------------------------------------------------------------------------//
//                       Factory pour créer des objets de recette                       //
//--------------------------------------------------------------------------------------//

// ---- La classe RecetteFactory permet de créer des objets Recette ----------------------
class RecetteFactory {

    // ---- Méthode pour créer un objet Recette à partir d'un objet littéral -----------------
    creationRecette({ id, name, servings, ingredients, time, description, appliance, ustensils}) {
        return {
            id,
            name,
            servings,
            ingredients,
            time,
            description,
            appliance,
            ustensils,
        };
    }
}

// ---- Création d'une instance de RecetteFactory ----------------------------------------
const recetteFactory = new RecetteFactory();

// ---- Création d'un tableau des recettes à partir du tableau des recettes importé-------------
// ---- Chaque recette est créée en utilisant l'instance de RecetteFactory ---------------
const lesRecettes = recipes.map((recipe) => {
    const { id, name, servings, ingredients, time, description, appliance, ustensils} = recipe;
    return recetteFactory.creationRecette({ id, name, servings, ingredients, time, description, appliance, ustensils});
});


//--------------------------------------------------------------------------------------//
//                 Fonction pour intégrer un élément HTML d'une recette                 //
//--------------------------------------------------------------------------------------//


// ---- Fonction pour créer une chaîne de caractères contenant le code HTML d'un élément recette ----
function creationRecetteElement(recipe) {

    // ---- Générer la liste des ingrédients et leurs quantités ------------------------------
    const ingredientsListe = recipe.ingredients.map((ing) => {

        // ---- Si la quantité et l'unité sont présentes -----------------------------------------
        if (ing.quantity && ing.unit) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.quantity} ${ing.unit}</span></li>`

        // ---- Si seule la quantité est présente ------------------------------------------------
        } else if (ing.quantity) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.quantity}</span></li>`

            // ---- Si seule l'unité est présente ----------------------------------------------------
        } else if (ing.unit) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.unit}</span></li>`

            // ---- Si ni la quantité ni l'unité ne sont présentes -----------------------------------
        } else {
            return `<li class="liste-ingredients"><b>${ing.ingredient}</b></li>`
        }
    }).join('');

    // ---- Retourne le code HTML d'un élément recette ---------------------------------------
    return `
    <article class="encart-recette" data-id="${recipe.id}">
        <div class="cadre-photo-recette"></div>
        <div class="cadre-recette">
            <div class="cadre-titre-temps">
                <h2 class="titre-recette">${recipe.name}</h2>
                <div class="cadre-temps">
                    <i class="fa-regular fa-clock"></i>
                    <p class="temps-recette">${recipe.time} min</p>
                </div>
            </div>
            <div class="recette">
                <div class="cadre-ingredients">
                    <ul class="ingredients-recette">${ingredientsListe}</ul>
                </div>
                <div class="cadre-description">
                    <div class="description-recette">${recipe.description}</div>
                </div>
            </div>
        </div>
    </article>
    `;
}


//--------------------------------------------------------------------------------------//
//         Injecter les éléments HTML des recettes à la section cadre-recettes          //
//--------------------------------------------------------------------------------------//


// ---- Parcourir chaque recette dans le tableau des recettes ----------------------------
lesRecettes.forEach((recipe) => {

    // ---- Créer un élément HTML pour chaque recette ----------------------------------------
    const recetteElement = creationRecetteElement(recipe);

    // ---- Ajouter l'élément HTML de la recette à la section des recettes -------------------
    sectionRecettes.innerHTML += recetteElement;
});


// ---- Variable global qui stock les recettes actuellement affichées --------------------
let recettesActuelles = lesRecettes;


//--------------------------------------------------------------------------------------//
//       Fonction pour filtrer les recettes affichées en fonction de la recherche       //
//--------------------------------------------------------------------------------------//


function filtrerRecettes(texteRecherche, recettes = lesRecettes) {

    // ---- Filtrer les recettes dont le nom, la description ou les ingrédients contiennent le texte de recherche ----
    const recettesFiltrees = recettes.filter((recette) => {

        // ---- Convertir le nom et la description de la recette en minuscule --------------------
        const nomRecette = recette.name.toLowerCase();
        const descriptionRecette = recette.description.toLowerCase();

        // ---- Convertir les éléments de la recette en minuscule et les combiner en une seule chaine de caractère ----
        const ingredientsRecette = recette.ingredients.map((ingredient) => {
            if (typeof ingredient === "object") {

                // ---- Si l'ingrédient est un objet, extraire les valeurs des propriétés, les combiner en une chaîne de caractères et convertir en minuscules ----
                return Object.values(ingredient).join(" ").toLowerCase();
            } else {

                // ---- Si l'ingéredient est une seule chaîne de caractères, convertir simplement en minuscule ----
                return ingredient.toLowerCase();
            }
        })
        .join(" ");

        // ---- Convertir le texte de recherche en minuscules ------------------------------------
        const texteRechercheLowerCase = texteRecherche.toLowerCase();

        // ---- Vérifier si le texte de recherche est présent dans le nom, la description ou les ingrédients de la recette ----
        return nomRecette.includes(texteRechercheLowerCase) || descriptionRecette.includes(texteRechercheLowerCase) || ingredientsRecette.includes(texteRechercheLowerCase);
    });

    // ---- Retourner les recettes filtrées ----------------
    return recettesFiltrees;
  }


//--------------------------------------------------------------------------------------//
//                      Fonction pour afficher toutes les recettes                      //
//--------------------------------------------------------------------------------------//


function afficherRecettes(recettes) {

    // ---- Vider le contenu de la section des recettes --------------------------------------
    sectionRecettes.innerHTML = "";

        // ---- Si aucune recette à afficher, un message d'erreur est créer et indiquer à l'utilisateur ----
        if (recettes.length === 0) {
            
            // ---- Création d'un élément HTML -------------------------------------------------------
            const manqueRecette = document.createElement('div');

            // ---- Ajouter une classe à l'élément span ----------------------------------------------
            manqueRecette.classList.add('manque-recette');

            // ---- Ajouter un message d'erreur à l'élément ------------------------------------------
            manqueRecette.innerHTML = `<img class="icone-toque-erreur" src="../assets/img/toque_titre.png" alt="image d'une toque de chef">
            <span class="message-erreur">Aucune recette ne correspond à votre recherche.</span>`;

            // ---- Ajouter l'élément span à la section des recettes ---------------------------------
            sectionRecettes.appendChild(manqueRecette);
        }   

    // ---- Parcourir chaque recette et créer un élément HTML pour chaque recette ------------
    recettes.forEach((recipe) => {
        const recetteElement = creationRecetteElement(recipe);

        // ---- Ajouter l'élément HTML de la recette à la section des recettes -------------------
        sectionRecettes.innerHTML += recetteElement;
    });
}


//--------------------------------------------------------------------------------------//
//       Fonction pour ajouter les éléments (tags) à la section cadreListeTags          //
//--------------------------------------------------------------------------------------//


function ajouterElements(tag, categorie) {

    // ---- Création d'un élément span pour chaque tag (ingrédient, appareil, ustensile) -----
    const tagElement = document.createElement('span');

    // ---- Ajout de la classe "search-tag" pour l'élément span créé -------------------------
    tagElement.classList.add('search-tag');

    // ---- Ajout du contenu textuel (le nom du tag) dans l'élément span créé ----------------
    tagElement.textContent = tag;

    if (categorie === "ingredients") {
        cadreTagsIngredients.appendChild(tagElement)
    }
    if (categorie === "appareils") {
        cadreTagsAppareils.appendChild(tagElement)
    }
    if (categorie === "ustensiles") {
        cadreTagsUstensiles.appendChild(tagElement)
    }
    
}


//--------------------------------------------------------------------------------------//
//     Fonction pour afficher les tags (ingrédients, appareils, ustensiles) dans la     //
//                                section cadreListeTags                                //
//--------------------------------------------------------------------------------------//


function afficherTag(elements, categorie) {

    // ---- Suppression du contenu HTML précédent de la section "cadreListeTags" -------------
    if (categorie === "ingredients") {
        cadreTagsIngredients.innerHTML = "";
    }
    if (categorie === "appareils") {
        cadreTagsAppareils.innerHTML = "";
    }
    if (categorie === "ustensiles") {
        cadreTagsUstensiles.innerHTML = "";
    }

    // ---- Pour chaque élément dans le tableau "elements" (ingrédients, appareils, ustensiles), ----
    // ---- on appelle la fonction "ajouterElements" pour l'ajouter à la section "cadreListeTags" ----
    elements.forEach(element => {
        ajouterElements(element, categorie)
    })
}


//--------------------------------------------------------------------------------------//
//     Fonction pour ajouter un tag (ingrédient, appareil, ustensile) à la section      //
//              cadreTags et le retirer au clic sur l'icône de suppression              //
//--------------------------------------------------------------------------------------//


function ajouterTag(tag, categorie) {

    // ---- Création d'un élément span pour chaque tag ---------------------------------------
    const tagElement = document.createElement('span');

    // ---- Ajout de la classe "tag-search" --------------------------------------------------
    tagElement.classList.add('tag-search');

    // ---- Ajout d'un background-color en fonction de la catégorie --------------------------
    if (categorie === "ingredient") {
        tagElement.style.backgroundColor = "#3282F7"
    }
    else if (categorie === "appareil") {
        tagElement.style.backgroundColor = "#68D9A4"
    }
    else if (categorie === "ustensile") {
        tagElement.style.backgroundColor = "#ED6454"
    }

    // ---- Ajout du nom de l'ingrédient, ustensile ou appareil dans l'élément ---------------
    tagElement.textContent = tag;

    // ---- Création d'un élément "i" pour l'icône de suppression ----------------------------
    const xIcone = document.createElement('i');

    // ---- Ajout des classes pour l'icone de suppression ------------------------------------
    xIcone.classList.add('fas', 'fa-times', 'icone-fermeture');

    // ---- Ajout de l'icône de suppression à l'élément span ---------------------------------
    tagElement.appendChild(xIcone);

    // ---- Ajout d'un événement au clic sur l'icone de suppression pour retirer l'élément ----
    xIcone.addEventListener('click', () => {

        // ---- Supprime l'élément span créé au clic sur l'icone ---------------------------------
        cadreTags.removeChild(tagElement);
        const tags = [...cadreTags.querySelectorAll('.tag-search')].map((tagRestant) => tagRestant.textContent);
        filterRecettesParTag(tags)

        // Récupère la valeur de la barre de recherche principale et supprime les espaces en début et fin de chaîne
        const texteRecherche = inputRecherche.value.trim();

        // Vérifie si la longueur du texte de recherche est supérieure ou égale à 3
        if (texteRecherche.length >= 3) {
            // Filtrer les recettes en utilisant la fonction filtrerRecettes
            const recettesFiltrees = filtrerRecettes(texteRecherche, recettesActuelles);

            // Mettre à jour la variable recettesActuelles avec les recettes filtrées
            recettesActuelles = recettesFiltrees;

            // Afficher les recettes filtrées
            afficherRecettes(recettesFiltrees);
        }
    });
    
    // ---- Ajout de l'élément span créé à la section "cadreTags" et on supprime la valeur dans la liste des éléments ----
    cadreTags.appendChild(tagElement);
    inputIngredient.value = "";
    inputAppareil.value = "";
    inputUstensile.value = "";
}


//--------------------------------------------------------------------------------------//
//           Fonction pour filter les ingrédients en fonction de la recherche           //
//--------------------------------------------------------------------------------------//


// ---- Création d'un Set pour stocker les ingrédients filtrés ---------------------------
let ingredientFiltres = new Set();

function filtrerIngredients(texteRecherche) {

    // ---- Réinitialisation du Set pour stocker les ingrédients filtrés ---------------------
    ingredientFiltres.clear();

    // ---- Boucle pour chaque recette dans le tableau "lesRecettes" -------------------------
    lesRecettes.forEach((recette) => {

        // ---- Création d'un tableau pour stocker les noms des ingrédients de la recette actuelle ----
        const ingredientsRecette = recette.ingredients.map((ing) => ing.ingredient);

        // ---- Filtrage du tableau d'ingrédients de la recette pour ne garder que ceux qui correspondent à la recherche ----
        const ingredientsFiltresRecette = ingredientsRecette.filter((ing) => 
        ing.toLowerCase().includes(texteRecherche.toLowerCase())
        );

        // ---- Ajout des ingrédients filtrés de la recette actuelle dans le Set -----------------
        ingredientsFiltresRecette.forEach((ing) => ingredientFiltres.add(ing));
    });

    // ---- Conversion du Set en tableau pour le renvoyer ------------------------------------
    return [...ingredientFiltres]
}


//--------------------------------------------------------------------------------------//
//           Fonction pour filtrer les appareils en fonction de la recherche            //
//--------------------------------------------------------------------------------------//


// ---- Création d'un Set pour stocker les appareils filtrés -----------------------------
let appareilFiltres = new Set();

function filtrerAppareils(texteRecherche) {

    // ---- Réinitialisation du Set pour stocker les appareils filtrés -----------------------
    appareilFiltres.clear();

    // ---- Boucle pour chaque recette dans le tableau "lesRecettes" -------------------------
    lesRecettes.forEach((recette) => {

        // ---- Si l'appareil de la recette actuelle correspond à la recherche, ajouter l'appareil au Set ----
        if (recette.appliance.toLowerCase().includes(texteRecherche.toLowerCase())) {
            appareilFiltres.add(recette.appliance);
        }
    });

    // ---- Conversion du Set en tableau pour le renvoyer ------------------------------------
    return [...appareilFiltres];
}


//--------------------------------------------------------------------------------------//
//           Fonction pour filtrer les ustensiles en fonction de la recherche           //
//--------------------------------------------------------------------------------------//


// ---- Création d'un Set pour stocker les ustensiles filtrés ----------------------------
let ustensileFiltres = new Set();

function filtrerUstensiles(texteRecherche) {

    // ---- Réinitialisation du Set pour stocker les ustensiles filtrés ----------------------
    ustensileFiltres.clear();

    // ---- Boucle pour chaque recette dans le tableau "lesRecettes" -------------------------
    lesRecettes.forEach((recette) => {

        // ---- Création d'un tableau pour stocker les ustensiles de la recette actuelle ---------
        const ustensilesRecette = recette.ustensils;

        // ---- Filtrage du tableau d'ustensiles de la recette pour ne garder que ceux qui correspondent à la recherche ----
        const ustensilesFiltresRecette = ustensilesRecette.filter((ustensile) => 
            ustensile.toLowerCase().includes(texteRecherche.toLowerCase())
        );

        // ---- Ajout des ustensiles filtrés de la recette actuelle dans le Set ------------------
        ustensilesFiltresRecette.forEach((ustensile) => ustensileFiltres.add(ustensile));
    });

    // ---- Conversion du Set en tableau pour le renvoyer ------------------------------------
    return [...ustensileFiltres];
}


//--------------------------------------------------------------------------------------//
//         Fonction pour filter les recettes en fonction des tags sélectionnés          //
//--------------------------------------------------------------------------------------//


function filterRecettesParTag(tags, texteRecherche = "") {
    // Choisissez les recettes à filtrer en fonction du texte de la recherche
    let recettesAFiltrer;
    if (texteRecherche.length >= 3) {
        recettesAFiltrer = filtrerRecettes(texteRecherche, recettesActuelles);
    } else {
        recettesAFiltrer = lesRecettes;
    }

    // Si il n'y a plus de tags, affichez toutes les recettes
    if (tags.length === 0) {
        // Réinitialise le contenu de la section des recettes
        sectionRecettes.innerHTML = "";

        // Génère et affiche les éléments de recette pour toutes les recettes
        lesRecettes.forEach((recipe) => {
            const recetteElement = creationRecetteElement(recipe);
            sectionRecettes.innerHTML += recetteElement;
        });
        recettesActuelles = lesRecettes;
    } else {
        // Filtrer les recettes en fonction des tags
        const recettesFiltrees = recettesAFiltrer.filter((recette) => {
            // Récupérer les ingrédients, les appareils et les ustensiles de la recette
            const ingredients = recette.ingredients.map((ing) => ing.ingredient.toLowerCase());
            const appareils = [recette.appliance.toLowerCase()];
            const ustensiles = recette.ustensils.map((ustensile) => ustensile.toLowerCase());

            // Vérifier si chaque tag est inclus dans les ingrédients, les appareils ou les ustensiles de la recette
            return tags.every((tag) => [...ingredients, ...appareils, ...ustensiles].includes(tag.toLowerCase()));
        });

        // Mise à jour de la liste des recettes
        recettesActuelles = recettesFiltrees;

        // Filtrer les recettes en fonction de la recherche principale, si elle est effectuée
        let recettesAFiltrerParRecherche;
        if (texteRecherche.length >= 3) {
            recettesAFiltrerParRecherche = filtrerRecettes(texteRecherche, recettesFiltrees);
        } else {
            recettesAFiltrerParRecherche = recettesFiltrees;
        }

        // Afficher les recettes filtrées
        sectionRecettes.innerHTML = recettesAFiltrerParRecherche.map((recette) => creationRecetteElement(recette)).join("");
    }
}


//--------------------------------------------------------------------------------------//
//                   Fonction pour afficher la liste des ingrédients                    //
//--------------------------------------------------------------------------------------//


function afficherListeIngredients() {

    // ---- Retirer la class "fermer-cadre" si boutonIngredients contient la class -----------
    fermerLesListes();
    
    // ---- Ferme les autres listes déroulantes (appareils et ustensiles) avant d'afficher celle des ingrédients ----
    boutonAppareils.classList.add('fermer-cadre');
    boutonUstensiles.classList.add('fermer-cadre');

    // ---- Extraire tous les ingrédients de toutes les recettes actuelles en utilisant flatMap pour créer un tableau unique ----
    const tousLesIngredients = recettesActuelles.flatMap((recette) => {
        return recette.ingredients.map((ing) => {

            // ---- Si l'ingrédient est un objet, récupère la valeur de la propriété 'ingredient' ----
            if (typeof ing === 'object') {
                return ing.ingredient.toLowerCase();

            // ---- sinon, utilise la valeur de l'ingrédient directement, en convertissant en minuscules ----
            } else {
                return ing.toLowerCase();
            }
        });
    });

    // Éliminer les doublons en créant un Set (qui ne permet pas les doublons) puis en le convertissant en tableau
    const ingredientsUniques = Array.from(new Set(tousLesIngredients));

    // ---- Afficher les ingrédients dans la liste déroulante en utilisant map pour créer un tableau de chaînes de caractères ----
    // ---- représentant chaque élément de la liste, puis en le convertissant en une seule chaîne de caractères avec join('') ----
    cadreTagsIngredients.innerHTML = ingredientsUniques.map((ingredient) => `<span class="search-tag">${ingredient}</span>`).join('');

    // ---- Modifier la classe du bouton pour ajuster la largeur lors de l'affichage de la liste ----
    if (boutonIngredients.classList.contains('largeur-bouton-filtre')) {

        // ---- Enlevez la classe 'largeur-bouton-filtre' et ajoutez la classe 'agrandir-bouton-filtre' pour ajuster la largeur du bouton ----
        boutonIngredients.classList.remove('largeur-bouton-filtre');
        boutonIngredients.classList.add('agrandir-bouton-filtre')
    }
}


//--------------------------------------------------------------------------------------//
//                    Fonction pour afficher la liste des appareils                     //
//--------------------------------------------------------------------------------------//


function afficherListeAppareils() {

    // ---- Retirer la class "fermer-cadre" si boutonAppareils contient la class -----------
    fermerLesListes();

    // ---- Ferme les autres listes déroulantes (ingrédients et ustensiles) avant d'afficher celle des appareils ----
    boutonIngredients.classList.add('fermer-cadre');
    boutonUstensiles.classList.add('fermer-cadre');

    // ---- Extraire tous les appareils des recettes actuelles en utilisant map --------------
    const tousLesAppareils = recettesActuelles.map((recette) => recette.appliance.toLowerCase());

    // ---- Éliminer les doublons en créant un Set (qui ne permet pas les doublons) puis en le convertissant en tableau ----
    const appareilsUniques = Array.from(new Set(tousLesAppareils));

    // ---- Afficher les appareils dans la liste déroulante en utilisant map pour créer un tableau de chaînes de caractères ----
    // ---- représentant chaque élément de la liste, puis en le convertissant en une seule chaîne de caractères avec join('') ----
    cadreTagsAppareils.innerHTML = appareilsUniques.map((appareil) => `<span class="search-tag">${appareil}</span>`).join('');

    // ---- Modifier la classe du bouton pour ajuster la largeur lors de l'affichage de la liste ----
    if (boutonAppareils.classList.contains('largeur-bouton-filtre')) {

        // ---- Enlevez la classe 'largeur-bouton-filtre' et ajoutez la classe 'agrandir-bouton-filtre' pour ajuster la largeur du bouton ----
        boutonAppareils.classList.remove('largeur-bouton-filtre');
        boutonAppareils.classList.add('agrandir-bouton-filtre')
    }
}


//--------------------------------------------------------------------------------------//
//                    Fonction pour afficher la liste des ustensiles                    //
//--------------------------------------------------------------------------------------//


function afficherListeUstensiles() {

    // ---- Retirer la class "fermer-cadre" si boutonUstensiles contient la class ------------
    fermerLesListes();

    // ---- Ferme les autres listes déroulantes (ingrédients et appareils) avant d'afficher celle des ustensiles ----
    boutonIngredients.classList.add('fermer-cadre');
    boutonAppareils.classList.add('fermer-cadre');

    // ---- Extraire tous les ustensiles des recettes actuelles en utilisant flatMap ---------
    const tousLesUstensiles = recettesActuelles.flatMap((recette) => recette.ustensils.map((ustensile) => ustensile.toLowerCase()));

    // ---- Éliminer les doublons en créant un Set (qui ne permet pas les doublons) puis en le convertissant en tableau ----
    const ustensilesUniques = Array.from(new Set(tousLesUstensiles));

    // ---- Afficher les ustensiles dans la liste déroulante en utilisant map pour créer un tableau de chaînes de caractères ----
    // ---- représentant chaque élément de la liste, puis en le convertissant en une seule chaîne de caractères avec join('') ----
    cadreTagsUstensiles.innerHTML = ustensilesUniques.map((ustensile) => `<span class="search-tag">${ustensile}</span>`).join('');

    // ---- Modifier la classe du bouton pour ajuster la largeur lors de l'affichage de la liste ----
    if (boutonUstensiles.classList.contains('largeur-bouton-filtre')) {
    
        // ---- Enlevez la classe 'largeur-bouton-filtre' et ajoutez la classe 'agrandir-bouton-filtre' pour ajuster la largeur du bouton ----
        boutonUstensiles.classList.remove('largeur-bouton-filtre');
        boutonUstensiles.classList.add('agrandir-bouton-filtre')
    }
}


//--------------------------------------------------------------------------------------//
//          Fonction pour ne pas afficher les listes des tags non sélectionnés          //
//--------------------------------------------------------------------------------------//


function fermerLesListes() {
    // ---- Vérifie si le bouton des ingrédients contient la classe "fermer-cadre" -----------
    if (boutonIngredients.classList.contains("fermer-cadre")) {

        // ---- Retire la classe pour fermer la liste déroulante des ingrédients -----------------
        boutonIngredients.classList.remove("fermer-cadre");
    }

    // ---- Vérifie si le bouton des appareils contient la classe "fermer-cadre" -------------
    if (boutonAppareils.classList.contains("fermer-cadre")) {

        // ---- Retire la classe pour fermer la liste déroulante des appareils -------------------
        boutonAppareils.classList.remove("fermer-cadre");
    }

    // ---- Vérifie si le bouton des ustensiles contient la classe "fermer-cadre" ------------
    if (boutonUstensiles.classList.contains("fermer-cadre")) {

    // ---- Retire la classe pour fermer la liste déroulante des ustensiles ------------------
        boutonUstensiles.classList.remove("fermer-cadre");
    }
}

//--------------------------------------------------------------------------------------//
//                        fonction pour vider la liste des tags                         //
//--------------------------------------------------------------------------------------//


function videListe(event) {

    // ---- Vérifie si le clic ne se fait pas sur les éléments inputIngredient et cadreListeTags ----
    if (!inputIngredient.contains(event.target) && !cadreTagsIngredients.contains(event.target)) {

        // ---- Vide le contenu de cadreTagsIngredients ------------------------------------------
        cadreTagsIngredients.innerHTML = "";

        // ---- Vide le contenu de l'input Ingredients -------------------------------------------
        inputIngredient.value = "";

        // ---- Vérifie si boutonIngredients contient la classe "agrandir-bouton-filtre" ---------
        if (boutonIngredients.classList.contains('agrandir-bouton-filtre')) {

            // ---- Modifie la classe du boutonIngredients -------------------------------------------
            boutonIngredients.classList.remove('agrandir-bouton-filtre');
            boutonIngredients.classList.add('largeur-bouton-filtre');
            boutonIngredients.classList.add('fermer-cadre');
        }

    // ---- Vérifie si le clic ne se fait pas sur les éléments inputAppareil et cadreListeTags ----
    } if (!inputAppareil.contains(event.target) && !cadreTagsAppareils.contains(event.target)) {

        // ---- Vide le contenu de cadreTagsAppareils --------------------------------------------
        cadreTagsAppareils.innerHTML ="";

        // ---- Vide le contenu de l'input Appareils -------------------------------------------
        inputAppareil.value = "";
        
        // ---- Vérifie si boutonAppareils contient la classe "agrandir-bouton-filtre" -----------
        if (boutonAppareils.classList.contains('agrandir-bouton-filtre')) {

            // ---- Modifie la classe du boutonAppareils ---------------------------------------------
            boutonAppareils.classList.remove('agrandir-bouton-filtre');
            boutonAppareils.classList.add('largeur-bouton-filtre');
            boutonAppareils.classList.add('fermer-cadre');
        }

    // ---- Vérifie si le clic ne se fait pas sur les éléments inputUstensile et cadreListeTags ----
    } if (!inputUstensile.contains(event.target) && !cadreTagsUstensiles.contains(event.target)) {

        // ---- Vide le contenu de cadreTagsUstensiles -------------------------------------------
        cadreTagsUstensiles.innerHTML = "";

        // ---- Vide le contenu de l'input Ustensiles -------------------------------------------
        inputUstensile.value = "";

        // ---- Vérifie si boutonAppareils contient la classe "agrandir-bouton-filtre" -----------
        if (boutonUstensiles.classList.contains('agrandir-bouton-filtre')) {

            // ---- Modifie la classe du boutonUstensiles --------------------------------------------
            boutonUstensiles.classList.remove('agrandir-bouton-filtre');
            boutonUstensiles.classList.add('largeur-bouton-filtre');
            boutonUstensiles.classList.add('fermer-cadre');
        }
    }
}


//--------------------------------------------------------------------------------------//
//                  On écoute les changements sur l'input de recherche                  //
//--------------------------------------------------------------------------------------//


inputRecherche.addEventListener("input", (event) => {
    const tagSearch = cadreTags.querySelector('.tag-search');

    // Récupère la valeur de l'input et supprime les espaces en début et fin de chaîne
    const texteRecherche = event.target.value.trim();

    if (texteRecherche.length >=3 && !tagSearch) {
        recettesActuelles =lesRecettes;
    }

    // On ne filtre les recettes que si l'utilisateur a tapé au moins 3 lettres 
    if (texteRecherche.length >= 3) {

        // Vérifier si le message d'erreur est présent
        const messageErreur = sectionRecettes.querySelector('.manque-recette');

        // Si le message d'erreur est présent, réinitialiser la recherche
        if (messageErreur) {
            recettesActuelles = lesRecettes;
        }

        // Filtrer les recettes en utilisant la fonction filtrerRecettes
        const recettesFiltrees = filtrerRecettes(texteRecherche, recettesActuelles);
        
        // Comparer la taille des tableaux de recettes avant et après le filtrage
        if (recettesActuelles.length !== recettesFiltrees.length) {
            // Mettre à jour la variable recettesActuelles avec les recettes filtrées
            recettesActuelles = recettesFiltrees;

            // Afficher les recettes filtrées
            afficherRecettes(recettesFiltrees);
        }

    } else if (texteRecherche.length === 0 || (texteRecherche.length === 2 && !tagSearch)) {

        // Vérifie si des tags sont présents dans "cadreTags"
        if (tagSearch) {

            recettesActuelles = lesRecettes; // Ici, on réinitialise recettesActuelles avec la liste complète des recettes

            // Récupérer les tags sélectionnés en les transformant en tableau
            const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());

            // Filtrer les recettes en fonction des tags sélectionnés
            const recettesFiltrees = filterRecettesParTag(tags, texteRecherche);

            // Comparer la taille des tableaux de recettes avant et après le filtrage
            if (recettesActuelles.length !== recettesFiltrees.length) {
                // Mettre à jour la variable recettesActuelles avec les recettes filtrées
                recettesActuelles = recettesFiltrees;

                // Afficher les recettes filtrées
                afficherRecettes(recettesFiltrees);
            }
        } else {
            // Si le texte de recherche est trop court ou vide, et aucun tag n'est sélectionné, on réaffiche toutes les recettes
            recettesActuelles = lesRecettes; // Ici, on réinitialise recettesActuelles avec la liste complète des recettes

            // Afficher toutes les recettes
            afficherRecettes(recettesActuelles);
        }
    }
});

//--------------------------------------------------------------------------------------//
//     Événement pour mettre à jour les ingrédients affichés lors de la saisie dans     //
//                              l'input search-ingredient                               //
//--------------------------------------------------------------------------------------//


inputIngredient.addEventListener('input', () => {
    
    // ---- Récupération du texte de recherche dans l'input ----------------------------------
    const texteRecherche = inputIngredient.value.trim();
    
    // ---- Si la longueur du texte de recherche est inférieure à 3, on vide la liste d'ingrédients filtrés ----
    if (texteRecherche.length < 3) {
        cadreTagsIngredients.innerHTML = '';
        afficherListeIngredients();
        return;
    }
    
    // ---- Filtrage des ingrédients en fonction du texte de recherche -----------------------
    const ingredientsFiltres = filtrerIngredients(texteRecherche);
    
    // ---- Affichage des ingrédients filtrés ------------------------------------------------
    afficherTag(ingredientsFiltres, "ingredients");
});


//--------------------------------------------------------------------------------------//
//  Événement pour mettre à jour les appareils affichés lors de la saisie dans l'input  //
//                                   search-appareil                                    //
//--------------------------------------------------------------------------------------//


inputAppareil.addEventListener('input', () => {

    // ---- Récupération du texte de recherche dans l'input --------------------------------
    const texteRecherche = inputAppareil.value.trim();

    // ---- Si la longueur du texte de recherche est inférieure à 3, on vide la liste des appareils filtrés ----
    if (texteRecherche.length < 3) {
        cadreTagsAppareils.innerHTML = '';
        afficherListeAppareils();
        return;
    }

    // ---- Filtrage des appareils en fonction du texte de recherche -----------------------
    const appareilsFiltres = filtrerAppareils(texteRecherche);

    // ---- Affichage des appareils filtrés ------------------------------------------------
    afficherTag(appareilsFiltres, "appareils");
});


//--------------------------------------------------------------------------------------//
//  Événement pour mettre à jour les ustensiles affichés lors de la saisie dans l'input //
//                                   search-ustensile                                   //
//--------------------------------------------------------------------------------------//


inputUstensile.addEventListener('input', () => {

    // ---- Récupération du texte de recherche dans l'input ----------------------------------
    const texteRecherche = inputUstensile.value.trim();

    // ---- Si la longueur du texte de recherche est inférieure à 3, on vide la liste des ustensiles filtrés ----
    if (texteRecherche.length < 3) {
        cadreTagsUstensiles.innerHTML = '';
        afficherListeUstensiles();
        return;
    }

    // ---- Filtrage des ustensiles en fonction du texte de recherche -----------------------
    const ustensilesFiltres = filtrerUstensiles(texteRecherche);

    // ---- Affichage des ustensiles filtrés ------------------------------------------------
    afficherTag(ustensilesFiltres, "ustensiles");
});


//--------------------------------------------------------------------------------------//
//      Événement pour ajouter un tag à la section cadre-tags lors du clic sur un       //
//                                     ingrédients                                      //
//--------------------------------------------------------------------------------------//


cadreListeIngredients.addEventListener('click', (event) => {
    
    // ---- Si la section "cadre-tags" contient un élément ayant la classe "search-tag" ------
    if(event.target.classList.contains('search-tag')) {
    
        // ---- Appel de la fonction pour ajouter le tag à la section des tags -------------------
        ajouterTag(event.target.textContent, 'ingredient');
    
        // ---- On vide la zone de recherche des ingrédients -------------------------------------
        inputIngredient.value = '';
    
        // ---- Récupérer les tags sélectionnés en les transformant en tableau -------------------
        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());
    
        // ---- Appeler la fonction pour filtrer les recettes avec les tags sélectionnés ---------
        filterRecettesParTag(tags, inputRecherche.value.trim());
    }
})


//--------------------------------------------------------------------------------------//
//  Événement pour ajouter un tag à la section cadre-tags lors du clic sur un appareil  //
//--------------------------------------------------------------------------------------//


cadreListeAppareils.addEventListener('click', (event) => {

    // ---- Si la section "cadre-tags" contient un élément ayant la classe "search-tag" ------
    if (event.target.classList.contains('search-tag')) {

        // ---- Appel de la fonction pour ajouter le tag à la section des tags -------------------
        ajouterTag(event.target.textContent, 'appareil');

        // ---- On vide la zone de recherche des ingrédients -------------------------------------
        inputAppareil.value = '';

        // ---- Récupérer les tags sélectionnés en les transformant en tableau -------------------
        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());

        // ---- Appeler la fonction pour filtrer les recettes avec les tags sélectionnés ---------
        filterRecettesParTag(tags, inputRecherche.value.trim());
    }
});


//--------------------------------------------------------------------------------------//
//  Événement pour ajouter un tag à la section cadre-tags lors du clic sur un ustensile //
//--------------------------------------------------------------------------------------//


cadreListeUstensiles.addEventListener('click', (event) => {

    // ---- Si la section "cadre-tags" contient un élément ayant la classe "search-tag" ------
    if (event.target.classList.contains('search-tag')) {

        // ---- Appel de la fonction pour ajouter le tag à la section des tags -------------------
        ajouterTag(event.target.textContent, 'ustensile');

        // ---- On vide la zone de recherche des ingrédients -------------------------------------
        inputUstensile.value = '';

        // ---- Récupérer les tags sélectionnés en les transformant en tableau -------------------
        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());

        // ---- Appeler la fonction pour filtrer les recettes avec les tags sélectionnés ---------
        filterRecettesParTag(tags, inputRecherche.value.trim());
    }
});


//--------------------------------------------------------------------------------------//
//           Écouteurs d'événements pour afficher les tags ou vider la liste            //
//--------------------------------------------------------------------------------------//


boutonIngredients.addEventListener('click', afficherListeIngredients);
boutonAppareils.addEventListener('click', afficherListeAppareils);
boutonUstensiles.addEventListener('click', afficherListeUstensiles);

window.addEventListener('click', videListe);