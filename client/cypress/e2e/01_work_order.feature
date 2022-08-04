Feature: New Work Order
    I want to start a new work order to save photos and inspection data

    Scenario: SAD PATH: Starting a new work order that already exists
        Given I am on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with "test"
        And I select "m1" for machine type
        When I click on the next button, expecting success
        Then I should see "workorder number is taken"
        And I should be on the "qc entry" page
    
    Scenario: Starting a new and unqiue work order
        Given I am on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with unique input
        And I select "m1" for machine type
        When I click on the next button, expecting success
        Then I should be on the "status of components" page

    Scenario: SAD PATH: Starting a new work order with machine type not selected
        Given I am on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with "sample"
        When I click on the next button
        Then I should see "Type of machine is required"
        And I should be on the "qc entry" page

    Scenario: SAD PATH: Starting a new work order with machine s/n not filled in
        Given I am on the "qc entry" page
        Then I select "m1" for machine type
        When I click on the next button
        Then I should see "Serial number is required"
        And I should be on the "qc entry" page

    Scenario: SAD PATH: Starting a new work order with no information given
        Given I am on the "qc entry" page
        When I click on the next button
        Then I should see "Type of machine is required"
        And I should see "Serial number is required"
        And I should be on the "qc entry" page

    Scenario: SAD PATH: no work order selected
        Given I am on the "status of components" page
        Then I should see "Please select a work order"