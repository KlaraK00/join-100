/* ---------- "checkbox" ---------- */

// let registerCheckbox = document.getElementById('registerCheckbox');

// if (registerCheckbox) {
//     registerCheckbox.addEventListener('change', () => {
//         if (registerCheckbox.checked) {
//             registerShowCheckedCheckbox();
//         } else {
//             registerShowNoCheckedCheckbox();
//         }
//     })
// }

function changeCheckbox(id) {
    let checkbox = document.getElementById(id);
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
    }
}


function registerShowCheckedCheckbox() {
    let registerCheckedCheckbox = document.getElementById('registerCheckedCheckbox');
    let registerCheckbox = document.getElementById('registerCheckbox');
    // let registerSpanAccept = document.getElementById('registerSpanAccept');

    registerCheckedCheckbox.classList.remove('d-none');
    registerCheckbox.classList.add('d-none');
    registerCheckedCheckbox.style.display = 'inline-block';
    // registerSpanAccept.classList.add('marLeft23');
}

function registerShowNoCheckedCheckbox() {
    let registerCheckedCheckbox = document.getElementById('registerCheckedCheckbox');
    let registerCheckbox = document.getElementById('registerCheckbox');
    // let registerSpanAccept = document.getElementById('registerSpanAccept');

    registerCheckedCheckbox.classList.add('d-none');
    registerCheckbox.classList.remove('d-none');
    // registerSpanAccept.classList.remove('marLeft23');
    registerCheckedCheckbox.style.display = 'none';
}
