import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { DEV_SERVER_URL, buildRoute, buildComponentButtonClass } from './steps_helper';

// ROUTING
Given('I am on the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
And('I should be on the {string} page', (pageDescription) => {
    cy.url().should('eq', buildRoute(pageDescription));
});

// general steps
// And('I should see an input field for {string}', (inputContent) => {
//     cy.get('input').invoke('attr', 'placeholder').should(($inputPlaceholder) => {
//         expect($inputPlaceholder.toLowerCase()).to.equal(inputContent.toLowerCase());
//     });
// })
// And('I should see a {string} button', (buttonTextContent) => {
//     cy.get('body').then(body => {
//         expect(body.find(`button[textContent=${buttonTextContent}]`).length).to.be.greaterThan(0);
//     })
// })

// ----------- work_order.feature ------------------



// ------------- take_photo.feature ------------------
// Scenario: Opening the camera function
And('I click on component {string} button', (componentName) => {
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.get(componentButtonClass).click();
});
Then('my camera should open',() => {
    cy.get('.camera').should('exist');
});

// Scenario: Taking one photo of component xxx
// Is there a better way to do the below step? It seems to be a combination of other steps
Given('I am on the camera page of component {string}', (componentName) => {
    // reused step 1: I am on the {status of components} page
    cy.visit(buildRoute('status of components'));
    // reused step 2: I click on component {string} button
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.get(componentButtonClass).click();
})
And('I click on the take photo button', () => {
    cy.get('.take-photo-btn').click();
});
Then('I should see the counter showing {string}', (count) => {
    cy.get('.counter').contains(count);
});
When('I click on the right arrow button',() => {
    cy.get('.to-photo-review-btn').click();
});

//  Scenario: Taking multiple photo of component xxx
When('I click on the take photo button {string} times', (times) => {
    for (let i = 0; i < +times; i++) {
        cy.get('.take-photo-btn').click();
    }
});

// Scenario: Review the photos and upload
Given('I am on the photo review page of {string}', () => {
    cy.visit(DEV_SERVER_URL);
})
And('I click on the "upload" button', () => {
});
Then('I see a prompt "successfully uploaded"',() => {
});
And('I am on the manual check page',  () => {
    cy.visit(DEV_SERVER_URL);
})

// Feature: delete photo
// I want to delete photo(s) from Photo Review page
// Scenario: Review the photos and delete
Given('I am on the photo review page of {string}', () => {
    cy.visit(DEV_SERVER_URL);
})
And('I click on the "delete" button', () => {
});
Then('the photo is removed from the carousel', () => {
});
