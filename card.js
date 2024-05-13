async function getRecettes() {
    try{
        const reponse = await fetch ('recipes.json');
        const recettes = await reponse.json();
       return(recettes);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
     }
    
}

async function displayData(recettes) {
    const recettesSection = document.querySelector(".sectionCard");

    recettes.forEach((recette) => {
        const recetteModel =new Card(recette);
        const CardDom = recetteModel.getCardRecette();
        recettesSection.appendChild(CardDom);
    });

    const nbrRecettes = recettes.length;
    const domNbrRecettes = document.querySelector('.fontStyle');
    domNbrRecettes.textContent = `${nbrRecettes} recettes`;
}
class Card{
    constructor(data){
        this.name = data.name;
        this.image = data.image;
        this.description = data.description;
        this.time = data.time;
        this.ingredients = data.ingredients;
        this.id = data.id;
      }
    get picture (){
        return(`Photos\ P7\ JS\ Les\ petits\ plats/${this.image}`)
    }
    template(idTemplate){
        const template = document.getElementById(idTemplate);
        const clone = document.importNode(template.content,true);
        return(clone)
    }
    elementliste(ingredient, quantity, unit){
        const clone = this.template('templateElementListe');
        const ingredientElement = clone.querySelector('.dom-ingredient');
        ingredientElement.textContent = ingredient;
        const quantityElement = clone.querySelector('.dom-unit');
        if(unit != null){
            if(unit == "cuillères à soupe"){
                quantityElement.textContent = `${quantity} ${unit}`;
            }else{
                quantityElement.textContent = `${quantity}${unit}`;
            }    
        }else{
            quantityElement.textContent = quantity;
        }
        return(clone)
    }
    getCardRecette(){
        const clone = this.template('templateCard');
        const elementParent = clone.querySelector('div');
        elementParent.setAttribute('id', this.id);
        const titre = clone.querySelector('.dom-titre');
        titre.textContent = this.name;
        const image = clone.querySelector('img');
        image.setAttribute("src", this.picture);
        image.setAttribute("alt", this.name);
        const Time = clone.querySelector('.time-block');
        Time.textContent = `${this.time}min`;
        const desc= clone.querySelector('.dom-description');
        desc.textContent = this.description;
        const liste = clone.querySelector('ul');
        for(let i=0; i<this.ingredients.length; i++){
            let element = this.elementliste(this.ingredients[i].ingredient, this.ingredients[i].quantity, this.ingredients[i].unit);
            liste.appendChild(element);
        }
        return(clone)
    }
}
async function init() {
    // Récupère les datas des photographes
    const recettes = await getRecettes();
    // la methode ftatMap permet de extraire les ingredients des tab et aussi de creer un tableau contient les 
    //elements des sous tableau du tableau  
    // new set permet d'elever la repetition des elements 
    const ingredients =[...new Set(recettes.map(recette=> recette.ingredients).flatMap(innerArray => innerArray.map(obj => obj.ingredient)))];
    console.log(ingredients);
    //remplir les listes 
    //liste ingredients
    const liste = new ListeDom(ingredients, "ingredients");
    liste.getListe();
    // liste appareils
    const Appareils =[...new Set(recettes.map(recette=> recette.appliance))];
    const listeA = new ListeDom(Appareils, "Appareils");
    listeA.getListe();
    //liste ustentiels 
    const ustentiels =[...new Set(recettes.map(recette=> recette.ustensils).flat())];
    const listeU = new ListeDom(ustentiels, "Ustensiles");
    listeU.getListe();
    
    displayData(recettes);
    const titres = recettes.map(recette=>recette.name);
    console.log(titres)
    const descriptions = recettes.map(recette=>recette.description);
    console.log(descriptions)
    const ingredientsElements = recettes.map(recette=> recette.ingredients);
    console.log(ingredientsElements)
    document.getElementById('searhButton').addEventListener('click', ()=>{
        const input = document.getElementById('input1');
        if(input.value.length>=3){
            recherche(titres, descriptions ,ingredientsElements,input.value)
        }
    })

    // recherche(titres, descriptions ,ingredientsElements , "limonade");
    // let tab = recherche(titres, descriptions ,ingredientsElements ,"limonade");
    // supprimeCard(tab);
}
init()