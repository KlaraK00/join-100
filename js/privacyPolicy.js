/**
 * Initializes the privacy policy page.
 * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
 */
async function initPrivacyPolicy() {
    await includeHTML();
    hideUserIcon();
    ifLoggedOutHideMenuButtons();
}
