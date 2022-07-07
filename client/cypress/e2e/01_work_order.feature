Feature: New Work Order
    I want to start a new work order to save photos and inspection data

    Scenario: Starting a new work order
        Given I am on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with "sample"
        And I select some option in select field for machine type
        # the below line needs to make a DB call! how to deal with it
        When I click on the next button
        Then I should be on the "status of components" page

    Scenario: Starting a new work order with machine type not selected
        Given I am on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with "sample"
        When I click on the next button
        Then I should see "Type of machine is required"
        And I should be on the "qc entry" page

    Scenario: Starting a new work order with machine s/n not filled in
        Given I am on the "qc entry" page
        Then I select some option in select field for machine type
        When I click on the next button
        Then I should see "Serial number is required"
        And I should be on the "qc entry" page

    Scenario: Starting a new work order with no information given
        Given I am on the "qc entry" page
        When I click on the next button
        Then I should see "Type of machine is required"
        And I should see "Serial number is required"
        And I should be on the "qc entry" page