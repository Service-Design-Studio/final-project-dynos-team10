Feature: Take Picture
    I want to take pictures of a component

    Background: Selecting a workorder
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"

    Scenario: Opening the camera function
        And I click on component "XXX" button
        Then my camera should open
        And I should be on the "take photo" page

    Scenario: Taking one photo of component xxx
        Given I click on component "XXX" button
        Then my camera should open
        When I click on the take photo button
        Then I should see the counter showing "1"
        When I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: Taking multiple photos of component xxx
        Given I click on component "XXX" button
        Then my camera should open
        When I click on the take photo button
        Then I should see the counter showing "1"
        When I click on the take photo button "4" times
        Then I should see the counter showing "5"
        When I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: Review the photos and mark pass/fail
        Given I click on component "XXX" button
        When I click on the take photo button
        And I click on the right arrow button
        Then I should see all my photos in the carousel
        And I should see the "pass" icon
        And I should see the "fail" icon
