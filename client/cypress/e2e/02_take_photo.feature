Feature: Take Picture
    I want to take pictures of a component

    Scenario: Opening the camera function
        Given I am on the "status of components" page
        And I click on component "XXX" button
        Then my camera should open
        And I should be on the "take photo" page

    # to reuse steps
    # browser comes out with this prompt, we only code sad paths that our app can control/accomodate for
    # Scenario: Opening the camera function but it fails
    #     Given I am on the home page
    #     When I do not enable camera access
    #     And I click on the "Camera" button
    #     Then I see a prompt to enable camera access in settings

    Scenario: Taking one photo of component xxx
        Given I am on the camera page of component "xxx"
        And I click on the take photo button
        Then I should see the counter showing "1"
        When I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: Taking multiple photos of component xxx
        Given I am on the camera page of component "xxx"
        And I click on the take photo button
        Then I should see the counter showing "1"
        When I click on the take photo button "4" times
        Then I should see the counter showing "5"
        When I click on the right arrow button
        Then I am on the "photo review" page

    # check with group if this is intended
    Scenario: Review the photos and mark pass/fail
        Given I am on the photo review page of component "xxx"
        Then I should see all my photos in the carousel
        And I should see the "pass" icon
        And I should see the "fail" icon
        # Then I see a prompt "successfully uploaded"
        # Then I am on the manual check page
        #go to manual check to see if it passes manual QC (to pass_fail_check.feature)
