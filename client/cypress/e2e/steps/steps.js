import { Given, Then, When, And } from "cypress-cucumber-preprocessor/steps";

import { buildRoute, buildComponentButtonClass, generateRandIntEndsInclusive, failingReasonsTextAreaPlaceholder } from './steps_helper';

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
    // cy.url().should('eq', buildRoute(pageDescription));
    const startingMatcher = new RegExp('^' + buildRoute(pageDescription));
    cy.url().should('match', startingMatcher);
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
When('I click on the {string} button', (buttonText) => {
    cy.contains(buttonText).click();
})

// ----------- work_order.feature ------------------
When('I click on the next button, expecting success', () => {
    cy.intercept('POST', 'workorders').as('createWorkorder');
    cy.get('.submit-workorder-btn').click();
    cy.wait('@createWorkorder');
})
When('I click on the next button', () => {
    cy.get('.submit-workorder-btn').click();
})
And('I select {string} for machine type', (machineTypeVal) => {
    cy.get(`input[placeholder="MACHINE TYPE"]`).click();
    cy.contains(machineTypeVal).click();
})
Then('I should see camera or upload', () => {
    cy.get('.options-modal').should('exist');
})
When('I choose {string} from the options', (option) => {
    const optionButtonClass = `.options-modal__${option}-btn`;
    cy.get(optionButtonClass).click();
})


// ------------- take_photo.feature ------------------
And('I click on the new entry button', () => {
    cy.get('.home__new-entry-btn').click();
})
And('I click on the drafts button', () => {
    cy.get('.home__drafts-btn').click();
})
When('I select the {string} workorder', (workorderNumber) => {
    cy.contains(workorderNumber).click();
})

// Scenario: Opening the camera function
And('I click on component {string} button', (componentName) => {
    const componentButtonClass = buildComponentButtonClass(componentName);
    cy.wait(2000);
    cy.get(componentButtonClass).click();
});
Then('my camera should open',() => {
    cy.get('.camera').should('exist');
});

