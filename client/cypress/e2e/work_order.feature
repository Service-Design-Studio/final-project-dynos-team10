Feature: New Work Order

    I want to start a new work order to save photos and inspection data

    @pending
    Scenario: Starting a new work order
        Given I am on the "qc entry" page
        Then I should see an input field for "machine s/n"
        And I should see a select field for "type of machine"
        And I should see a "NEXT" button