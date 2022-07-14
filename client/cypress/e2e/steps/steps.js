import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { buildRoute, buildComponentButtonClass, generateRandIntEndsInclusive } from './steps_helper';

import { v4 as uuidv4 } from 'uuid';

// ROUTING
Given('I am on the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
Then('I go to the {string} page', (pageDescription) => {
    cy.visit(buildRoute(pageDescription));
});
When('I go to the {string} page with saved progress', (pageDescription) => {
    cy.saveLocalStorage();
    cy.wait(2000);

    cy.visit(buildRoute(pageDescription), {
        onBeforeLoad(win) {
            const KEY = 'redux';
            const previousState = win.localStorage.getItem(KEY);
            win.localStorage.setItem(KEY, previousState);
        }
    });
});
And('I should be on the {string} page', (pageDescription) => {
    cy.url().should('eq', buildRoute(pageDescription));
});

// general helpers
Then('I fill in the input field for {string} with {string}', (inputContent, newContent) => {
    cy.get(`input[placeholder="${inputContent}"]`).type(newContent);
})
Then('I fill in the input field for {string} with unique input', (inputContent) => {
    const randomString = uuidv4();
    cy.get(`input[placeholder="${inputContent}"]`).type(randomString);
})
Then('I should see {string}', (text) => {
    cy.get('body').contains(text);
})

// ----------- work_order.feature ------------------
When('I click on the next button', () => {
    cy.intercept('POST', 'workorders').as('createWorkorder');
    cy.get('.submit-workorder-btn').click();
    cy.wait('@createWorkorder');
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
    }).as('registrationCallback');
    
    cy.window().then(win => {
        cy.stub(win.registerComponent, 'registerCredentialExposed', () => {
            return new Promise((resolve, reject) => {
                const credentialDataDouble = {
                    challenge: '1234',
                    pubKeyCredential: {},
                    userAttributes: {
                        "created_at": null,
                        "id": null,
                        "updated_at": null,
                        "username": "test",
                        "webauthn_id": "abcdefghijkl"
                    }
                }
                resolve(credentialDataDouble);
            })
        })
    });

    // click must be BEHIND intercept
    cy.get('.register-btn').click();
    cy.wait('@registration');
    cy.wait('@registrationCallback');
});
When('I click on the Log In Now button', () => {
    cy.get('.redirect-login-btn').click();
})

// -------------- login.feature ----------------
Then('I click on the log in button', () => {
    cy.get('.login-btn').click();
})

// // ------------- status_of_components.feature ------------------
Then('the component {string} button colour should be {string}', (componentName, color) => {
    const componentButtonClass = buildComponentButtonClass(componentName);
    let backgroundColor;
    switch (color) {
        case 'red':
            backgroundColor = 'rgb(255, 245, 245)';
            break;
        case 'green':
            backgroundColor = 'rgb(235, 251, 238)';
            break;
        case 'yellow':
            backgroundColor = 'rgb(255, 249, 219)';
            break;
    }
    cy.get(componentButtonClass).should('have.css', 'background-color', backgroundColor);
})
And('I click on the pass button', () => {
    cy.get('.photo-review-status-btn--pass').click();
})
And('I click on the fail button', () => {
    cy.get('.photo-review-status-btn--fail').click();
})
And('I click on the proceed button', () => {
    cy.get('.proceed-btn').click();
})
// And('I click on the upload button', () => {
    
// })
When('I enter in some failing reasons', () => {
    const failingReasonsTextAreaPlaceholder = 'Type one reason at a time';
    const randomNum = generateRandIntEndsInclusive(1, 5);
    for (let i = 0; i < randomNum; i++) {
        cy.get(`textarea[placeholder="${failingReasonsTextAreaPlaceholder}"]`).type(`reason ${i}`);
        cy.get('.enter-reason-btn').click();
    }
})

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