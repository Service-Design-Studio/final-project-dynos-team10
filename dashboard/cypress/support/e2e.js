// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// CATCHING TEST FAILS
// https://docs.cypress.io/api/events/catalog-of-events#Catching-Test-Failures
// Check if no API request was made, e.g. a button calls an API but does client-side validation first
// If client-side validation fails, it does not make an API request hence cy.wait() fails
// reassess this for unintended consequences for network calls
Cypress.on('fail', (error, runnable) => {
    if (error.message.toLowerCase().includes('no request ever occurred')) {
        return false;
    }
    throw error;
});