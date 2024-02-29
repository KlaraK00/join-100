let registerCheckbox = document.getElementById('registerCheckbox');

registerCheckbox.addEventListener('change', () => {
    if (registerCheckbox.checked) {
        registerShowCheckedCheckbox();
    } else {
        registerShowNoCheckedCheckbox();
    }
})

function registerShowCheckedCheckbox() {
    let registerCheckedCheckbox = document.getElementById('registerCheckedCheckbox');
    let registerCheckbox = document.getElementById('registerCheckbox');
    let registerSpanAccept = document.getElementById('registerSpanAccept');

    registerCheckedCheckbox.classList.remove('d-none');
    registerCheckbox.classList.add('d-none');
    registerSpanAccept.classList.add('marLeft23');
}

function registerShowNoCheckedCheckbox() {
    let registerCheckedCheckbox = document.getElementById('registerCheckedCheckbox');
    let registerCheckbox = document.getElementById('registerCheckbox');
    let registerSpanAccept = document.getElementById('registerSpanAccept');

    registerCheckedCheckbox.classList.add('d-none');
    registerCheckbox.classList.remove('d-none');
    registerSpanAccept.classList.remove('marLeft23');
}