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