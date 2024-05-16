
function recpereliste (inputId){
    if( inputId == 'input2'){
        return document.querySelector('.ingredients');
    }else if(inputId == 'input3'){
        return document.querySelector('.Appareils');
    }else if(inputId == 'input4'){
    return document.querySelector('.Ustensiles')
    }
}

function showClearButton(inputId) {
    const input = document.getElementById(inputId);
    const clearButton = input.nextElementSibling;
    if (input.value.length>0) {
            clearButton.style.display = 'block';
    } else {
         clearButton.style.display = 'none';
    }
    if(inputId !='input1'){
       const liste = recpereliste(inputId);
        console.log(liste)
         const items = Array.from(liste.getElementsByTagName("li"));
         if(input.value.length>0 && input.value.length< 3){
                // Trier les éléments en fonction de la pertinence par rapport à la valeur saisie
            items.sort(function(a, b) {
              const textA = a.textContent.toLowerCase();
               const textB = b.textContent.toLowerCase();
    
              // Calculer la pertinence des éléments par rapport à la valeur saisie
             const relevanceA = textA.includes(input.value) ? 1 : 0;
             const relevanceB = textB.includes(input.value) ? 1 : 0;
    
                // Trier les éléments en fonction de leur pertinence
                 return relevanceB - relevanceA;
             }); 
            
            // Réorganiser les éléments dans la liste
             items.forEach(function(item) {
            liste.appendChild(item);
            });
         }else{
            // suprimer les elements qui ne contient pas l'input
            let newitems = []
            console.log(input.value)
            console.log(newitems)
            for(let i=0; i < items.length; i++){
                if(items[i].textContent.toLowerCase().includes(input.value)){
                    newitems.push(items[i])
                }
            }
            liste.querySelectorAll('li').forEach((li)=>{li.remove()})
            // Réorganiser les éléments dans la liste
            newitems.forEach((item)=> {
                console.log(item)
                liste.appendChild(item);
            });
        }
    }              
    
     
    
}

function clearInput(inputId) {
    const input = document.getElementById(inputId);
    input.value = '';
    const clearButton = input.nextElementSibling;
    clearButton.style.display = 'none';
}

// Fonction pour appliquer la propriété CSS en fonction de la taille de l'écran
function appliquerCSS(parentList) {
    // Vérifiez la largeur de l'écran
    const largeurEcran = window.innerWidth;

    // Si la largeur de l'écran est inférieure à 768 pixels (taille moyenne)
    if (largeurEcran < 768) {
        // Appliquez la propriété CSS à l'élément
        parentList.style.order = "3";
    } else {
        // Réinitialisez la propriété CSS si la taille de l'écran est supérieure à 768 pixels
        parentList.style.order = "0";
    }
}
// j'ai ajouter la prop order et la fonction appliquer pour resoudre le problem des boutons qui seront 
//sous les elements ouvert des autres boutons 
function openListe(listId) {
    const listes = document.querySelectorAll('.liste-block');
    const list = document.getElementById(listId);
    const parentList = list.parentElement;
    
    
    for(let i=0; i<listes.length; i++){
        listes[i].style.visibility = "hidden";
        listes[i].parentElement.style.order = "0";
    }
    // Appelez la fonction une fois au chargement de la page
    appliquerCSS(parentList);
    // Ajoutez un écouteur d'événement pour redimensionner la fenêtre
    window.addEventListener("resize", appliquerCSS(parentList));
    list.style.visibility = "visible";
    list.querySelectorAll('li').forEach((li)=>{
        li.addEventListener('click',()=>{
            const tag = new Tag(li.textContent);
            const elementTag = tag.getTag();
            parentList.appendChild(elementTag);
        })
    })
   
}
function closeListe(listId){
    const list = document.getElementById(listId);
    const parentList = list.parentElement;
    list.style.visibility = "hidden";
     parentList.style.order = "0";
}
