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

And('I click the {string} button in the navbar', () => {
    cy.get(".controls").click();
});

When('I fill in the input field for {string}', (inputContent) => {
    const randomString = uuidv4();
    cy.get(`input[placeholder="${inputContent}"]`).type(randomString);
})

And('I click the "add machine" button', () => {
    cy.get('.add-machine-btn').click();
})

And('I click the "add component" button', () => {
    cy.get('.add-component-btn').click();
})

And('I click the "add failing reason" button', () => {
    cy.get('.add-failing-btn').click();
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

// Then('I should see {string}', (text) => {
//     cy.get('.errors').contains(text);
// })

Then('I should see {string}', (text) => {
    cy.get('body').contains(text);
})

// couldn't get this to work
Then('I should see {string} in the {string}', (text, list) => {
    cy.get(list).contains(text);
})

When('I click on "Machine Type 1" button', () => {
    cy.get('.Machine Type 1').contains("Machine Type 1")
})

Then('I should see {string} workorders', (number) => {
    cy.get('.workorders-list').should('have.length', +number);
})

And('I click the "more details" button for {string}', (workorderNumber) => {
    cy.get(`.${workorderNumber}`).click();
})

Then('I go to {string} page for "test"', (page) => {
    cy.visit(buildRoute(page));
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