let letters = [];

/**
 * Initialisiert die Kontakte, lädt sie und rendert sie, wenn der Benutzer eingeloggt ist.
 * Zeigt andernfalls einen Fehler an.
 */
async function initContacts(){
    loadLoggedIn();
    if(loggedIn) {
        await includeHTML();
        await loadContacts();
        highlightActiveSideButton();
        currentUser = getCurrentUser();
        showUserNavBar();
        fillLetters();
        loadLetters();
        renderContact();
    } else {
        showLogInError();
    }
}

/**
 * Öffnet das Overlay zum Hinzufügen eines neuen Kontakts.
 */
function addNewContact(){
    document.getElementById('overlay-add-contact').classList.remove('d-none');
    document.getElementById('overlay-add-contact').classList.add('d-flex');
    document.getElementById('overlay-add-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-add-contact').innerHTML = createNewContactHTML();
}

/**
 * Schließt das Overlay für das Hinzufügen eines neuen Kontakts, wenn auf den Hintergrund hinter dem Overlay geklickt wird.
 * @param {Event} event - Das Klick-Ereignis, das ausgelöst wurde.
 */
function closeOverlayNewContact(event) {
    var overlay = document.getElementById('overlay-add-contact');
    if (event.target === overlay) {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
    }
}

/**
 * Schließt das Overlay für die Bearbeitung eines Kontakts, wenn auf den Hintergrund hinter dem Overlay geklickt wird.
 * @param {Event} event - Das Klick-Ereignis, das ausgelöst wurde.
 */
function closeOverlayEditContact(event) {
    var overlay = document.getElementById('overlay-edit-contact');
    if (event.target === overlay) {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
    }
}

document.addEventListener('click', closeOverlayNewContact);
document.addEventListener('click', closeOverlayEditContact);

/**
 * Öffnet das Overlay zum Bearbeiten eines vorhandenen Kontakts.
 * @param {number} i - Der Index des zu bearbeitenden Kontakts.
 */
function editContact(i){
    document.getElementById('overlay-edit-contact').classList.remove('d-none');
    document.getElementById('overlay-edit-contact').classList.add('d-flex');
    document.getElementById('overlay-edit-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-edit-contact').innerHTML = createEditContactHTML(i);
}

/**
 * Schließt das Overlay zum Hinzufügen eines neuen Kontakts.
 */
function closeNewContactWindow(){
    document.getElementById('overlay-add-contact').classList.add('d-none');
    document.getElementById('overlay-add-contact').classList.remove('d-flex');
    document.getElementById('overlay-add-contact').classList.remove('overlay-add-contact');
}

/**
 * Schließt das Overlay zum Bearbeiten eines vorhandenen Kontakts.
 */
function closeEditContactWindow(){
    document.getElementById('overlay-edit-contact').classList.add('d-none');
    document.getElementById('overlay-edit-contact').classList.remove('d-flex');
    document.getElementById('overlay-edit-contact').classList.remove('overlay-add-contact');
}

/**
 * Erstellt einen neuen Kontakt basierend auf den eingegebenen Informationen.
 * Speichert den Kontakt und aktualisiert dann die Anzeige.
 */
 async function createAContact(){
    let mail = document.getElementById('contactMail');
    let number = document.getElementById('contactNumber');
    let createdAt = new Date().getTime();
    let firstName = getFirstName1();
    let lastName = getLastName1();
    let contactInfo = {
        "firstName" : firstName,
        "lastName" : lastName,
        "initials" : firstName.charAt(0) + lastName.charAt(0),
        "mail" : mail.value,
        "number" : number.value,
        "createdAt" : createdAt,
        "color": selectColor(),
    }
    contacts.push(contactInfo);
    await saveContact();
    closeNewContactWindow();
    initContacts();
    document.getElementById('right-side').classList.add('z-index');
    showOverlayCreated();
}

/**
 * Extrahiert den Vornamen aus dem Eingabefeld für den Kontakt.
 * @returns {string} Der Vornamen des Kontakts.
 */
function getFirstName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

/**
 * Extrahiert den Nachnamen aus dem Eingabefeld für den Kontakt.
 * @returns {string} Der Nachnamen des Kontakts.
 */
function getLastName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

/**
 * Extrahiert den Vornamen aus dem Eingabefeld für die Bearbeitung des Kontakts.
 * @returns {string} Der Vornamen des Kontakts.
 */
function getFirstName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

/**
 * Extrahiert den Nachnamen aus dem Eingabefeld für die Bearbeitung des Kontakts.
 * @returns {string} Der Nachnamen des Kontakts.
 */
function getLastName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

/**
 * Zeigt die Initialen des aktuellen Kontakts an.
 */
function showInitials(){
    let firstName = getFirstName1();
    let lastName = getLastName1();
    let initials = firstName.charAt(0) + lastName.charAt(0);
    document.getElementById('initials').innerHTML = initials;
}

/**
 * Rendert die Kontakte in der Benutzeroberfläche.
 */
function renderContact(){
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i]['firstName'];
        let firstLetterName = contact.charAt(0);
        document.getElementById(firstLetterName).innerHTML += createContactHTML(contact, firstLetterName, i);
    }
}

/**
 * Löscht einen Kontakt anhand seines Index.
 * @param {number} i - Der Index des zu löschenden Kontakts.
 */
async function deleteContact(i){
    document.getElementById(`contact-info${i}`).remove();
    if (previousContact === i) {
        previousContact = null;
    }
    contacts.splice(i, 1);
    await saveContact();
    loadContacts();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
    showOverlayDeleted();
}

