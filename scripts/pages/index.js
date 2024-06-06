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
        this.listReceiptFiltredByTxt = [];
        this.recettesAfficher = this.recettes;
        this.listTagSelect = [];
        
        let inputPrincipale = document.getElementById('input1');
        inputPrincipale.addEventListener('keydown',(e)=>{
            if(e.key == "Enter"){
                this.btn_recherche_principale()
            }
        });
        document.getElementById('searhButton').addEventListener('click', ()=>{
            this.btn_recherche_principale()
        });
        document.getElementById('clearBtnInput1').addEventListener('click', ()=>{
            this.remove_all_tags();
            this.back_to_initial();
        })
       
        // pour faire revenir la liste à son etat intial 
        document.querySelectorAll('.liste-block input').forEach((element)=>element.addEventListener('input',(e)=>{
             if(e.currentTarget.value == ''){
                this.display_liste()
             }
        }))
        
    }
    
    filter_by_text(txt){
        // filtrer toutes les recettes par expression
        let recettesAfficherPrinc = [];
        recettesAfficherPrinc = this.recettes.filter((recette)=>{
            return(recette.name.toLowerCase().includes(txt) || recette.description.toLowerCase().includes(txt) || 
            this.verifier_existance_ingredient(recette.ingredients, txt))
        })
        this.listReceiptFiltredByTxt = recettesAfficherPrinc;
        this.recettesAfficher = this.listReceiptFiltredByTxt;
    }
    // //remplace verifListeIngredients
    verifier_existance_ingredient(ingredientsElement, expression){
        return ingredientsElement.some(ingredientObj => 
            ingredientObj.ingredient.toLowerCase().includes(expression.toLowerCase())
        );
    }
    filter_by_tags(){
        if(this.listReceiptFiltredByTxt.length>0){
            this.recettesAfficher = this.listReceiptFiltredByTxt;
        }else{
            this.recettesAfficher=this.recettes;
        }
        this.listTagSelect.forEach((tag)=>{
            this.filter_recettes_tag(tag);
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
    
    btn_recherche_principale(){
        this.remove_all_tags()
        
        const input = document.getElementById('input1');
        if(input.value.length>=3){
            this.filter_by_text(input.value.toLowerCase());
            if(this.recettesAfficher.length == 0){
                this.display_no_receipt_found(`Aucune recette ne contient " ${input.value} " vous pouvez chercher (tarte aux pommes)`)
            }else{
                this.display_data();
                this.display_liste();
            }
        }else{
            this.back_to_initial();
        }
    }

    back_to_initial(){
        this.recettesAfficher = this.recettes;
        this.display_data();
        this.display_liste();
        
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
    display_no_receipt_found(message){
        const recettesSection = document.querySelector(".sectionCard");
        recettesSection.innerHTML='';
        const p = document.createElement('p')
        p.textContent = message;
        recettesSection.appendChild(p)
        const domNbrRecettes = document.querySelector('.fontStyle');
        domNbrRecettes.textContent = `0 recettes`;
    }
    display_liste(){
         let map ={
            "ingredients": this.ingredients,
            "Appareils": this.Appareils,
            "Ustensiles": this.ustensils
         }
        for (let key in map){
            let liste = new ListeDom(map[key],key );
            liste.getListe();
            // liste.choixOption(this.recherche_tag.bind(this))
        }
        document.querySelectorAll('li[type="button"]').forEach((element)=>{element.addEventListener('click', this.recherche_tag.bind(this))})
        if(this.listTagSelect.length != 0){
            for(let i=0; i<this.listTagSelect.length; i++){
                document.getElementById(this.listTagSelect[i]).classList.add('tag-select');
                document.getElementById(this.listTagSelect[i]).querySelector('span').classList.remove('d-none');
                document.getElementById(this.listTagSelect[i]).querySelector('span').classList.add('d-block'); 
                document.getElementById(this.listTagSelect[i]).addEventListener('click',()=>{
                   if(document.getElementById(this.listTagSelect[i]).classList.value.includes('tag-select')){
                    this.filtre_tag_supprimer(this.listTagSelect[i])
                   }
                })        
            }
        }
    }
    display_data(){
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

    get_tag_select(tagSelect, parentList){
        console.log(parentList)
        const tag = new TagDom(tagSelect);
        const elementTag = tag.getTag();
        parentList.appendChild(elementTag);
        tag.deleteOption(this.recherche_tag_restant.bind(this))  
    }
    filter_recettes_tag(tag){
        this.recettesAfficher = this.recettesAfficher.filter((recette)=>{
            return this.resultat_recherche_tag_ingredient(recette.ingredients, 'ingredient', tag) || 
            this.resultat_recherche_tag_ustentiel(recette.ustensils, tag) ||
            recette.appliance == tag;
        })
    }
    recherche_tag(e){
        let tag = e.currentTarget.textContent;
        let element =  e.currentTarget.parentElement.parentElement;
        if(this.listTagSelect.includes(tag) == false){
            this.get_tag_select(tag, element.parentElement);
            console.log(document.querySelector('.tag button'))
            this.listTagSelect.push(tag);
            this.filter_recettes_tag(tag)
            this.display_data(); 
            this.display_liste();
        }   
    }
    resultat_recherche_tag_ingredient(option, sousElement, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element[sousElement].toLowerCase() == tag){
                existe = true;
            }
        })
        return(existe)
    }
    resultat_recherche_tag_ustentiel(option, tag){
        let existe = false;
        option.forEach((element)=>{
            if(element.toLowerCase() == tag){
                existe = true;
            }
        })
        return(existe)
    }
    filtre_tag_supprimer(tagSupprimer){
        document.getElementById(tagSupprimer).classList.remove('tag-select');
        console.log(this.listTagSelect)
        this.listTagSelect= this.listTagSelect.filter(item => item !== tagSupprimer);
        if(this.listTagSelect.length>0){
            this.filter_by_tags();
        }else{
            this.btn_recherche_principale();
        }
        return(this.display_data(), this.display_liste())
    }
    //fonction qui recherche apres avoir supprimer un tag
    recherche_tag_restant(e){
        console.log(e.currentTarget)
        console.log(e.currentTarget.parentElement.firstElementChild.textContent)
        let tagSupprimer = e.currentTarget.parentElement.firstElementChild.textContent;
        e.currentTarget.parentElement.remove();
        this.filtre_tag_supprimer(tagSupprimer);
    }
}
async function init() {
    // Récupère la liste des recettes
    const recettes = await getRecettes();

    const indexpage = new IndexPage(recettes)
    
    //Afficher la liste des recettes
    indexpage.display_data()
    indexpage.display_liste()
}
init()
