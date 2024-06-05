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
        this.list_receipt_filtred_by_txt = [];
        this.recettesAfficher = this.recettes;
        this.listTagSelect = [];
        
        let inputPrincipale = document.getElementById('input1');
        inputPrincipale.addEventListener('keydown',(e)=>{
            if(e.key == "Enter"){
                this.btnRecherchePrincipale()
            }
        });
        document.getElementById('searhButton').addEventListener('click', ()=>{
            this.btnRecherchePrincipale()
        });
        document.getElementById('clearBtnInput1').addEventListener('click', ()=>{
            this.remove_all_tags();
            this.backToInitial();
        })
       
        // pour faire revenir la liste à son etat intial 
        document.querySelectorAll('.liste-block input').forEach((element)=>element.addEventListener('input',(e)=>{
             if(e.currentTarget.value == ''){
                this.displayListe()
             }
        }))
        
    }
    
    filter_by_text(txt){
        // filtrer toutes les recettes par expression
        let recettesAfficherPrinc = [];
        for(let i=0; i< this.recettes.length; i++){
            if (this.containString(this.recettes[i].name.toLowerCase(), txt) || 
            (this.containString(this.recettes[i].description.toLowerCase(), txt)) || (this.verifListeIngredients(this.recettes[i].ingredients, txt)) ){
                recettesAfficherPrinc[recettesAfficherPrinc.length] = this.recettes[i];
            }
        }
        this.list_receipt_filtred_by_txt = recettesAfficherPrinc;
        this.recettesAfficher = this.list_receipt_filtred_by_txt;
    }

    filter_by_tags(){
        //this.recettesAfficher = this.list_receipt_filtred_by_txt;
        if(this.list_receipt_filtred_by_txt.length>0){
            this.recettesAfficher = this.list_receipt_filtred_by_txt;
        }else{
            this.recettesAfficher=this.recettes;
        }
        this.listTagSelect.forEach((tag)=>{
            this.recettesAfficher = this.recettesAfficher.filter((recette)=>{
                return this.verifExistance(recette.ingredients, 'ingredient', tag) || 
                this.verifExistanceU(recette.ustensils, tag) ||
                 recette.appliance == tag;
            })
        }) 
    }

    remove_all_tags(){
        if(this.listTagSelect.length > 0){
            document.querySelectorAll('.tag').forEach((element)=>{
                element.remove()
            })
            this.listTagSelect.forEach((element)=>{   
                document.getElementById(element).classList.add('tag-select');
                document.getElementById(element).querySelector('span').classList.remove('d-block');
                document.getElementById(element).querySelector('span').classList.add('d-none');     
            })

        }
        this.listTagSelect = [];
    }
    
    btnRecherchePrincipale(){
        this.remove_all_tags()
        
        const input = document.getElementById('input1');
        if(input.value.length>=3){
            this.filter_by_text(input.value.toLowerCase());
            if(this.recettesAfficher.length == 0){
                this.displayNoReceiptFound(`Aucune recette ne contient " ${input.value} " vous pouvez chercher (tarte aux pommes)`)
            }else{
                this.displayData();
                this.displayListe();
            }
        }else{
            this.backToInitial();
        }
    }

    backToInitial(){
        this.recettesAfficher = this.recettes;
        this.displayData();
        this.displayListe();
        
    }

    // la methode ftatMap permet de extraire les ingredients des tab et aussi de creer un tableau contient les 
       //elements des sous tableau du tableau  
       // new set permet d'elever la repetition des elements 
    get ingredients(){
         return([...new Set(this.recettesAfficher.map(recette=> recette.ingredients).flatMap(innerArray => innerArray.map(obj => obj.ingredient.toLowerCase())))])
    }
    get Appareils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.appliance))])
    }
    get ustensils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.ustensils).flat().map(ustensil=>ustensil.toLowerCase()))])
    }
    displayNoReceiptFound(message){
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        const p = document.createElement('p')
        p.textContent = message;
        recettesSection.appendChild(p)
        const domNbrRecettes = document.querySelector('.fontStyle');
        domNbrRecettes.textContent = `0 recettes`;
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
        //Afficher les cartes des recettes trouvées
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        this.recettesAfficher.forEach((recette) => {
            const recetteModel =new Card(recette);
            const CardDom = recetteModel.getCardRecette();
            recettesSection.appendChild(CardDom);
        });
        
        //Afficher le nombre des recettes trouvées
        const nbrRecettes = this.recettesAfficher.length;
        const domNbrRecettes = document.querySelector('.fontStyle');
        domNbrRecettes.textContent = `${nbrRecettes} recettes`;
    }
    //methode ou j'ai utilisé les methodes native
    containString(mainString, subString) {
        for (let i = 0; i <= mainString.length - subString.length; i++) {
            let match = true;
            for (let j = 0; j < subString.length; j++) {
                if (mainString[i + j] !== subString[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        return false;
    }
    verifListeIngredients (ingredientsElement, expression){
        let existe = false ; 
        let i = 0 ; 
        while(i<ingredientsElement[i].length && existe == false){
            if(this.containString(ingredientsElement[i].toLowerCase(),expression)){
                existe = true;
            }
            i = i+1;
        }
        return(existe)
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
        if(this.listTagSelect.includes(tag) == false){
            this.getTagSelect(tag, element.parentElement);
            console.log(document.querySelector('.tag button'))
            this.listTagSelect.push(tag);
            this.filter_recettes_tag(tag)
            this.displayData(); 
            this.displayListe();
        }   
    }
    verifExistance(option, sousElement, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element[sousElement].toLowerCase() == tag){
                existe = true;
            }
        })
        return(existe)
    }
    verifExistanceU(option, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element.toLowerCase() == tag){
                existe = true;
            }
        })
        return(existe)
    }
    filtreTagSupprimer(tagSupprimer){
        document.getElementById(tagSupprimer).classList.remove('tag-select');
        console.log(this.listTagSelect)
        this.listTagSelect= this.listTagSelect.filter(item => item !== tagSupprimer);
        //this.filter_by_tags();
        if(this.listTagSelect.length>0){
            this.filter_by_tags();
        }else{
            this.btnRecherchePrincipale();
        }
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
    // Récupère la liste des recettes
    const recettes = await getRecettes();

    const indexpage = new IndexPage(recettes)
    
    //Afficher la liste des recettes
    indexpage.displayData()
    indexpage.displayListe()
}
init()
