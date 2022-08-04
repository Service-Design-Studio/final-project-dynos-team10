Feature: Work Order Drafts
    I want to be able to swap between and select work orders, so that I can work on multiple work orders simultaneously

    Background: Selecting a Work Order from the Drafts List
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"
        When I click on component "xxxx" button
        Then I should see camera or upload
        When I choose "camera" from the options
        Then my camera should open
        When I click on the take photo button "5" times
        And I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: Taking some photos and uploading then, then swap to another, and swap back again. Progress is saved.
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxxx" button colour should be "green"
        When I open the navbar
        And I select another work order
        When I select the "test" workorder
        And I click on the close icon
        Then I should be on the "status of components" page
        And the component "xxxx" button colour should be "green"

    Scenario: SAD PATH: Taking some photos without uploading, then swap to another, and swap back again. Progress is not saved.
        Given I go to the "status of components" page with saved progress
        Then the component "xxxx" button colour should be "yellow"
        When I open the navbar
        And I select another work order
        When I select the "test" workorder
        And I click on the close icon
        Then I should be on the "status of components" page
        And the component "xxxx" button colour should be "blue"
