//Import du tableau issu du fichier recipes.js

import { recipes } from "../assets/json/recipes.js";

console.log(recipes)

//Appel du DOM nécessaire

const sectionRecettes = document.querySelector('.cadre-recettes')


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
const ings = recipes.map((recipe) => {
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
            return `<li class="liste-ingredients"><b>${ing.ingredient}</b>: ${ing.quantity} ${ing.unit}</li>`
        } else if (ing.quantity) {
            return `<li class="liste-ingredients"><b>${ing.ingredient}</b>: ${ing.quantity}</li>`
        } else if (ing.unit) {
          return `<li class="liste-ingredients"><b>${ing.ingredient}</b>: ${ing.unit}</li>`
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
                <p class="description-recette">${recipe.description}</p>
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