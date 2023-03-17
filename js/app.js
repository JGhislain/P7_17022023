//Import du tableau issu du fichier recipes.js

import { recipes } from "../assets/json/recipes.js";

console.log(recipes)

//Appel du DOM nécessaire

const sectionRecettes = document.querySelector('.cadre-recettes');
const cadreTags = document.querySelector('.cadre-tags');
const cadreListeIngredients = document.querySelector('.liste-ingredient');
const cadreListeAppareils = document.querySelector('.liste-appareil');
const cadreListeUstensiles = document.querySelector('.liste-ustensile');
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
    const tagElement = document.createElement('div');
    tagElement.classList.add('liste-tags');
    tagElement.innerHTML = `
    <span class="search-tag">${tag}</span>
    `;
    cadreListeIngredients.appendChild(tagElement);
}

//--------------------------------------------------------------------------------------//
//     Fonction pour afficher les ingrédients dans la section cadreListeIngredients     //
//--------------------------------------------------------------------------------------//


function afficherIngredients(ingredients) {
    cadreListeIngredients.innerHTML = "";
    ingredients.forEach(ingredient => {
        ajouterIngredients(ingredient)
    })
}

//--------------------------------------------------------------------------------------//
//   Fonction pour ajouter un ingrédient à la section cadreTags et le retirer au clic   //
//--------------------------------------------------------------------------------------//


function ajouterIngredientsTag(tag) {
    const tagElement = document.createElement('button');
    tagElement.classList.add('tag-search');
    tagElement.textContent = tag;
    tagElement.addEventListener('click', () => {
        cadreTags.removeChild(tagElement);
    });
    cadreTags.appendChild(tagElement);
}

//--------------------------------------------------------------------------------------//
//           Fonction pour filter les ingrédients en fonction de la recherche           //
//--------------------------------------------------------------------------------------//

let ingredientFiltres = new Set();

function filtrerIngredients(texteRecherche) {
    ingredientFiltres.clear();
    lesRecettes.forEach((recette) => {
        const ingredientsRecette = recette.ingredients.map((ing) => ing.ingredient);
        const ingredientsFiltresRecette = ingredientsRecette.filter((ing) => 
        ing.toLowerCase().includes(texteRecherche.toLowerCase())
        );
        ingredientsFiltresRecette.forEach((ing) => ingredientFiltres.add(ing));
    });
    return [...ingredientFiltres]
}

//--------------------------------------------------------------------------------------//
//     Événement pour mettre à jour les ingrédients affichés lors de la saisie dans     //
//                              l'input search-ingredient                               //
//--------------------------------------------------------------------------------------//

inputIngredient.addEventListener('input', () => {
    const texteRecherche = inputIngredient.value.trim();
    if (texteRecherche.length < 3) {
        cadreListeIngredients.innerHTML = '';
        return;
    }
    const ingredientsFiltres = filtrerIngredients(texteRecherche);
    afficherIngredients(ingredientsFiltres);
});

//--------------------------------------------------------------------------------------//
//      Événement pour ajouter un tag à la section cadre-tags lors du clic sur un       //
//                                     ingrédients                                      //
//--------------------------------------------------------------------------------------//

cadreListeIngredients.addEventListener('click', (event) => {
    if(event.target.classList.contains('search-tag')) {
        ajouterIngredientsTag(event.target.textContent);
        inputIngredient.value = '';
    }
})

//--------------------------------------------------------------------------------------//
//                      Fonction pour filter les recettes par tags                      //
//--------------------------------------------------------------------------------------//

function filterRecettesParTag(tags) {
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

//--------------------------------------------------------------------------------------//
//         Événement pour lancer la fonction pour filtrer les recette par tags          //
//--------------------------------------------------------------------------------------//

cadreTags.addEventListener('click', () => {
    const tags = [...cadreTags.querySelectorAll("button.selected")].map((btn) => btn.textContent.toLowerCase());
    filterRecettesParTag(tags);
});