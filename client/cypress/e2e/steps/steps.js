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
    cy.get('input[placeholder="Machine Type"]').click();
    cy.get('.mantine-Select-item:first').click();
})
When('I click on the next button', () => {
    cy.intercept('POST', 'workorders').as('createWorkorder');
    cy.get('.submit-workorder-btn').click();
    cy.wait('@createWorkorder');
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
    cy.wait(2000);
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
    cy.wait(2000);
    for (let i = 0; i < +times; i++) {
        cy.get('.take-photo-btn').click();
    }
});

// Scenario: Leaving photo review page before uploading all photos of component xxx
Given('I am on the camera page of component {string}', (componentName) => {
    cy.visit(buildRoute('take photo'));
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.get(componentButtonClass).click();
    cy.wait(2000);
    cy.get('.take-photo-btn').click();
});
And('I click on the back button', () => {
    cy.wait(2000);
    cy.get('.back-btn').click();
})

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

// --------------- register.feature ------------------------
Then('I click on the register button', () => {
    cy.get('.register-btn').click();
});
Then('I click on the register button, expecting {string}', (expectedOutcome) => {
    let stubbingFixture, statusCode;
    switch(expectedOutcome) {
        case "success":
            // for successful login, we stub the FIRST request, and not request for credentials
            // hence we throw a network error and STOP all subsequent lines in the click handler
            stubbingFixture = 'registration/successful.json';
            statusCode = 200;
            break;
        case "username is not unique":
            stubbingFixture = 'registration/username-taken.json';
            statusCode = 422;
            break;
    }
    cy.intercept('POST', 'registration', req => {
        // prevent the request from actually reaching the server and stub response with fixture
        req.reply({
            fixture: stubbingFixture,
            statusCode
        })
    }).as('registration');
    cy.intercept('POST', 'registration/callback', req => {
        // prevent the request from actually reaching the server and stub response with fixture
        req.reply({
            statusCode: 200
        })
    })
    cy.wait('@registration');
    cy.wait(10000);
    cy.get('.register-btn').click(); // click must be BEHIND intercept
});
When('I click on the Log In Now button', () => {
    cy.get('.redirect-login-btn').click();
})

// -------------- login.feature ----------------
Then('I click on the log in button', () => {
    cy.get('.login-btn').click();
})

// // ------------- status_of_components.feature ------------------
// //Scenario: uploading photos to the component "xxx" manual check page
// Given('I am on the status of component {string} manual check page', (componentName) => {
//     cy.visit(buildRoute('status of component {string} manual check'));
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get(componentButtonClass).click();
// })
// And('I click on the upload photo button', () => {
//     cy.get('.upload-photo-btn').click();
// })
// And('my camera should open',() => {
//         cy.get('.camera').should('exist');
// })
// And('the pass button turns {string}',(colour) => {
//     cy.get('pass-btn').should('have.class', `.${colour}__btn`)
// });
// And('the fail button turns {string}',(colour) => {
//     cy.get('fail-btn').should('have.class', `.${colour}__btn`)
// });

// // Scenario: component xxx passing manual check
// Given('the pass button of component {string} turns {string}', (componentName,green) => {
//     cy.visit(buildRoute('status of component {string} manual check clicked'));
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get('pass-btn').should('have.class', `.${green}__btn`);
// })
// And('the fail button turns {string}', (red) => {
//     cy.get('fail-btn').should('have.class', `.${red}__btn`);
// })
// Then('I click on the pass button', () => {
//     cy.wait(2000);
//     cy.get('.pass-btn').click();
// })
// Then('I am on the manual status pass page',() => {
//     cy.visit(buildRoute('manual status pass'));
// })
// And('the done button turns {string}',(blue) => {
//     cy.get('done-btn').should('have.class', `.${blue}__btn`);
// })
// Then('I am on the status of components page', () => {
//     cy.visit(buildRoute('status of components'));
// })
// And('the component {string} button turns {string}}',(componentName,colour) => {
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get(componentButtonClass).should('have.class', `.${colour}__btn`)
// })

// // Scenario: component xxx failing manual check
// Given('the fail button of component {string} turns {string}', (componentName,green) => {
//     cy.visit(buildRoute('status of component {string} manual check clicked'));
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get('pass-btn').should('have.class', `.${green}__btn`);
// })
// And('the fail button turns {string}', (red) => {
//     cy.get('fail-btn').should('have.class', `.${red}__btn`);
// })
// Then('I click on the fail button', () => {
//     cy.wait(2000);
//     cy.get('.fail-btn').click();
// })
// Then('I am on the manual status fail page',(componentName) => {
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.visit(buildRoute('manual status fail'));
// })
// Then('I fill in the input field for {string} with {string}', (inputContent, newContent) => {
//     cy.get(`input[placeholder="${inputContent}"]`).type(newContent);
// })
// Then('the done button turns {string}',(blue) => {
//     cy.get('done-btn').should('have.class', `.${blue}__btn`);
// })
// Then('I am on the status of components page', (componentName) => {
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.visit(buildRoute('status of components'));
// })
// And('the component {string} button turns {string}}',(componentName,colour) => {
//         const componentButtonClass = buildComponentButtonClass(componentName);
//         cy.get(componentButtonClass).should('have.class', `.${colour}__btn`)
// })


// //Scenario: exiting component xxx check before submitting all photos of Component xxx
// Given('I have taken multiple photos of component {string}', (componentName) => {
//     // reused step 1: I am on the {status of components} page
//     cy.visit(buildRoute('status of components'));
//     // reused step 2: I click on component {string} button
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get(componentButtonClass).click();
//     // (reused) step 3: Take at least 1 photo
//     cy.get('.take-photo-btn').click();
// })
// And('I am on the photo review page', () => {
//     cy.visit(buildRoute('photo review'));
// })
// And('the component {string} button turns {string}}',(componentName,colour) => {
//     const componentButtonClass = buildComponentButtonClass(componentName);
//     cy.get(componentButtonClass).should('have.class', `.${colour}__btn`)
// })