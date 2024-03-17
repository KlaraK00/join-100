async function initPrivacyPolicy() {
    await includeHTML();
    hideUserIcon();
    ifLoggedOutHideMenuButtons();
 }