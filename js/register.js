/* ---------- "checkbox" ---------- */

function changeCheckbox(id) {
    let checkbox = document.getElementById(id);
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
    }
}