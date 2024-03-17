/**
 * Initializes the legal notice page.
 * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
 */
async function initLegalNotice() {
  await includeHTML();
  hideUserIcon();
  ifLoggedOutHideMenuButtons();
}
