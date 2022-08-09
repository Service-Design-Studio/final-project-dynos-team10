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

Then('I should see {string} in the "Failing Reasons" list', (text) => {
    cy.get('.failing-reasons-list').contains(text);
})

And('I fill in the input field for {string} with {string}', (inputContent, newContent) => {
    cy.get(`input[placeholder="${inputContent}"]`).type(newContent);
})

// Then('I should see {string}', (text) => {
//     cy.get('.errors').contains(text);
// })

Then('I should see {string}', (text) => {
    cy.wait(500);
    cy.get('body').contains(text);
})

// couldn't get this to work
Then('I should see {string} in the {string}', (text, list) => {
    cy.get(list).contains(text);
})

When('I click on {string} button in list', (text) => {
    cy.get(`button[id="${text}"]`).click();
})

Then('I should see {string} components in the component list', (number) => {
    cy.get('component-list').children().should('have.length', +number);
})




// workorders page

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
And('I click on "Edit Components" button for {string}', (text) => {
    cy.get(`.${text}`).click()
})

And('I click on "Edit Failing Reasons" button for {string}', (text) => {
    cy.get(`.${text}`).click()
})

Then('I should see {string} in the side drawer with components list', (text) => {
    cy.get('.side-drawer-components').contains(text)
})

Then('I should see {string} in the side drawer with failing reasons list', (text) => {
    cy.get('.side-drawer-reasons').contains(text)
})

And('I select {string}', (text) => {
    cy.get(`input[id="${text}"]`).click();
})

And('I click on the close icon', () => {
    cy.get('.mantine-Drawer-closeButton').click();
})

Then('I should see {string} as a component for {string}', (item, text) => {
    cy.get(`[id=${text}]`).children().contains(item);
})

When('I close the {string} dropdown button', (text) => {
    cy.get(`button[id="${text}"]`).click();
})

Then('I should see {string} as a failing reason for {string}', (item, text) => {
    cy.get(`[id=${text}]`).children().contains(item);
})

When('I delete {string} for component type', (text, type) => {
    cy.get(`[id=${text}-delete]`).click();
})

When('I delete "Machine1" for machine type', () => {
    cy.get(`[id=MACHINE1-delete]`).click();
})

When('I delete {string} for failing reason', (text, type) => {
    cy.get(`[id=${text}-delete]`).click();
})

Then('I should not see {string} in the {string} list', (text, list) => {
    cy.get(`button[id="${text}"]`).should('not.exist');
})