async function getRecettes() {
    try{
        const reponse = await fetch ('recipes.json');
        const recettes = await reponse.json();
       return(recettes);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
     }
    
}
class IndexPage{
    constructor(recettes){
        this.recettes = recettes; 
        document.getElementById('searhButton').addEventListener('click', ()=>{
            const input = document.getElementById('input1');
            if(input.value.length>=3){
                this.recherche(input.value)
            }
        })
    }
    // la methode ftatMap permet de extraire les ingredients des tab et aussi de creer un tableau contient les 
       //elements des sous tableau du tableau  
       // new set permet d'elever la repetition des elements 
    get ingredients(){
         return([...new Set(this.recettes.map(recette=> recette.ingredients).flatMap(innerArray => innerArray.map(obj => obj.ingredient)))])
    }
    get Appareils(){
        return([...new Set(this.recettes.map(recette=> recette.appliance))])
    }
    get ustensils(){
        return([...new Set(this.recettes.map(recette=> recette.ustensils).flat())])
    }
    get titres(){
        return (this.recettes.map(recette=>recette.name))
    }
    get descriptions(){
        return(this.recettes.map(recette=>recette.description))
    }
    get ingredientsElements(){
        return(this.recettes.map(recette=> recette.ingredients))
    }
    displayListe(){
       
         let map ={
            "ingredients": this.ingredients,
            "Appareils": this.Appareils,
            "Ustensiles": this.ustensils
         }
        for (let key in map){
            let liste = new ListeDom(map[key],key );
            liste.getListe();
        }
    }
    displayData(){
        const recettesSection = document.querySelector(".sectionCard");
    
        this.recettes.forEach((recette) => {
            const recetteModel =new Card(recette);
            const CardDom = recetteModel.getCardRecette();
            recettesSection.appendChild(CardDom);
        });
    
        const nbrRecettes = this.recettes.length;
        const domNbrRecettes = document.querySelector('.fontStyle');
        domNbrRecettes.textContent = `${nbrRecettes} recettes`;
    }
    listeIngredients (ingredientsElement, expression){
        let existe = false ; 
        let i = 0 ; 
        while(i<ingredientsElement[i].length && existe == false){
            if(ingredientsElement[i].toLowerCase().includes(expression)){
                existe = true;
            }
            i = i+1;
        }
        return(existe)
    }
    recherche(expression){
        let tabIncludes = [];
        let tabId = [];
        for(let i=0; i< this.titres.length; i++){
            if ((this.titres[i].toLowerCase().includes(expression)) || 
            (this.descriptions[i].toLowerCase().includes(expression)) || (this.listeIngredients(this.ingredientsElements[i], expression)) ){
                tabIncludes.push(this.titres[i]);
                tabId.push(i+1);
            }
        }
        console.log(tabIncludes)
        console.log(tabId)
        if(tabId.length == 0){
            alert(`Aucune recette ne contient " ${expression} " vous pouvez chercher (tarte aux pommes)`)
            console.log(tabId == [])
        }else{
            return(this.supprimeCard(tabId))
        }
        
    }
    supprimeCard(tab){
        for(let i=0 ; i<50; i++){
            if((tab.includes(i+1))==false ){
                document.getElementById(i+1).remove();
            }
        }
    }
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
    const indexpage = new IndexPage(recettes)
    indexpage.displayData()
    indexpage.displayListe()
    // const titres = recettes.map(recette=>recette.name);
    // console.log(titres)
    // const descriptions = recettes.map(recette=>recette.description);
    // console.log(descriptions)
    // const ingredientsElements = recettes.map(recette=> recette.ingredients);
    // console.log(ingredientsElements)
    // document.getElementById('searhButton').addEventListener('click', ()=>{
    //     const input = document.getElementById('input1');
    //     if(input.value.length>=3){
    //         recherche(titres, descriptions ,ingredientsElements,input.value)
    //     }
    // })
    // recherche(titres, descriptions ,ingredientsElements , "limonade");
    // let tab = recherche(titres, descriptions ,ingredientsElements ,"limonade");
    // supprimeCard(tab);
}
init()