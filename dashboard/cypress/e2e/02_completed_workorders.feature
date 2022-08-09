Feature: Access list of completed workorders
    As an admin, I want to be able to access all completed workorders, so that I can keep track of the overall performance in the assembly department.

    Background: Opening the view workorders
        Given I am on the "View Work Orders" page
        # When I click the "View Work Orders" button in the navbar
        Then I should see "Machine Type"
        Then I should see "Workorder Number"
        Then I should see "Status"

    Scenario: Search workorder "test"
        When I fill in the input field for "Search" with "test"
        Then I should see "1" workorders
        And I click the "more details" button for "test"
        # Then I go to "View Single Workorder" page for "test"
        Then I should see "Key Information"

    # Scenario: Search workorder "w"
    #     When I fill in the input field for "Search" with "w"
    #     Then I should see "2" workorders
    #     And I click the "more details" button for "test"
    #     # Then I go to "View Single Workorder" page for "test"
    #     Then I should see "Key Information"
        