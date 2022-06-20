Feature: Take Photo

    # start from the take photo page
    I want to take pictures of a component



    Scenario: Opening the camera function
        Given I am on the status of components page
        And I click on "Component xxx" button
        Then my camera should open
        And I am on the take photo page

    # to reuse steps
    # browser comes out with this prompt, we only code sad paths that our app can control/accomodate for
    # Scenario: Opening the camera function but it fails
    #     Given I am on the home page
    #     When I do not enable camera access
    #     And I click on the "Camera" button
    #     Then I see a prompt to enable camera access in settings


    Scenario: Taking one photo of component xxx
        Given I am on the camera page of component xxx
        And I click on the "take photo" button
        Then I see the photo taken
        And I click "done" button
        Then I am on the photo review page

    Scenario: Option to take multiple photos of Component xxx
        # REUSE FIRST 3 STEPS
        Given I am on the camera page of component xxx
        And I click on the "take photo" button
        Then I see the photo taken
        When I click on the "+" button
        Then I am on the camera page
        And I see a counter
        And I continue taking pictures by clicking on the "+" button
        And I click "Done" button
        Then I am on the photo review page

    Scenario: Review the photos and upload
        Given I am on the photo review page of component xxx
        And I click on the "upload" button
        Then I see a prompt "successfully uploaded"
        And I am on the manual check page
        #go to manual check to see if it passes manual QC (to pass_fail_check.feature)

