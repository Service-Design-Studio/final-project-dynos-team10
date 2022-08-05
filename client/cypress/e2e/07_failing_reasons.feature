Feature: Failing Reasons Input
    I want to enter and update a list of failing reasons manually for any component before uploading

    Background: Selecting a workorder, taking some photos for component "xxxx" and about to FAIL the component
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
        And I click on the take photo button "5" times
        And I click on the right arrow button
        Then I should be on the "photo review" page
        When I click on the fail button
        And I click on the proceed button
        Then I should see "Fail Reason(s)"

    Scenario: Selecting failing reasons
        When I select some failing reasons
        Then I should see some failing reasons

    Scenario: Deleting failing reasons
        When I select "1" failing reasons
        And I delete "1" failing reasons
        Then I should see "0" failing reasons
