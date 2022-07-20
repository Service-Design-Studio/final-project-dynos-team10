Feature: Delete Photo
    I want to delete photo(s) from Photo Review page

    Background: Selecting a workorder
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"
    
    Scenario: Review the photos and delete one
        Given I click on component "XXX" button
        And I click on the take photo button "5" times
        When I click on the right arrow button
        Then I should see all my photos in the carousel
        When I am viewing a photo
        And I click on the delete button
        Then the photo is removed from the carousel
        And I should see "4" photos in the carousel

    Scenario: Take and review one photo, then deleting it
        Given I click on component "XXX" button
        And I click on the take photo button
        When I click on the right arrow button
        Then I should see all my photos in the carousel
        And I click on the delete button
        Then I should see a Go Back To Camera button