/**
 * Löscht einen bearbeiteten Kontakt anhand seines Index.
 * @param {number} i - Der Index des zu löschenden Kontakts.
 */
async function deleteEditContact(i){
    contacts.splice(i, 1);
    await saveContact();
    loadContacts();
    document.getElementById('show-contact-infos').innerHTML = '';
    closeEditContactWindow();
    initContacts();
    showOverlayDeleted();
}

/**
 * Zeigt die Details eines Kontakts auf dem Desktop an.
 * @param {number} i - Der Index des anzuzeigenden Kontakts.
 */
function showContactDesktop(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
    document.getElementById('show-contact-infos').classList.add('hide-contact-infos');
    document.getElementById('show-contact-infos').classList.remove('show-contact-infos');
    showOverlayContact();
    if (previousContact !== null) {
        document.getElementById(`contact-info${previousContact}`).style.backgroundColor = 'white';
        document.getElementById(`contact-info${previousContact}`).style.color = 'black';
    }
    document.getElementById(`contact-info${i}`).style.backgroundColor = 'rgb(42,54,71)';
    document.getElementById(`contact-info${i}`).style.color = 'white';
    previousContact = i
}

/**
 * Entscheidet, ob die Details eines Kontakts auf mobilen Gerät oder Desktop angezeigt werden sollen.
 * @param {number} i - Der Index des anzuzeigenden Kontakts.
 */
function showContact(i){
    if (window.innerWidth < 1090){
        showContactMobile(i);
    } else {
        showContactDesktop(i);
    }
}

/**
 * Zeigt die Details eines Kontakts auf mobilen Geräten an.
 * @param {number} i - Der Index des anzuzeigenden Kontakts.
 */
function showContactMobile(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
    document.getElementById('right-side').classList.add('z-index');
    document.getElementById('show-contact-infos').classList.remove('hide-contact-infos');
    document.getElementById('mobile-menu').classList.remove('d-none');
    if (previousContact !== null) {
        document.getElementById(`contact-info${previousContact}`).style.backgroundColor = 'white';
        document.getElementById(`contact-info${previousContact}`).style.color = 'black';
    }
    document.getElementById(`contact-info${i}`).style.backgroundColor = 'rgb(42,54,71)';
    document.getElementById(`contact-info${i}`).style.color = 'white';
    previousContact = i;
}

/**
 * Wechselt zur Kontaktliste-Ansicht.
 */
function backToList(){
    document.getElementById('right-side').classList.remove('z-index');
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('blue-underline').classList.add('d-none');
}

/**
 * Öffnet das mobile Menü für die Kontakte.
 */
function openMobileMenu(){
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('edit-delete-mobile').classList.remove('d-none');
    document.getElementById('edit-delete-mobile').classList.add('edit-delete-mobile');
    document.getElementById('show-contact-infos').addEventListener("click", function(){
        document.getElementById('edit-delete-mobile').classList.add('d-none');
        document.getElementById('mobile-menu').classList.remove('d-none');
    }) 
}

/**
 * Zeigt das Overlay für die Kontaktinformationen an.
 */
function showOverlayContact() {
    setTimeout(() => {
      document.getElementById('show-contact-infos').classList.add('show-contact-infos');
    }, 225);
}

/**
 * Zeigt das Overlay für die Erfolgsmeldung bei der Kontakt-Erstellung an.
 */
function showOverlayCreated() {
    document.getElementById('successfully-created').classList.add('show-successfully-created');
    setTimeout(() => {
      document.getElementById('successfully-created').classList.remove('show-successfully-created');
    }, 2000);
}

/**
 * Zeigt das Overlay für die Erfolgsmeldung bei der Kontaktlöschung an.
 */
function showOverlayDeleted() {
    document.getElementById('successfully-deleted').classList.add('show-successfully-deleted');
    setTimeout(() => {
      document.getElementById('successfully-deleted').classList.remove('show-successfully-deleted');
    }, 2000);
}

/**
 * Zeigt das Overlay für die Erfolgsmeldung bei der Kontaktspeicherung an.
 */
function showOverlaySaved() {
    document.getElementById('successfully-saved').classList.add('show-successfully-saved');
    setTimeout(() => {
      document.getElementById('successfully-saved').classList.remove('show-successfully-saved');
    }, 2000);
}

/**
 * Bearbeitet einen vorhandenen Kontakt.
 * @param {number} i - Der Index des zu bearbeitenden Kontakts.
 */
async function editAContact(i){
    contacts.splice(i, 1);
    let mail = document.getElementById('editMail');
    let number = document.getElementById('editNumber');
    let createdAt = new Date().getTime();
    let firstName = getFirstName2();
    let lastName = getLastName2();
    let contactInfo = {
        "firstName" : firstName,
        "lastName" : lastName,
        "initials" : firstName.charAt(0) + lastName.charAt(0),
        "mail" : mail.value,
        "number" : number.value,
        "createdAt" : createdAt,
        "color": selectColor(),
    }
    contacts.push(contactInfo);
    await saveContact();
    closeEditContactWindow();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
    showOverlaySaved();
}

/**
 * Füllt das Array 'letters' mit den Anfangsbuchstaben der Kontakte.
 */
function fillLetters() {
    letters = [];
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['firstName'];
        let letter = name.charAt(0);
        if (!letters.includes(letter)) {
            letters.push(letter);
        }
    }
    letters.sort();
}

/**
 * Lädt die Anfangsbuchstaben der Kontakte in die Benutzeroberfläche.
 */
function loadLetters() {
    let container = document.getElementById('contact-area');
    container.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        const element = letters[i];
        container.innerHTML += createLetterHTML(element, i);
    };
}