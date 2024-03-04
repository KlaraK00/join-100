async function initBoard() {
    await includeHTML();
    await loadContacts();
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
}