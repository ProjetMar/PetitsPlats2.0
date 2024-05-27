class ListeDom{
    constructor(data, liste){
        this.data = data;
        this.liste = document.querySelector(`.${liste}`);
        this.liste.innerHTML='';
    }
    template(idTemplate){
        const template = document.getElementById(idTemplate);
        const clone = document.importNode(template.content,true);
        return(clone)
    }
    getElementListe(ingredient){
        const clone = this.template("templateOptionTri");
        const li = clone.querySelector('li');
        const p = clone.querySelector('p');
        p.textContent = ingredient;
        // li.textContent = ingredient;
        li.setAttribute('id', li.textContent);
        return(clone)
    }
    getListe(){
        for(let i=0; i<this.data.length; i++){
            let element = this.getElementListe(this.data[i]);
            this.liste.appendChild(element);
        }
    }
}