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

recipes.forEach((recipe) => {
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
//         Création d'un tableau regroupant tous les ingrédients sans doublons          //
//--------------------------------------------------------------------------------------//

const listeIngredients = [];

recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
        const foundIngredient = listeIngredients.filter(item => item.ingredient === ingredient.ingredient);
        if (foundIngredient.length === 0) {
            listeIngredients.push(ingredient)
        }
    });
});

//--------------------------------------------------------------------------------------//
//  Insertion des ingrédients dans le bouton de recherche dans la barre de navigation   //
//--------------------------------------------------------------------------------------//

/*listeIngredients.forEach(ingredient => {
    const ingredientText = document.createTextNode(ingredient.ingredient);
    const ingredientItem = document.createElement('a');
    ingredientItem.classList.add("tag-ingredient", "tag-liste");
    ingredientItem.setAttribute("href", "");
    ingredientItem.appendChild(ingredientText);
    cadreListeIngredients.appendChild(ingredientItem);
})*/

//--------------------------------------------------------------------------------------//
//         Création d'un tableau regroupant tous les appareils sans doublons          //
//--------------------------------------------------------------------------------------//

const listeAppareils = [];

recipes.forEach(recipe => {
    const foundAppareil = listeAppareils.find(appareil => appareil === recipe.appliance);
    if (!foundAppareil) {
        listeAppareils.push(recipe.appliance)
    }
});

//--------------------------------------------------------------------------------------//
//  Insertion des appareils dans le bouton de recherche dans la barre de navigation   //
//--------------------------------------------------------------------------------------//

/*listeAppareils.forEach(appareil => {
    const appareilText = document.createTextNode(appareil);
    const appareilItem = document.createElement('a');
    appareilItem.classList.add("tag-appareil", "tag-liste");
    appareilItem.setAttribute("href", "");
    appareilItem.appendChild(appareilText);
    cadreListeAppareils.appendChild(appareilItem);
})*/

//--------------------------------------------------------------------------------------//
//         Création d'un tableau regroupant tous les ustensiles sans doublons          //
//--------------------------------------------------------------------------------------//

const listeUstensiles = [];

recipes.forEach(recipe => {
    recipe.ustensils.forEach(ustensile => {
        const foundUstensile = listeUstensiles.find(item => item === ustensile);
        if (!foundUstensile) {
            listeUstensiles.push(ustensile)
        }
    });
});

//--------------------------------------------------------------------------------------//
//  Insertion des appareils dans le bouton de recherche dans la barre de navigation   //
//--------------------------------------------------------------------------------------//

/*listeUstensiles.forEach(ustensile => {
    const ustensileText = document.createTextNode(ustensile);
    const ustensileItem = document.createElement('a');
    ustensileItem.classList.add("tag-ustensile", "tag-liste");
    ustensileItem.setAttribute("href", "");
    ustensileItem.appendChild(ustensileText);
    cadreListeUstensiles.appendChild(ustensileItem);
})*/