// Scenario: Taking one photo of component xxx
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
When('I am viewing a photo', () => {
    
})
And('I click on the delete button', () => {
    cy.get('.photo-review-delete-btn').click();
});
And('I click on the delete button {string} times', (times) => {
    for (let i = 0; i < +times; i++) {
        cy.get('.photo-review-delete-btn').click();
    }
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
Then('I click on the register button without a credential nickname, expecting {string}', (expectedOutcome) => {
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
    
    // click must be BEHIND intercept
    cy.get('.register-btn').click();
    cy.wait('@registration');
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
Then('I click on the log in button with device credentials, expecting {string}', (expectedOutcome) => {
    let stubbingFixture, statusCode;
    switch(expectedOutcome) {
        case "success":
            // for successful login, we stub the FIRST request, and not request for credentials
            // hence we throw a network error and STOP all subsequent lines in the click handler
            stubbingFixture = 'login/successful.json';
            statusCode = 200;
            break;
        case "username does not exist":
            stubbingFixture = 'login/username-unknown.json';
            statusCode = 422;
            break;
    }

    cy.intercept('POST', 'session', req => {
        req.reply({
            fixture: stubbingFixture,
            statusCode
        })
    }).as('session');
    cy.intercept('POST', 'session/callback', req => {
        req.reply({
            statusCode: 200,
            fixture: 'login/successful-final.json'
        })
    }).as('sessionCallback');
    
    cy.window().then(win => {
        cy.stub(win.loginComponent, 'authenticateExposed', () => {
            return new Promise((resolve, reject) => {
                const pubKeyCredentialDouble = {};
                resolve(pubKeyCredentialDouble);
            })
        })
    });

    cy.get('.login-btn--credentials').click();
    cy.wait('@session');
    cy.wait('@sessionCallback');
})
Then('I click on the log in button, expecting {string}', (expectedOutcome) => {
    let stubbingFixture, statusCode;
    switch(expectedOutcome) {
        case "success":
            // for successful login, we stub the FIRST request, and not request for credentials
            // hence we throw a network error and STOP all subsequent lines in the click handler
            stubbingFixture = 'login/successful-final.json';
            statusCode = 200;
            break;
        case "username does not exist":
            stubbingFixture = 'login/username-unknown.json';
            statusCode = 422;
            break;
    }

    cy.intercept('POST', 'session', req => {
        req.reply({
            fixture: stubbingFixture,
            statusCode
        })
    }).as('session');

    cy.get('.login-btn').click();
    cy.wait('@session');
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
        case 'blue':
            backgroundColor = 'rgb(231, 245, 255)';
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
And('I click on the upload button', () => {
    // cy.intercept('GET', 'workorders?workorder_number=**', req => {
    //     req.reply({
    //         fixture: 'pass-fail/query-workorder-id.json'
    //     })
    // }).as('workorders');
    // cy.intercept('POST', 'components', req => {
    //     req.reply({
    //         fixture: 'pass-fail/create-component.json'
    //     })
    // }).as('components');
    // cy.intercept('POST', 'images/batch', req => {
    //     req.reply({
    //         fixture: 'pass-fail/image-batch-create.json'
    //     })
    // }).as('images-batch-create');
    cy.intercept('GET', 'workorders?workorder_number=**').as('workorders');
    cy.intercept('POST', 'components').as('components');
    cy.intercept('POST', 'images/batch').as('images-batch-create');
    cy.get('.upload-btn').click();
    cy.wait('@workorders');
    cy.wait('@components');
    cy.wait('@images-batch-create');
})
When('I select some failing reasons', () => {
    const clickSelectInput = () => {
        cy.get(`input[placeholder="Scroll to Add Reasons"]`).click();
    }
    clickSelectInput(); // click the select field to reveal dropdown
    cy.get('.mantine-Select-item').then($els => {
        const numberFailingReasons = $els.length;
        for (let i = 0; i < numberFailingReasons; i++) {
            clickSelectInput(); // always reveal dropdown before selecting, because upon previous selection the dropdown closes
            const randomNum = generateRandIntEndsInclusive(0, 1); 
            if (randomNum === 1 || i === 0) cy.get('.mantine-Select-item').first().click(); //guarantee at least 1 reason (first reason)
        }
    });
})
When('I select {string} failing reasons', (number) => {
    let counter = number;
    cy.get(`input[placeholder="Scroll to Add Reasons"]`).click();
    cy.get('.mantine-Select-item').each(item => {
        if (counter > 0) {
            cy.wrap(item).click();
            counter--;
        }
    })
})
When('I click on the close icon', () => {
    cy.get('.mantine-Modal-close').click();
})
Then('I should see some failing reasons', () => {
    cy.get('.reasons-list').children().should((list) => {
        expect(list).to.have.length.of.at.least(1);
    })
})
Then('I should see {string} failing reasons', (number) => {
    cy.get('.reasons-list').children().should('have.length', +number);
})
And('I delete {string} failing reasons', (number) => {
    for (let i = 0; i < number; i++) {
        // for testing, always delete the first item in the list
        cy.get('.delete-failing-reasons-btn--0').click(); 
    }
})
// scenario changing status 
Then('I click on the edit button', () => {
    cy.get('.edit-btn').click();
})
And('I click on the change status button', () => {
    cy.get('.change-status-btn').click();
})
And('I click the save button', () => {
    cy.get('.save-btn').click();
})

//scenario updating photos
And('I click on the add photo button', () => {
    cy.get('.add-photo').click();
})
Then('I click on camera button', () => {
    cy.get('.camera').click();
})

// -------------- qr_work_order.feature --------------
Then('I click on the Scan QR Code button', () => {
    cy.wait(2000);
    cy.get('.qr-scanner-btn').click();
});
Then('the QR scanner should be {string}', (openedOrClosed) => {
    const shouldBeOpen = openedOrClosed === 'opened' ? 'exist' : 'not.exist';
    cy.get('.qr-scanner').should(shouldBeOpen);
})
And('I show a {string} work order QR code', (validOrInvalid) => {
    // best we can do is to simulate input,
    // and neither showing an actual QR code nor stubbing the handleResult callback of the qr code reader
    const input = validOrInvalid === 'valid' ?
        'WO12345,7595,m2,-,2.0000,JO12345' :
        'WO12345';
    cy.window().then(win => {
        win.top.customQrCode = input;
    })
})
// ------------- drafts.feature ---------------
When('I open the navbar', () => {
    cy.get('.navbar-btn').click();
})
And('I close the navbar', () => {
    cy.get('.mantine-Drawer-closeButton').click();
})
And('I select another work order other than {string}', (exludedWorkorder) => {
    cy.wait(2000);
    cy.get('.list-drafts-btn').click();
    let alreadyClicked = false;
    cy.get(`.draft-workorder-btn:not([data-workorder-number="${exludedWorkorder}"])`).each(item => {
        if (!alreadyClicked) {
            cy.wrap(item).click();
            alreadyClicked = true;
        }
    })
})

// ------------- editing.feature -------------------
When('I click on the "Continue" button', () => {
    cy.get('.continue-btn').click();
})

When('I click on the camera button', () => {
    cy.get('.camera-btn').click();
})

// ----------- upload.feature ---------------
When('I choose {string} image files', (numFiles) => {
    const filepath = 'files/sample.png';
    if (+numFiles === 1) {
        cy.get('#contained-button-file').attachFile(filepath);
    } else {
        const files = Array(+numFiles).fill(filepath);
        cy.get('#contained-button-file').attachFile(files);
    }
})
And('I choose {string} image files and {string} non-image files', (numImageFiles, numOtherFiles) => {
    const totalNumFiles = +numImageFiles + +numOtherFiles;
    const files = Array(totalNumFiles);

    for (let i = 0; i < totalNumFiles; i++) {
        if (i < +numImageFiles) {
            files[i] = 'files/sample.png';
        } else {
            files[i] = 'files/sample.txt';
        }
    }
    cy.get('#contained-button-file').attachFile(files);
})