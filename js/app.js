//Import du tableau issu du fichier recipes.js

import { recipes } from "../assets/json/recipes.js";

console.log(recipes)

//Appel du DOM nécessaire

const sectionRecettes = document.querySelector('.cadre-recettes');
const cadreTags = document.querySelector('.cadre-tags');
const cadreListeIngredients = document.querySelector('.liste-ingredient');
const cadreListeAppareils = document.querySelector('.liste-appareil');
const cadreListeUstensiles = document.querySelector('.liste-ustensile');
const cadreListeTags = document.querySelector('.liste-tags');
const cadreTagsIngredients = document.querySelector('.tags-ingredients');
const cadreTagsAppareils = document.querySelector('.tags-appareils');
const cadreTagsUstensiles = document.querySelector('.tags-ustensiles');
const inputRecherche = document.querySelector('.search-bar');
const inputIngredient = document.querySelector('.search-ingredient');
const inputAppareil = document.querySelector('.search-appareil');
const inputUstensile = document.querySelector('.search-ustensile');


//--------------------------------------------------------------------------------------//
//                       Factory pour créer des objets de recette                       //
//--------------------------------------------------------------------------------------//
class RecetteFactory {
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
const lesRecettes = recipes.map((recipe) => {
    const { id, name, servings, ingredients, time, description, appliance, ustensils} = recipe;
    return recetteFactory.creationRecette({ id, name, servings, ingredients, time, description, appliance, ustensils});
});


//--------------------------------------------------------------------------------------//
//                 Fonction pour intégrer un élément HTML d'une recette                 //
//--------------------------------------------------------------------------------------//

function creationRecetteElement(recipe) {

    // ---- Cibler les ingrédients et ses quantités ------------------------------------------
    const ingredientsListe = recipe.ingredients.map((ing) => {
        if (ing.quantity && ing.unit) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.quantity} ${ing.unit}</span></li>`
        } else if (ing.quantity) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.quantity}</span></li>`
        } else if (ing.unit) {
          return `<li class="liste-ingredients"><b>${ing.ingredient}:</b><span class="quantite-ingredients"> ${ing.unit}</span></li>`
        } else {
          return `<li class="liste-ingredients"><b>${ing.ingredient}</b></li>`
        }
    }).join('');

    return `
    <article class="encart-recette" data-id="${recipe.id}">
        <div class="cadre-photo-recette"></div>
        <div class="recette">
            <div class="cadre-titre-ingredients">
                <h2 class="titre-recette">${recipe.name}</h2>
                <ul class="ingredients-recette">${ingredientsListe}</ul>
            </div>
            <div class="cadre-temps-description">
                <div class="cadre-temps">
                    <i class="fa-regular fa-clock"></i>
                    <p class="temps-recette">${recipe.time} min</p>
                </div>
                <div class="cadre-description-recette">
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

lesRecettes.forEach((recipe) => {
    const recetteElement = creationRecetteElement(recipe);
    sectionRecettes.innerHTML += recetteElement;
});

// ---- Variable global qui stock les recettes actuellement affichées --------------------
let recettesActuelles = lesRecettes;

//--------------------------------------------------------------------------------------//
//       Fonction pour filtrer les recettes affichées en fonction de la recherche       //
//--------------------------------------------------------------------------------------//

function filtrerRecettes(texteRecherche, recettes = lesRecettes) {

    // ---- On filtre les recettes dont le nom, la description ou les ingrédients contiennent le texte de recherche ----------------
    const recettesFiltrees = recettes.filter((recette) => {

        // ---- Convertir le nom et la description de la recette en minuscule; -------------------
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
//                  On écoute les changements sur l'input de recherche                  //
//--------------------------------------------------------------------------------------//

inputRecherche.addEventListener("input", (event) => {
    const texteRecherche = event.target.value.trim();

    // ---- On ne filtre les recettes que si l'utilisateur a tapé au moins 3 lettres ---------
    if (texteRecherche.length >= 3) {
        const recettesFiltrees = filtrerRecettes(texteRecherche, recettesActuelles);
        afficherRecettes(recettesFiltrees);
    } else {
        // ---- Si le texte de recherche est trop court ou vide, on réaffiche toutes les recettes ----
        afficherRecettes(recettesActuelles);
    }
});


//--------------------------------------------------------------------------------------//
//                      Fonction pour afficher toutes les recettes                      //
//--------------------------------------------------------------------------------------//


function afficherRecettes(recettes) {
sectionRecettes.innerHTML = "";
recettes.forEach((recipe) => {
    const recetteElement = creationRecetteElement(recipe);
    sectionRecettes.innerHTML += recetteElement;
});
}

//--------------------------------------------------------------------------------------//
//       Fonction pour ajouter les ingrédients à la section cadreListeTags              //
//--------------------------------------------------------------------------------------//


function ajouterIngredients(tag) {
    // ---- Création d'un élément Div pour chaque ingrédient ---------------------------------
    const tagElement = document.createElement('span');
    // ---- Ajout de la classe "liste-tags" pour l'élément div créé --------------------------
    tagElement.classList.add('search-tag');
    // ---- Ajout du HTML dans l'élément div créé, avec le nom de l'ingrédient ---------------
    tagElement.textContent = tag;
    // ---- Ajout de l'élément div créé à la section "cadreListeIngredients" -----------------
    cadreListeTags.appendChild(tagElement);
}

//--------------------------------------------------------------------------------------//
//     Fonction pour afficher les tags dans la section cadreListeTags                   //
//--------------------------------------------------------------------------------------//


function afficherTag(ingredients) {
    // ---- Suppression du HTML précédent de la section "cadreListeIngredients" --------------
    cadreListeTags.innerHTML = "";
    // ---- Pour chaque ingrédient dans le tableau "ingredients", on appelle la fonction "ajouterIngredients" pour l'ajouter à la section ----
    ingredients.forEach(ingredient => {
        ajouterIngredients(ingredient)
    })
}

//--------------------------------------------------------------------------------------//
//   Fonction pour ajouter un tag à la section cadreTags et le retirer au clic   //
//--------------------------------------------------------------------------------------//


function ajouterTag(tag) {
    // ---- Création d'un élément span pour chaque tag ---------------------------------------
    const tagElement = document.createElement('span');

    // ---- Ajout de la classe "tag-search" --------------------------------------------------
    tagElement.classList.add('tag-search');

    // ---- Ajout du nom de l'ingrédient/ustensil/appareil dans l'élément --------------------
    tagElement.textContent = tag;
    
    // ---- Création d'un élément i pour l'icone de suppression ------------------------------
    const xIcone = document.createElement('i');
    
    // ---- Ajout des classes pour l'icone de suppression ------------------------------------
    xIcone.classList.add('fas', 'fa-times', 'icone-fermeture');
    
    // ---- Ajout de l'icone de suppression --------------------------------------------------
    tagElement.appendChild(xIcone);
    
    // ---- Ajout d'un événement au clic sur l'icone de suppression pour retirer l'élément ----
    xIcone.addEventListener('click', () => {
    
        // ---- Supprime l'élément span créé au clic sur l'icone ---------------------------------
        cadreTags.removeChild(tagElement);
    
        // ---- On supprime les recettes qui ne correspondent plus à la recherche ----------------
        sectionRecettes.innerHTML = "";
        lesRecettes.forEach((recipe) => {
            const recetteElement = creationRecetteElement(recipe);
            sectionRecettes.innerHTML += recetteElement;
            recettesActuelles = lesRecettes;
        });
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


let appareilFiltres = new Set();

function filtrerAppareils(texteRecherche) {
    appareilFiltres.clear();
    lesRecettes.forEach((recette) => {
        if (recette.appliance.toLowerCase().includes(texteRecherche.toLowerCase())) {
            appareilFiltres.add(recette.appliance);
        }
    });
    return [...appareilFiltres];
}

//--------------------------------------------------------------------------------------//
//           Fonction pour filtrer les ustensiles en fonction de la recherche           //
//--------------------------------------------------------------------------------------//


let ustensileFiltres = new Set();

function filtrerUstensiles(texteRecherche) {
    ustensileFiltres.clear();
    lesRecettes.forEach((recette) => {
        const ustensilesRecette = recette.ustensils;
        const ustensilesFiltresRecette = ustensilesRecette.filter((ustensile) => 
            ustensile.toLowerCase().includes(texteRecherche.toLowerCase())
        );
        ustensilesFiltresRecette.forEach((ustensile) => ustensileFiltres.add(ustensile));
    });
    return [...ustensileFiltres];
}

//--------------------------------------------------------------------------------------//
//     Événement pour mettre à jour les ingrédients affichés lors de la saisie dans     //
//                              l'input search-ingredient                               //
//--------------------------------------------------------------------------------------//

// ---- Sélection de l'élément input search-ingredient -----------------------------------
inputIngredient.addEventListener('input', () => {
    // ---- Récupération du texte de recherche dans l'input ----------------------------------
    const texteRecherche = inputIngredient.value.trim();
    // ---- Si la longueur du texte de recherche est inférieure à 3, on vide la liste d'ingrédients filtrés ----
    if (texteRecherche.length < 3) {
        cadreListeTags.innerHTML = '';
        return;
    }
    // ---- Filtrage des ingrédients en fonction du texte de recherche -----------------------
    const ingredientsFiltres = filtrerIngredients(texteRecherche);
    // ---- Affichage des ingrédients filtrés ------------------------------------------------
    afficherTag(ingredientsFiltres);
});


//--------------------------------------------------------------------------------------//
//  Événement pour mettre à jour les appareils affichés lors de la saisie dans l'input  //
//                                   search-appareil                                    //
//--------------------------------------------------------------------------------------//

inputAppareil.addEventListener('input', () => {
    const texteRecherche = inputAppareil.value.trim();
    if (texteRecherche.length < 3) {
        cadreListeTags.innerHTML = '';
        return;
    }
    const appareilsFiltres = filtrerAppareils(texteRecherche);
    afficherTag(appareilsFiltres);
});

//--------------------------------------------------------------------------------------//
//  Événement pour mettre à jour les ustensiles affichés lors de la saisie dans l'input //
//                                   search-ustensile                                   //
//--------------------------------------------------------------------------------------//


inputUstensile.addEventListener('input', () => {
    const texteRecherche = inputUstensile.value.trim();
    if (texteRecherche.length < 3) {
        cadreListeTags.innerHTML = '';
        return;
    }
    const ustensilesFiltres = filtrerUstensiles(texteRecherche);
    afficherTag(ustensilesFiltres);
});

//--------------------------------------------------------------------------------------//
//      Événement pour ajouter un tag à la section cadre-tags lors du clic sur un       //
//                                     ingrédients                                      //
//--------------------------------------------------------------------------------------//

cadreListeIngredients.addEventListener('click', (event) => {

    // ---- Si la section "cadre-tags" contient un élément ayant la classe "search-tag" ------
    if(event.target.classList.contains('search-tag')) {

        // ---- Appel de la fonction pour ajouter le tag à la section des tags -------------------
        ajouterTag(event.target.textContent);

        // ---- On vide la zone de recherche des ingrédients -------------------------------------
        inputIngredient.value = '';
        cadreListeTags.innerHTML = '';

        // ---- Récupérer les tags sélectionnés en les transformant en tableau -------------------
        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());
        
        // ---- Appeler la fonction pour filtrer les recettes avec les tags sélectionnés ---------
        filterRecettesParTag(tags);
    }
})


//--------------------------------------------------------------------------------------//
//  Événement pour ajouter un tag à la section cadre-tags lors du clic sur un appareil  //
//--------------------------------------------------------------------------------------//

cadreListeAppareils.addEventListener('click', (event) => {
    if (event.target.classList.contains('search-tag')) {
        ajouterTag(event.target.textContent);
        inputAppareil.value = '';
        cadreListeTags.innerHTML = '';

        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());
        filterRecettesParTag(tags);
    }
});

//--------------------------------------------------------------------------------------//
//  Événement pour ajouter un tag à la section cadre-tags lors du clic sur un appareil  //
//--------------------------------------------------------------------------------------//


cadreListeUstensiles.addEventListener('click', (event) => {
    if (event.target.classList.contains('search-tag')) {
        ajouterTag(event.target.textContent);
        inputUstensile.value = '';
        cadreListeTags.innerHTML = '';

        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());
        filterRecettesParTag(tags);
    }
});

//--------------------------------------------------------------------------------------//
//                      Fonction pour filter les recettes par tags                      //
//--------------------------------------------------------------------------------------//


function filterRecettesParTag(tags) {
    // ---- Filtrer les recettes en fonction des tags sélectionnés ---------------------------
    const recettesFiltrees = lesRecettes.filter((recette) => {
        // ---- Vérifie si chaque tag est inclus dans les ingrédients, les appareils ou les ustensiles de la recette ----
        const ingredients = recette.ingredients.map((ing) => ing.ingredient.toLowerCase());
        const appareils = [recette.appliance.toLowerCase()];
        const ustensiles = recette.ustensils.map((ustensile) => ustensile.toLowerCase());
        return tags.every((tag) => [...ingredients, ...appareils, ...ustensiles].includes(tag.toLowerCase()));
    });
    // ---- Afficher les recettes filtrées ---------------------------------------------------
    sectionRecettes.innerHTML = recettesFiltrees.map((recette) => creationRecetteElement(recette)).join("");
    recettesActuelles = recettesFiltrees;
}


//--------------------------------------------------------------------------------------//
//                   Fonction pour afficher la liste des ingrédients                    //
//--------------------------------------------------------------------------------------//


function afficherListeIngredients() {
    // Extraire tous les ingrédients de toutes les recettes
    const tousLesIngredients = recettesActuelles.flatMap((recette) => {
        return recette.ingredients.map((ingredient) => {
            if (typeof ingredient === 'object') {
                return ingredient.ingredient.toLowerCase();
            } else {
                return ingredient.toLowerCase();
            }
        });
    });
    
    // Éliminer les doublons en créant un Set (qui ne permet pas les doublons) puis en le convertissant en tableau
    const ingredientsUniques = Array.from(new Set(tousLesIngredients));

    // Afficher les ingrédients dans la liste déroulante
    cadreTagsIngredients.innerHTML = ingredientsUniques.map((ingredient) => `<span class="search-tag">${ingredient}</span>`).join('');
}

//--------------------------------------------------------------------------------------//
//                    Fonction pour afficher la liste des appareils                     //
//--------------------------------------------------------------------------------------//


function afficherListeAppareils() {
    const tousLesAppareils = recettesActuelles.map((recette) => recette.appliance.toLowerCase());
    const appareilsUniques = Array.from(new Set(tousLesAppareils));
    cadreTagsAppareils.innerHTML = appareilsUniques.map((appareil) => `<span class="search-tag">${appareil}</span>`).join('');
}

//--------------------------------------------------------------------------------------//
//                    Fonction pour afficher la liste des ustensiles                    //
//--------------------------------------------------------------------------------------//


function afficherListeUstensiles() {
    const tousLesUstensiles = recettesActuelles.flatMap((recette) => recette.ustensils.map((ustensile) => ustensile.toLowerCase()));
    const ustensilesUniques = Array.from(new Set(tousLesUstensiles));
    cadreTagsUstensiles.innerHTML = ustensilesUniques.map((ustensile) => `<span class="search-tag">${ustensile}</span>`).join('');
}


//--------------------------------------------------------------------------------------//
//                        fonction pour vider la liste des tags                         //
//--------------------------------------------------------------------------------------//


function videListe(event) {
    if (!inputIngredient.contains(event.target) && !cadreListeTags.contains(event.target)) {
        cadreTagsIngredients.innerHTML = "";
    } if (!inputAppareil.contains(event.target) && !cadreListeTags.contains(event.target)) {
        cadreTagsAppareils.innerHTML ="";
    } if (!inputUstensile.contains(event.target) && !cadreListeTags.contains(event.target)) {
        cadreTagsUstensiles.innerHTML = "";
    }
}

//--------------------------------------------------------------------------------------//
//           Écouteurs d'évéenements pour afficher les tags ou vider la liste           //
//--------------------------------------------------------------------------------------//


inputIngredient.addEventListener('focus', afficherListeIngredients);
inputAppareil.addEventListener('focus', afficherListeAppareils);
inputUstensile.addEventListener('focus', afficherListeUstensiles);

window.addEventListener('click', videListe);