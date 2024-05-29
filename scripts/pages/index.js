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
        this.recettes.forEach((recette)=>{
            if(recette.name.toLowerCase().includes(txt) || recette.description.toLowerCase().includes(txt) || 
            this.verifExistanceIng(recette.ingredients, txt)){
                recettesAfficherPrinc.push(recette)
            }
        })
        this.list_receipt_filtred_by_txt = recettesAfficherPrinc;
        this.recettesAfficher = this.list_receipt_filtred_by_txt;
    }
    // //remplace verifListeIngredients
    verifExistanceIng(ingredientsElement, expression){
        return ingredientsElement.some(ingredientObj => 
            ingredientObj.ingredient.toLowerCase().includes(expression.toLowerCase())
        );
    }
    filter_by_tags(){
        this.recettesAfficher = this.list_receipt_filtred_by_txt;
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
            document.querySelectorAll('.tag')
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
         return([...new Set(this.recettesAfficher.map(recette=> recette.ingredients).flatMap(innerArray => innerArray.map(obj => obj.ingredient)))])
    }
    get Appareils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.appliance))])
    }
    get ustensils(){
        return([...new Set(this.recettesAfficher.map(recette=> recette.ustensils).flat())])
    }
    displayNoReceiptFound(message){
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        const p = document.createElement('p')
        p.textContent = message;
        recettesSection.appendChild(p)
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
    filtreTagSupprimer(tagSupprimer){
        document.getElementById(tagSupprimer).classList.remove('tag-select');
        console.log(this.listTagSelect)
        this.listTagSelect= this.listTagSelect.filter(item => item !== tagSupprimer);
        this.filter_by_tags();
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
