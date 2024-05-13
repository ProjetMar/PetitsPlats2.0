// function TriTableau (tableau){
//     let TriIngrediends = Array.from(tableau);
//     TriIngrediends.sort(function(a,b){
//         return(a.localeCompare(b))
//     });
//     return(TriIngrediends)
// }
class ListeDom{
    constructor(data, liste){
        this.data = data;
        this.liste = document.querySelector(`.${liste}`);
    }
    template(idTemplate){
        const template = document.getElementById(idTemplate);
        const clone = document.importNode(template.content,true);
        return(clone)
    }
    getElementListe(ingredient){
        const clone = this.template("templateOptionTri");
        const li = clone.querySelector('li');
        li.textContent = ingredient;
        return(clone)
    }
    getListe(){
        for(let i=0; i<this.data.length; i++){
            let element = this.getElementListe(this.data[i]);
            this.liste.appendChild(element);
        }
    }
}