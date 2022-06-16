Feature: Take Picture

    I want to take pictures of a component

    # start from component page?

    Scenario: Opening the camera function
        Given I am on the home page
        And I click on the "Camera" button
        Then my camera should open

    # to reuse steps
    # browser comes out with this prompt, we only code sad paths that our app can control/accomodate for
    # Scenario: Opening the camera function but it fails
    #     Given I am on the home page
    #     When I do not enable camera access
    #     And I click on the "Camera" button
    #     Then I see a prompt to enable camera access in settings

    Scenario: Taking one photo of a component
        Given I am on the camera page
        And I click on the "take photo" button
        Then I see the photo taken

    Scenario: Option to take multiple photos of a component
        # REUSE FIRST 3 STEPS
        Given I am on the camera page
        And I click on the "take photo" button
        Then I see the photo taken
        When I click on the "+" button
        Then I am on the camera page
        And I see a counter
        And I click "done"
        Then I am on the photo review page

    Scenario: Leaving from camera page before uploading all pictures
        Given I am on the camera page
        And I have taken multiple pictures
        And I press the back button
        Then photos taken are not saved
        And I am on the component page
        And the respective component button colour remains yellow

    Scenario: Leaving from photo review page before uploading all pictures
        Given I am on the photo review page
        And I have taken multiple pictures
        And I press the back button
        Then photos taken are not saved
        And I am on the component page
        And the respective component button colour remains yellow

    Scenario: Review the photos and upload
        Given I am on the photo review page
        And I click on the "upload" button
        Then I see a prompt "successfully uploaded"
        Then I am on the manual check page

    Scenario: Review the photos and delete
        Given I am on the photo review page
        And I am viewing a photo
        And I click on the "delete" button
        Then the photo is removed from the carousel
