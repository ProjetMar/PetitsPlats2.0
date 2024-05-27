class TagDom{
    constructor(tag){
        this.tag = tag
    }
    template(idTemplate){
        const template = document.getElementById(idTemplate);
        const clone = document.importNode(template.content,true);
        return(clone)
    }
    getTag(){
        const clone = this.template("tag");
        const p = clone.querySelector('p');
        p.textContent = this.tag;
        return(clone)
    }
    deleteOption(callback){
        document.querySelectorAll('.tag button').forEach((element)=>{element.addEventListener('click', callback)})
    }
}