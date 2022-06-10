import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the home page', () => {
    cy.visit("http://localhost:3000/");
})

Then(`I see {string} in the title`, (title) => {
    cy.title().should('include', title);
})