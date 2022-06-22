import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { DEV_SERVER_URL, buildRoute } from './steps_helper';

Then(`I see {string} in the title`, (title) => {
    cy.title().should('include', title);
})
// ROUTING
Given('I am on the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
And('I should be on the {string} page', (pageDescription) => {
    cy.url().should('eq', buildRoute(pageDescription));
});


// Scenario: Opening the camera function
And('I click on component {string} button', (componentName) => {
    const componentButtonClass = `.${componentName.toLowerCase().split(' ').join('-')}__btn`
    cy.get(componentButtonClass).click();
});
Then('my camera should open',() => {
    cy.get('.camera').should('exist');
});

// Scenario: Taking one photo of component xxx
Given('I am on the camera page of {string}', () => {
    cy.visit(DEV_SERVER_URL);
})
And('I click on the {string} button', () => {
});
Then('I see the photo taken',() => {
});
And('I click on the "Done" button',() => {
});
Then('I am on the photo review page',  () => {
    cy.visit(DEV_SERVER_URL);
});
//  Scenario: Taking multiple photo of component xxx
Given('I am on the camera page of {string}', () => {
    cy.visit(DEV_SERVER_URL);
})
And('I click on the {string} button', () => {
});
Then('I see the photo taken',() => {
});
When('I click on the "+" button',() => {
});
Then(`I am on the camera page`,  () => {
    cy.visit(DEV_SERVER_URL);
})
And('I see a counter', () => {
});
And('I continue taking pictures by clicking on the "+" button', () => {
});
Then('I am on the photo review page', () => {
    cy.visit(DEV_SERVER_URL);
})

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
