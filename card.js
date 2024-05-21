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
        this.recettesAfficher = [];
        this.tabId = [];
        this.listTagSelect = [];
        this.inputPrincipale = document.getElementById('input1');
        document.getElementById('searhButton').addEventListener('click', ()=>{
            this.btnRecherchePrincipale()
        })
        this.inputPrincipale.addEventListener('keydown',(e)=>{
            if(e.key == "Enter"){
                this.btnRecherchePrincipale()
            }
        })
        this.inputPrincipale.addEventListener('input', ()=>{
            this.backToInitial()
        })
        document.getElementById('clearBtnInput1').addEventListener('click',()=>{
            this.backToInitial()
        })
        // pour faire revenir la liste à son etat intial 
        document.querySelectorAll('.liste-block input').forEach((element)=>element.addEventListener('input',(e)=>{
             if(e.currentTarget.value == ''){
                this.displayListe()
             }
        }))
    }
    btnRecherchePrincipale(){
        const input = document.getElementById('input1');
        if(input.value.length>=3){
            this.recherche(input.value.toLowerCase())
            // j'ai oblié pourquoi j'ai ajouter cette ligne
            // this.tabId=[]
        }
    }
    backToInitial(){
        if(this.inputPrincipale.value == ''){
            this.tabId = [];
            this.displayData();
            this.displayListe();
        }
    }
    getERecettesAfficher(){
        if(this.tabId.length>0){
            this.recettesAfficher = this.recettes.filter((recette)=>this.tabId.includes(recette.id))
        }else{
            this.recettesAfficher = this.recettes
        }
    }
    // la methode ftatMap permet de extraire les ingredients des tab et aussi de creer un tableau contient les 
       //elements des sous tableau du tableau  
       // new set permet d'elever la repetition des elements 
    get ingredients(){
         return([...new Set(this.recettesAfficher.map(recette=> recette.ingredients).flatMap(innerArray => innerArray.map(obj => obj.ingredient)))])
    }
    get Appareils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.appliance))])
    }
    get ustensils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.ustensils).flat())])
    }
    get titres(){
        return (this.recettesAfficher.map(recette=>recette.name))
    }
    get descriptions(){
        return(this.recettesAfficher.map(recette=>recette.description))
    }
    get ingredientsElements(){
        return(this.recettesAfficher.map(recette=> recette.ingredients))
    }
    displayListe(){
       this.getERecettesAfficher();
         let map ={
            "ingredients": this.ingredients,
            "Appareils": this.Appareils,
            "Ustensiles": this.ustensils
         }
        for (let key in map){
            let liste = new ListeDom(map[key],key );
            liste.getListe();
            // liste.choixOption(this.rechercheTag.bind(this))
        }
        
         document.querySelectorAll('li[type="button"]').forEach((element)=>{element.addEventListener('click', this.rechercheTag.bind(this))})
    }
    displayData(){
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        this.getERecettesAfficher();
        this.recettesAfficher.forEach((recette) => {
            const recetteModel =new Card(recette);
            const CardDom = recetteModel.getCardRecette();
            recettesSection.appendChild(CardDom);
        });
    
        const nbrRecettes = this.recettesAfficher.length;
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
        this.getERecettesAfficher();
        for(let i=0; i< this.titres.length; i++){
            if ((this.titres[i].toLowerCase().includes(expression)) || 
            (this.descriptions[i].toLowerCase().includes(expression)) || (this.listeIngredients(this.ingredientsElements[i], expression)) ){
                // tabIncludes.push(this.titres[i]);
                tabIncludes.push(i+1)
            }
        }
        console.log(tabIncludes)
        if(this.tabId.length == 0){
            this.tabId = tabIncludes
        }else{
            this.tabId = [];
            this.tabId = tabIncludes
        }
        console.log(this.tabId)
        if(this.tabId.length == 0){
            alert(`Aucune recette ne contient " ${expression} " vous pouvez chercher (tarte aux pommes)`)
            console.log(this.tabId == [])
        }else{
            return(this.displayData(), this.displayListe())
        }
        
    }
    getTagSelect(tagSelect, parentList){
        console.log(parentList)
        const tag = new TagDom(tagSelect);
        const elementTag = tag.getTag();
        parentList.appendChild(elementTag);
        tag.deleteOption(this.rechercheTagRestant.bind(this))  
    }
    rechercheTag(e){
        if(e.currentTarget.parentElement != null){
            let tag = e.currentTarget.textContent;
            let element =  e.currentTarget.parentElement.parentElement;
            console.log(element)
            console.log(tag)
            this.getTagSelect(tag, element.parentElement)
            console.log(document.querySelector('.tag button'))
            // document.querySelector.forEach((ele)=>{ele.addEventListener('click', this.rechercheTagRestant.bind(this))});
            this.getERecettesAfficher()
            if(element.id == "ingredients"){
                this.listTagSelect.push(tag);
                const newRecettesAfficher = this.recettesAfficher.filter((recette)=>{
                    let existe = false;
                    recette.ingredients.forEach((element)=>{
                        if(element.ingredient.toLowerCase() == tag.toLowerCase()){
                            existe = true;
                        }
                        
                    })
                    return(existe)
                })
                console.log(newRecettesAfficher)
                if(this.tabId.length == 0){
                    newRecettesAfficher.forEach((recette)=>{
                    this.tabId.push(recette.id)
                    
                    })
                }else{
                    this.tabId = [];
                    newRecettesAfficher.forEach((recette)=>{
                        this.tabId.push(recette.id)
                    }) 
                }
               
            }else if(element.id == "Appareils"){
                this.listTagSelect.push(tag)
                 const newRecettesAfficherA = this.recettesAfficher.filter((recette)=>recette.appliance == tag)
                 console.log(newRecettesAfficherA)
                if(this.tabId.length == 0){
                    newRecettesAfficherA.forEach((recette)=>{
                    this.tabId.push(recette.id)
                    
                    })
                }else{
                    this.tabId = [];
                    newRecettesAfficherA.forEach((recette)=>{
                        this.tabId.push(recette.id)
                    }) 
                }
            }else{
                this.listTagSelect.push(tag)
                const newRecettesAfficherU = this.recettesAfficher.filter((recette)=>{
                    let existe = false;
                    recette.ustensils.forEach((element)=>{
                        if(element == tag){
                            existe = true;
                        }
                    })
                    return(existe)
                })
                console.log(newRecettesAfficherU)
                if(this.tabId.length == 0){
                    newRecettesAfficherU.forEach((recette)=>{
                    this.tabId.push(recette.id)
                    
                    })
                }else{
                    this.tabId = [];
                    newRecettesAfficherU.forEach((recette)=>{
                        this.tabId.push(recette.id)
                    }) 
                }
            }
            return(this.displayData(), this.displayListe())
            
        }   
    }
    verifExistance(option, sousElement, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element[sousElement] == tag){
                existe = true;
            }
        })
        return(existe)
    }
    verifExistanceU(option, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element == tag){
                existe = true;
            }
        })
        return(existe)
    }
    rechercheTagRestant(e){
        console.log(e.currentTarget)
        console.log(e.currentTarget.parentElement.firstElementChild.textContent)
        let tagSupprimer = e.currentTarget.parentElement.firstElementChild.textContent;
        console.log(this.listTagSelect)
        e.currentTarget.parentElement.remove()
        //ajout de fonction qui supprimer la tag
        this.tabId = []
        this.getERecettesAfficher();
        this.listTagSelect= this.listTagSelect.filter(item => item !== tagSupprimer);
        console.log(this.listTagSelect)
        this.listTagSelect.forEach((tag)=>{
            this.recettesAfficher = this.recettesAfficher.filter((recette)=>{
                return this.verifExistance(recette.ingredients, 'ingredient', tag) || 
                this.verifExistanceU(recette.ustensils, tag) ||
                 recette.appliance == tag;
            })
        })
        if(this.tabId.length == 0){
            this.recettesAfficher.forEach((recette)=>{
            this.tabId.push(recette.id)
            
            })
        }else{
            this.tabId = [];
            this.recettesAfficher.forEach((recette)=>{
                this.tabId.push(recette.id)
            }) 
        }
       
        return(this.displayData(), this.displayListe())
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
    // document.querySelectorAll('li[type="button"]').forEach((element)=>{element.addEventListener('click', (e)=>{
    //      indexpage.rechercheTag(e.currentTarget.textContent, e.currentTarget.parentElement.parentElement)
    //  })})
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