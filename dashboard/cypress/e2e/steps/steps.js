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
    const startingMatcher = new RegExp('^' + buildRoute(pageDescription));
    cy.url().should('match', startingMatcher);
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
    cy.get(`input[placeholder="${inputContent}"]`).clear().type(newContent);
})

Then('I should see {string}', (text) => {
    cy.wait(500);
    cy.get('body').contains(text);
})
Then('I should not see {string}', (text) => {
    cy.wait(500);
    cy.get('body').contains(text).should('not.exist');
})

Then('I should see {string} in the {string}', (text, list) => {
    cy.get(list).contains(text);
})

When('I click on {string} button in list', (text) => {
    cy.get(`button[id="${text}"]`).click();
})

Then('I should see {string} components in the component list', (number) => {
    cy.get('component-list').children().should('have.length', +number);
})

When('I click add components for machine type {string}', () => {
    cy.get('.errors').click();
})

Then('I should see a side panel to edit {string}', (text) => {
    cy.get('.errors').contains(text);
})

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

// ----------------- workorders page -------------
Then('I should see {string} workorders search results', (number) => {
    cy.intercept('GET', 'workorders/page/1?**').as('searchWorkorders');
    cy.wait('@searchWorkorders');
    cy.wait(1000);
    // cy.get('.workorders-list').find('tr').should('have.length', number);
    cy.get('tr').should(($tr) => {
        // should have found 3 elements
        expect($tr).to.have.length(+number+1)
})})

And('I click the "more details" button for {string}', (workorderNumber) => {
    cy.get(`.${workorderNumber}`).click();
})

Then('I go to {string} page for "test"', (page) => {
    cy.visit(buildRoute(page));
})

And('I should see {string} components in the carousel', (number) => {
    cy.get('#carousel-parent .mantine-Carousel-slide').should('have.length', +number);
})

And('I click on "View Images" button for {string}', (component) => {
    cy.get(`.single-workorder-${component}`).click();
})

And('I should see {string} for {string}', (status, component) => {
    cy.get(`#status-${component}`).contains(status);
})

Then('I should see {string} images in the carousel for {string}', (number, component) => {
    cy.get(`#${component}-images .mantine-Carousel-slide`).should('have.length', +number)
})

// -------------- analytics feature -----------------
When('I select the {string} analytics tab', tabName => {
    // intercept all requests for analytics
    const statusCode = 200;
    cy.intercept('GET', 'date-range-query?start=**', req => {
        req.reply({
            statusCode,
            fixture: 'analytics/workorders/empty.json'
        })
    }).as('analyticsWorkorders');
    cy.intercept('GET', 'machine-types**', req => {
        req.reply({
            statusCode,
            fixture: 'analytics/machine-types/empty.json'
        })
    }).as('analyticsMachineTypes');
    cy.intercept('GET', 'machine-type-failing-reasons**', req => {
        req.reply({
            statusCode,
            fixture: 'analytics/failing-reasons/empty.json'
        })
    }).as('analyticsFailingReasons');
    cy.wait('@analyticsWorkorders');
    cy.wait('@analyticsMachineTypes');
    cy.wait('@analyticsFailingReasons');

    cy.get(`.analytics-tab-btn[data-tabname="${tabName}"]`).click();
})

And('I drag the slider to some day, expecting {string} for {string}', (withResults, category) => {
    cy.visit(buildRoute('home'));
    const statusCode = 200;
    const fixturePathSuffix = withResults !== 'results' ? 'empty.json' : 'success.json';
    let fixturePath;
    switch (category) {
        case 'Pass/Fail by Workorders':
            fixturePath = 'analytics/workorders/' + fixturePathSuffix;
            cy.intercept('GET', 'date-range-query?start=**', req => {
                req.reply({
                    statusCode,
                    fixture: fixturePath
                })
            }).as('analyticsWorkorders');
            cy.wait('@analyticsWorkorders');
            break;
        case 'Pass/Fail by Machine Types':
            fixturePath = 'analytics/machine-types/' + fixturePathSuffix;
            cy.intercept('GET', 'machine-types**', req => {
                req.reply({
                    statusCode,
                    fixture: fixturePath
                })
            }).as('analyticsMachineTypes');
            cy.wait('@analyticsMachineTypes');
            break;
        case 'Failing Reasons by Machine Types':
            fixturePath = 'analytics/failing-reasons/' + fixturePathSuffix;
            cy.intercept('GET', 'machine-type-failing-reasons**', req => {
                req.reply({
                    statusCode,
                    fixture: fixturePath
                })
            }).as('analyticsFailingReasons');
            cy.wait('@analyticsFailingReasons');
            break;
    }
    cy.get(`.analytics-tab-btn[data-tabname="${category}"]`).click();
})