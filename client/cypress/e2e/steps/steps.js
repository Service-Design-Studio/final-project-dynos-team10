import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { buildRoute, buildComponentButtonClass } from './steps_helper';

// ROUTING
Given('I am on the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
And('I should be on the {string} page', (pageDescription) => {
    cy.url().should('eq', buildRoute(pageDescription));
});


// ----------- work_order.feature ------------------
Then('I fill in the input field for {string} with {string}', (inputContent, newContent) => {
    cy.get(`input[placeholder="${inputContent}"]`).type(newContent);
})
And('I select some option in select field for machine type', () => {
    cy.get('.machine-type-select').select(1);
})
When('I click on the next button', () => {
    cy.get('.submit-workorder-btn').click();   
})
Then('I should see {string}', (text) => {
    cy.get('body').contains(text);
})



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
    cy.wait(1000);
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
    cy.wait(1000);
    for (let i = 0; i < +times; i++) {
        cy.get('.take-photo-btn').click();
    }
});

// Scenario: Review the photos and upload
Given('I am on the photo review page of component {string}', (componentName) => {
    // reused step 1: I am on the {status of components} page
    cy.visit(buildRoute('status of components'));
    // reused step 2: I click on component {string} button
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.get(componentButtonClass).click();
    // (reused) step 3: Take at least 1 photo
    cy.get('.take-photo-btn').click();
    // (reused) step 4: click right arrow to go to photo review
    cy.get('.to-photo-review-btn').click();
})
Then('I should see all my photos in the carousel', () => {
    cy.get('.photo-carousel').should('exist');
})
And('I should see the {string} icon', (iconType) => {
    cy.get(`.photo-review-status-btn--${iconType}`).should('exist');
})
// And('I click on the "upload" button', () => {
    
// });
// Then('I see a prompt "successfully uploaded"',() => {
// });
// And('I am on the manual check page',  () => {
//     cy.visit(DEV_SERVER_URL);
// })

// Feature: delete photo
// I want to delete photo(s) from Photo Review page
// Scenario: Review the photos and delete
Given('I am on the photo review page of component {string} with {string} photos', (componentName, numPhotos) => {
    // reused step 1: I am on the {status of components} page
    cy.visit(buildRoute('status of components'));
    // reused step 2: I click on component {string} button
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.get(componentButtonClass).click();
    // (reused) step 3: Take at multiple photos
    for (let i = 0; i < +numPhotos; i++) {
        cy.get('.take-photo-btn').click();
    }
    // (reused) step 4: click right arrow to go to photo review
    cy.get('.to-photo-review-btn').click();
})
When('I am viewing a photo', () => {
    
})
And('I click on the "delete" button', () => {
    cy.get('.photo-review-delete-btn').click();
});
Then('the photo is removed from the carousel', () => {

});
And('I should see {string} photos in the carousel', (numPhotos) => {
    cy.get('.MuiMobileStepper-dots').children().should('have.length', +numPhotos);
})

Then('I should see a Go Back To Camera button', () => {
    cy.get('.photo-review-camera-btn--secondary').should('exist');
});