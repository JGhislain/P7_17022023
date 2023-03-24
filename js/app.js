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
    <article class="encart-recette">
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

//--------------------------------------------------------------------------------------//
//       Fonction pour filtrer les recettes affichées en fonction de la recherche       //
//--------------------------------------------------------------------------------------//

function filtrerRecettes(texteRecherche) {
    // ---- On filtre les recettes dont le nom, la description ou les ingrédients contiennent le texte de recherche ----------------
    const recettesFiltrees = lesRecettes.filter((recette) => {
        const nomRecette = recette.name.toLowerCase();
        const descriptionRecette = recette.description.toLowerCase();
        const ingredientsRecette = recette.ingredients.map((ingredient) => {
            if (typeof ingredient === "object") {
                // ---- Si l'ingrédient est un objet, on renvoie l'ingrédient sous forme de caractère ----
                return Object.values(ingredient).join(" ").toLowerCase();
            } else {
                // ---- Sinon, on renvoie l'ingrédient en minuscule --------------------------------------
                return ingredient.toLowerCase()
            }
        })
        .join(" ");
        const texteRechercheLowerCase = texteRecherche.toLowerCase();
        return nomRecette.includes(texteRechercheLowerCase) || descriptionRecette.includes(texteRechercheLowerCase) || ingredientsRecette.includes(texteRechercheLowerCase);
    });
    // ---- On supprime les recettes qui ne correspondent plus à la recherche ----------------
    sectionRecettes.innerHTML = "";
    recettesFiltrees.forEach((recipe) => {
        const recetteElement = creationRecetteElement(recipe);
        sectionRecettes.innerHTML += recetteElement;
    });
}

// ---- On écoute les changements sur l'input de recherche -------------------------------
inputRecherche.addEventListener("input", (event) => {
    const texteRecherche = event.target.value.trim();
    // Récupérer les tags sélectionnés en les transformant en tableau
    const tagsSelectionnes = Array.from(tags).filter(tag => tag.classList.contains('tag-selected'));
    // ---- On ne filtre les recettes que si l'utilisateur à tapé au moins 3 lettres ---------
    if (texteRecherche.length >= 3) {
        filtrerRecettes(texteRecherche);
    } else {
    // ---- Si le texte de recherche est trop court ou vide, on réaffiche toutes les recettes ----
    sectionRecettes.innerHTML = "";
    lesRecettes.forEach((recipe) => {
        const recetteElement = creationRecetteElement(recipe);
        sectionRecettes.innerHTML += recetteElement;
    });
    }
});


//--------------------------------------------------------------------------------------//
//       Fonction pour ajouter les ingrédients à la section cadreListeIngrédients       //
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
//     Fonction pour afficher les ingrédients dans la section cadreListeIngredients     //
//--------------------------------------------------------------------------------------//


function afficherIngredients(ingredients) {
    // ---- Suppression du HTML précédent de la section "cadreListeIngredients" --------------
    cadreListeTags.innerHTML = "";
    // ---- Pour chaque ingrédient dans le tableau "ingredients", on appelle la fonction "ajouterIngredients" pour l'ajouter à la section ----
    ingredients.forEach(ingredient => {
        ajouterIngredients(ingredient)
    })
}

//--------------------------------------------------------------------------------------//
//   Fonction pour ajouter un ingrédient à la section cadreTags et le retirer au clic   //
//--------------------------------------------------------------------------------------//


function ajouterIngredientsTag(tag) {
    // ---- Création d'un élément span pour chaque ingrédient --------------------------------
    const tagElement = document.createElement('span');
    // ---- Ajout de la classe "tag-search" --------------------------------------------------
    tagElement.classList.add('tag-search');
    // ---- Ajout du nom de l'ingrédient dans l'élément --------------------------------------
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
        });
    });
    // ---- Ajout de l'élément span créé à la section "cadreTags" ----------------------------
    cadreTags.appendChild(tagElement);
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
    afficherIngredients(ingredientsFiltres);
});

//--------------------------------------------------------------------------------------//
//      Événement pour ajouter un tag à la section cadre-tags lors du clic sur un       //
//                                     ingrédients                                      //
//--------------------------------------------------------------------------------------//

cadreListeIngredients.addEventListener('click', (event) => {
    // ---- Si la section "cadre-tags" contient un élément ayant la classe "search-tag" ------
    if(event.target.classList.contains('search-tag')) {
        // ---- Appel de la fonction pour ajouter le tag à la section des tags -------------------
        ajouterIngredientsTag(event.target.textContent);
        // ---- On vide la zone de recherche des ingrédients -------------------------------------
        inputIngredient.value = '';
        // ---- Récupérer les tags sélectionnés en les transformant en tableau -------------------
        const tags = [...cadreTags.querySelectorAll(".tag-search")].map((btn) => btn.textContent.toLowerCase());
        // ---- Appeler la fonction pour filtrer les recettes avec les tags sélectionnés ---------
        filterRecettesParTag(tags);
    }
})

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
}

// ---- Sélectionner les tags ------------------------------------------------------------

const tags = document.querySelectorAll('.tag');

//--------------------------------------------------------------------------------------//
//               Fonction pour filtrer les recettes en fonction des Tags                //
//--------------------------------------------------------------------------------------//


function filtrerRecettesAvecTags() {
    // ---- Récupérer les tags sélectionnés --------------------------------------------------
    const tagsSelectionnes = Array.from(tags).filter(tag => tag.classList.contains('tag-selected'));
    // ---- Transformer les tags sélectionnés en minuscules ----------------------------------
    const nomsTags = tagsSelectionnes.map(tag => tag.innerText.toLowerCase());
    // ---- Filtrer les recettes en fonction des tags sélectionnés ---------------------------
    const recettesFiltrees = lesRecettes.filter(recette => {
        // ---- Vérifier si chaque tag sélectionné est présent dans la recette -------------------
        return nomsTags.every(tag => {
            const estIngredient = recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tag));
            const estAppareil = recette.appliance.toLowerCase().includes(tag);
            const estUstensile = recette.ustensils.some(ustensile => ustensile.toLowerCase().includes(tag));
            return estIngredient || estAppareil || estUstensile;
        });
    });

    // ---- Mettre à jour la liste des recettes ----------------------------------------------

    sectionRecettes.innerHTML = "";
    recettesFiltrees.forEach((recipe) => {
    const recetteElement = creationRecetteElement(recipe);
    sectionRecettes.innerHTML += recetteElement;
  });
}

//--------------------------------------------------------------------------------------//
//    Événement d'écoute sur l'input de recherche en fonction de la présence de tag     //
//--------------------------------------------------------------------------------------//

inputRecherche.addEventListener('input', () => {
    // Récupérer les tags sélectionnés en les transformant en tableau
    const tagsSelectionnes = Array.from(tags).filter(tag => tag.classList.contains('tag-selected'));
  
    // Si des tags sont sélectionnés, filtrer les recettes en fonction des tags sélectionnés
    if (tagsSelectionnes.length > 0) {
      filtrerRecettesAvecTags(tagsSelectionnes);
    } else {
      // Sinon, filtrer les recettes en fonction de la barre de recherche principale
      filtrerRecettes();
    }
  });