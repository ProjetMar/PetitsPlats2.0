// // liste est un element de la liste des ul 
// function listeIngredients (liste, expression){
//     let existe = false ; 
//     let listeIngElement = liste.children;
//     let i = 0 ; 
//     while(i<listeIngElement.length && existe == false){
//         if(listeIngElement[i].children[0].textContent.toLowerCase().includes(expression)){
//             existe = true;
//         }
//         i = i+1;
//     }
//     return(existe)
// }
// function recherche(expression){
//     const titreElements  = document.querySelectorAll('.dom-titre');
//     const desciptionElement = document.querySelectorAll('.dom-description');
//     // liste des ul 
//     const liste = document.querySelectorAll('.flex-liste');
//     let tabIncludes = [];
//     let tabId = [];
//     for(let i=0; i< titreElements.length; i++){
//         if ((titreElements[i].textContent.toLowerCase().includes(expression)) || 
//         (desciptionElement[i].textContent.toLowerCase().includes(expression)) || (listeIngredients(liste[i], expression)) ){
//             tabIncludes.push(titreElements[i]);
//             tabId.push(i+1);
//         }
//     }
//     console.log(tabIncludes)
//     console.log(tabId)
//     return(tabId)
// }
// function supprimeCard(tab){
//     for(let i=0 ; i<50; i++){
//         if((tab.includes(i+1))==false ){
//             document.getElementById(i+1).remove();
//         }
//     }
// }
// liste est un element de la liste des ul 

// function listeIngredients (ingredientsElement, expression){
//     let existe = false ; 
//     let i = 0 ; 
//     while(i<ingredientsElement[i].length && existe == false){
//         if(ingredientsElement[i].toLowerCase().includes(expression)){
//             existe = true;
//         }
//         i = i+1;
//     }
//     return(existe)
// }
// function recherche(titres, descriptions ,ingredientsTab , expression){
//     let tabIncludes = [];
//     let tabId = [];
//     for(let i=0; i< titres.length; i++){
//         if ((titres[i].toLowerCase().includes(expression)) || 
//         (descriptions[i].toLowerCase().includes(expression)) || (listeIngredients(ingredientsTab[i], expression)) ){
//             tabIncludes.push(titres[i]);
//             tabId.push(i+1);
//         }
//     }
//     console.log(tabIncludes)
//     console.log(tabId)
//     if(tabId.length == 0){
//         alert(`Aucune recette ne contient " ${expression} " vous pouvez chercher (tarte aux pommes)`)
//         console.log(tabId == [])
//     }else{
//         return(supprimeCard(tabId))
//     }
    
// }
// function supprimeCard(tab){
//     for(let i=0 ; i<50; i++){
//         if((tab.includes(i+1))==false ){
//             document.getElementById(i+1).remove();
//         }
//     }
// }
