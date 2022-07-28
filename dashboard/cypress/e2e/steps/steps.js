import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { buildRoute } from './steps_helper';
import { v4 as uuidv4 } from 'uuid';


// ROUTING
Given('I am on the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
Then('I go to the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
And('I should be on the {string} page', (pageDescription) => {
    cy.url().should('eq', buildRoute(pageDescription));
});

And('I click the {string} button in the navbar', (buttonName) => {
    cy.get(".system-control-btn ").click();
});

When('I fill in the input field for {string}', (inputContent, newContent) => {
    const randomString = uuidv4();
    cy.get(`input[placeholder="${inputContent}"]`).type(randomString);
})


And('I press the "add machine" button', () => {
    cy.get('.add-machine-btn').click();
})

And('I press the "add component" button', () => {
    cy.get('.add-component-btn').click();
})

Then('I should see {string} in the "Component Types" list', (text) => {
    cy.get('.component-list').contains(text);
})

Then('I should see {string} in the "Machine Types" list', (text) => {
    cy.get('.machine-list').contains(text);
})

And('I fill in the input field for {string} with {string}', (inputContent, newContent) => {
    cy.get(`input[placeholder="${inputContent}"]`).type(newContent);
})

Then('I should see {string}', (text) => {
    cy.get('.errors').contains(text);
})

//LAST SCENARIO THE PROBLEM ONE
When('I click add components for machine type {string}', () => {
    cy.get('.errors').click();
})

Then('I should see a side panel to edit {string}', (text) => {
    cy.get('.errors').contains(text);
})

When('I choose {string} ', ()=>{

})

And('I close the side panel', () => {

})

When('I expand {string}', () => {

})

Then('I should see the component types {string}', () => {

})


//the one below is done
And('I should see a "Edit Components" button', () => {
    cy.get('.edit').click()
})