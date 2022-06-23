Feature: delete photo
    I want to delete photo(s) from Photo Review page
    
    Scenario: Review the photos and delete one
        Given I am on the photo review page of component "xxx" with "5" photos
        Then I should see all my photos in the carousel
        When I am viewing a photo
        And I click on the "delete" button
        Then the photo is removed from the carousel
        And I should see "4" photos in the carousel

    Scenario: Take and review one photo, then deleting it
        Given I am on the photo review page of component "xxx"
        Then I should see all my photos in the carousel
        And I click on the "delete" button
        Then I should see a "go back to camera" button
