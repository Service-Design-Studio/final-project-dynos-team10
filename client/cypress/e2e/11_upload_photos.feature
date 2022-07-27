Feature: Upload Photos
    I want to upload pictures, that I have previously taken, from my device, so that I am not constrained to using the app to take photos

    Background: Selecting a workorder
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"
        When I click on component "XXX" button
        Then I should see camera or upload
        And I choose upload
        
    # https://www.npmjs.com/package/cypress-file-upload
    
    Scenario: Uploading an image file
        When I choose "1" image file(s)
        Then I should be on the "photo review" page
        And I should see "1" photos in the carousel

    Scenario: Uploading multiple image files
        When I choose "5" image file(s)
        Then I should be on the "photo review" page
        And I should see "5" photos in the carousel

    Scenario: SAD PATH: Uploading a non-image file among images
        When I choose "5" image file(s)
        And I choose "1" non-image file(s)
        Then I should see "Non-image file(s) detected"
        And I should see camera or upload

    Scenario: SAD PATH: Uploading nothing
        When I cancel
        Then I should see camera or upload
