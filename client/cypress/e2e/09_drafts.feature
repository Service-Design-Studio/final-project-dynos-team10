Feature: Work Order Drafts
    I want to be able to swap between and select work orders, so that I can work on multiple work orders simultaneously

    @pending
    Scenario: Selecting a Work Order from the Drafts List
        Given I am on the "drafts" page
        Then I should see a list of workorders
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"