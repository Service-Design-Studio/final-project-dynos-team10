Feature: Access list of completed workorders
    As an admin, I want to be able to access all completed workorders, so that I can keep track of the overall performance in the assembly department.

    Background: Opening the view workorders
        Given I am on the "View Work Orders" page
        Then I should see "Machine Type"
        Then I should see "Workorder Number"
        Then I should see "Status"

    Scenario: Search workorders
        When I fill in the input field for "Search" with "sample"
        Then I should see "1" workorders search results
        When I fill in the input field for "Search" with "workorder"
        Then I should see "2" workorders search results
        And I click the "more details" button for "workorder3"
        Then I should see "Key Information"

    Scenario: Open single workorder
        When I fill in the input field for "Search" with "sample"
        And I click the "more details" button for "sample"
        Then I should be on the "View Single Workorder" page
        Then I should see "Key Information"
        And I should see "Work Order Number"
        And I should see "sample"
    
    Scenario: View single workorder
        When I fill in the input field for "Search" with "sample"
        And I click the "more details" button for "sample"
        Then I should see "Key Information"
        And I should see "2" components in the carousel 
        And I should see "Passed" for "Label"
        And I click on "View Images" button for "Label"
        Then I should see "2" images in the carousel for "Label"
