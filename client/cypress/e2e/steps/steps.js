import { Given, Then } from "cypress-cucumber-preprocessor/steps";

#Given('I am on the home page', () => {
    #cy.visit("http://localhost:3000/");
#})

#Then(`I see {string} in the title`, (title) => {
    #cy.title().should('include', title);
#})

#const defineSupportCode = require('cucumber').defineSupportCode;
#const assert = require('assert');


#Scenario: Opening the camera function
defineSupportCode(function({ Given, Then, And }) {
    Given('I am on the status of components page', () => {
        cy.visit("http://localhost:3000/");
    })
    And('I click on {stringInDoubleQuotes} button', function() {
    });
    Then('my camera should open',function() {
    });
    And(`I am on the take photo page`,  () => {
        cy.visit("http://localhost:3000/");
    })
});

#Scenario: Taking one photo of component xxx
defineSupportCode(function({ Given, Then, And }) {
    Given('I am on the camera page of {String}', () => {
        cy.visit("http://localhost:3000/");
    })
    And('I click on the {stringInDoubleQuotes} button', function() {
    });
    Then('I see the photo taken',function() {
    });
    And('I click on the "Done" button',function() {
    });
    Then('I am on the photo review page',  () => {
        cy.visit("http://localhost:3000/");
    })
});

# Scenario: Taking multiple photo of component xxx
defineSupportCode(function({ Given, Then, And, When }) {
    Given('I am on the camera page of {String}', () => {
        cy.visit("http://localhost:3000/");
    })
    And('I click on the {stringInDoubleQuotes} button', function() {
    });
    Then('I see the photo taken',function() {
    });
    When('I click on the "+" button',function() {
    });
    Then(`I am on the camera page`,  () => {
        cy.visit("http://localhost:3000/");
    })
    And('I see a counter', function() {
    });
    And('I continue taking pictures by clicking on the "+" button', function() {
    });
    Then('I am on the photo review page', () => {
        cy.visit("http://localhost:3000/");
    })
})

#Scenario: Review the photos and upload
defineSupportCode(function({ Given, Then, And }) {
    Given('I am on the photo review page of {String}', () => {
        cy.visit("http://localhost:3000/");
    })
    And('I click on the "upload" button', function() {
    });
    Then('I see a prompt "successfully uploaded"',function() {
    });
    And('I am on the manual check page',  () => {
        cy.visit("http://localhost:3000/");
    })
});

#Feature: delete photo
#I want to delete photo(s) from Photo Review page
#Scenario: Review the photos and delete
defineSupportCode(function({ Given, Then, And }) {
    Given('I am on the photo review page of {StringInDoubleQuotes}', () => {
        cy.visit("http://localhost:3000/");
    })
    And('I click on the "delete" button', function() {
    });
    Then('the photo is removed from the carousel', function() {
    });
});
