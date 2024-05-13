
function showClearButton(inputId) {
    const input = document.getElementById(inputId);
    const clearButton = input.nextElementSibling;
    if (input.value.length > 0) {
      clearButton.style.display = 'block';
    } else {
      clearButton.style.display = 'none';
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
function toggleSortOptions(listId) {
    const listes = document.querySelectorAll('.liste-block');
    const list = document.getElementById(listId);
    const parentList = list.parentElement;
    
    if (list.style.visibility === "hidden") {
        for(let i=0; i<listes.length; i++){
            listes[i].style.visibility = "hidden";
            listes[i].parentElement.style.order = "0";
        }
        // Appelez la fonction une fois au chargement de la page
        appliquerCSS(parentList);
        // Ajoutez un écouteur d'événement pour redimensionner la fenêtre
        window.addEventListener("resize", appliquerCSS(parentList));
        list.style.visibility = "visible";
    } else {
        list.style.visibility = "hidden";
        parentList.style.order = "0";
    }
}
