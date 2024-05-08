
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
function toggleSortOptions(listId) {
    const list = document.getElementById(listId);
    if (list.style.visibility === "hidden") {
        list.style.visibility = "visible";
    } else {
        list.style.visibility = "hidden";
    }
}
