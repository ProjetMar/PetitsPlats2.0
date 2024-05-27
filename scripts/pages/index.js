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
        this.recipe_ids_show = [];
        this.listTagSelect = [];
        this.recipe_ids_after_search = [];
        this.recipe_ids_after_tags = [];
        this.inputPrincipale = document.getElementById('input1');
        document.getElementById('searhButton').addEventListener('click', ()=>{
            this.btnRecherchePrincipale()
        })
        this.inputPrincipale.addEventListener('keydown',(e)=>{
            if(e.key == "Enter"){
                this.btnRecherchePrincipale()
            }
        })
        // pour faire revenir la liste à son etat intial 
        document.querySelectorAll('.liste-block input').forEach((element)=>element.addEventListener('input',(e)=>{
             if(e.currentTarget.value == ''){
                this.displayListe()
             }
        }))
        document.getElementById('clearBtnInput1').addEventListener('click', ()=>{
            this.backToInitial()
        })
    }
    btnRecherchePrincipale(){
        const input = document.getElementById('input1');
        if(input.value.length>=3){
            this.recherche(input.value.toLowerCase())
            this.get_recipe_ids_search(input.value.toLowerCase())
        }else{
            this.backToInitial();
        }
    }
    backToInitial(){
        this.recipe_ids_after_search=[];
        this.get_recipe_ids_tags();
        if(this.recipe_ids_after_tags.length > 0){
            this.recipe_ids_show = this.recipe_ids_after_tags;
        }else{
            this.recipe_ids_show =[];
        }
        this.getERecettesAfficher();
        this.displayData();
        this.displayListe();
    }
    getERecettesAfficher(){
        if(this.recipe_ids_show.length>0){
            this.recettesAfficher = this.recettes.filter((recette)=>this.recipe_ids_show.includes(recette.id))
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
    displayNonRecette(message){
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        const p = document.createElement('p')
        p.textContent = message;
        recettesSection.appendChild(p)
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
        if(this.listTagSelect.length != 0){
            for(let i=0; i<this.listTagSelect.length; i++){
                document.getElementById(this.listTagSelect[i]).classList.add('tag-select');
                document.getElementById(this.listTagSelect[i]).querySelector('span').classList.remove('d-none');
                document.getElementById(this.listTagSelect[i]).querySelector('span').classList.add('d-block'); 
                document.getElementById(this.listTagSelect[i]).addEventListener('click',()=>{
                   if(document.getElementById(this.listTagSelect[i]).classList.value.includes('tag-select')){
                    this.filtreTagSupprimer(this.listTagSelect[i])
                   }
                })        
            }
        }
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
    ActualIdRecettesAfficher(){
        if(this.recipe_ids_show.length == 0){
            this.recettesAfficher.forEach((recette)=>{
                this.recipe_ids_show.push(recette.id)
            })   
        }else{
            this.recipe_ids_show = [];
            this.recettesAfficher.forEach((recette)=>{
                this.recipe_ids_show.push(recette.id)
            }) 
        }
    }
    //methode ou j'ai utilisé les methodes native
    // myIncludes(mainString, subString) {
    //     for (let i = 0; i <= mainString.length - subString.length; i++) {
    //         let match = true;
    //         for (let j = 0; j < subString.length; j++) {
    //             if (mainString[i + j] !== subString[j]) {
    //                 match = false;
    //                 break;
    //             }
    //         }
    //         if (match) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // verifListeIngredients (ingredientsElement, expression){
    //     let existe = false ; 
    //     let i = 0 ; 
    //     while(i<ingredientsElement[i].length && existe == false){
    //         if(this.myIncludes(ingredientsElement[i].toLowerCase(),expression)){
    //             existe = true;
    //         }
    //         i = i+1;
    //     }
    //     return(existe)
    // }
    verifIncludes(listIngredients, ingredient, expression){
        let include = false;
        listIngredients.forEach((option)=>{
            if(option[ingredient].toLowerCase().includes(expression)){
                include = true;
            }
        })
        return(include)
    }
    //filtre apres saisie champ principale 
    filter_Recettes_ChampPrincipale(expression){
        let recettesAfficherPrinc = [];
        // for(let i=0; i< this.titres.length; i++){
        //     if (this.myIncludes(this.titres[i].toLowerCase(), expression) || 
        //     (this.myIncludes(this.descriptions[i].toLowerCase(), expression)) || (this.verifListeIngredients(this.ingredientsElements[i], expression)) ){
        //         // recettesAfficherPrinc.push(this.recettesAfficher[i])
        //         recettesAfficherPrinc[recettesAfficherPrinc.length] = this.recettesAfficher[i];
        //     }
        // }
        recettesAfficherPrinc = this.recettesAfficher.filter((recette)=>{
            return(recette.name.toLowerCase().includes(expression) || recette.description.toLowerCase().includes(expression) || 
            this.verifIncludes(recette.ingredients, 'ingredient', expression))
        })
        return(recettesAfficherPrinc)
    }
    //methode ou j'ai utilisé seulement les methodes native 
    get_recipe_ids_search(expression){
        this.recipe_ids_show=[]
        this.getERecettesAfficher();
        this.recettesAfficher = this.filter_Recettes_ChampPrincipale(expression);
        // this.recettesAfficher.forEach((recette)=>{
        //     this.recipe_ids_after_search.push(recette.id)
        // }) 
        for (let i = 0; i < this.recettesAfficher.length; i++) {
            this.recipe_ids_after_search[this.recipe_ids_after_search.length] = this.recettesAfficher[i].id;
        }
        console.log(this.recipe_ids_after_search)
    }
    //methode ou j'ai utilisé seulement les methodes native 
    recherche(expression){
        this.getERecettesAfficher();
        this.recettesAfficher = this.filter_Recettes_ChampPrincipale(expression);
        this.ActualIdRecettesAfficher()
        console.log(this.recipe_ids_show)
        if(this.recipe_ids_show.length == 0){
            this.displayNonRecette(`Aucune recette ne contient " ${expression} " vous pouvez chercher (tarte aux pommes)`)
            console.log(this.recipe_ids_show == [])
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
    filter_recettes_tag(tag){
        this.recettesAfficher = this.recettesAfficher.filter((recette)=>{
            return this.verifExistance(recette.ingredients, 'ingredient', tag) || 
            this.verifExistanceU(recette.ustensils, tag) ||
            recette.appliance == tag;
        })
    }
    rechercheTag(e){
        let tag = e.currentTarget.textContent;
        let element =  e.currentTarget.parentElement.parentElement;
        console.log(element)
        console.log(tag)
        if(this.listTagSelect.includes(tag) == false){
            this.getTagSelect(tag, element.parentElement);
            console.log(document.querySelector('.tag button'))
            this.getERecettesAfficher()
            this.listTagSelect.push(tag);
            this.filter_recettes_tag(tag)
            this.ActualIdRecettesAfficher();
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
    get_recipe_ids_tags(){
        this.recipe_ids_show=[];
        this.getERecettesAfficher();
        console.log(this.listTagSelect)
        this.listTagSelect.forEach((tag)=>{
            this.filter_recettes_tag(tag)
        })
        this.recettesAfficher.forEach((recette)=>{
            this.recipe_ids_after_tags.push(recette.id)
        }) 

    }
    filtreTagSupprimer(tagSupprimer){
        document.getElementById(tagSupprimer).classList.remove('tag-select');
        console.log(this.listTagSelect)
        if(this.recipe_ids_after_search.length >0){
            this.recipe_ids_show = this.recipe_ids_after_search;
        }else{
            this.recipe_ids_show = [];
        }
        // this.recipe_ids_show = []
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
        this.ActualIdRecettesAfficher();
        return(this.displayData(), this.displayListe())
    }
    //fonction qui recherche apres avoir supprimer un tag
    rechercheTagRestant(e){
        console.log(e.currentTarget)
        console.log(e.currentTarget.parentElement.firstElementChild.textContent)
        let tagSupprimer = e.currentTarget.parentElement.firstElementChild.textContent;
        e.currentTarget.parentElement.remove();
        this.filtreTagSupprimer(tagSupprimer);
    }
}
async function init() {
    // Récupère les datas des photographes
    const recettes = await getRecettes();
    const indexpage = new IndexPage(recettes)
    indexpage.displayData()
    indexpage.displayListe()
}
init()