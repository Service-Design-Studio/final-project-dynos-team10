Feature: delete photo
    I want to delete photo(s) from Photo Review page
    Scenario: Review the photos and delete
        Given I am on the photo review page
        And I am viewing a photo
        And I click on the "delete" button
        Then the photo is removed from the carousel
