Feature: Detecting Labels while taking photos of them
    I want the system to be able to 

    Background: Selecting a workorder and taking some photos for the label component
        Given I am on the "home" page
        And I click on the new entry button
        Then I should be on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with unique input
        And I select "M2" for machine type
        When I click on the next button, expecting success
        Then I should be on the "status of components" page
        When I click on component "label" button
        Then I should see camera or upload
        When I choose "camera" from the options
        And I click on the take photo button
        And I click on the right arrow button
        Then I should be on the "photo review" page
        And I should see "Select 1 photo for AI inspection"
        When I click on the select this photo button
        Then I should see the selection modal with an image
    
    Scenario: Sending a non-label photo for analysis and accepting it
        When I click on the inspect button with a "non-label" label photo
        Then I should be on the "label result" page
        Then I should see "No Label Found"
        When I click on the submit button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "red"
    
    # DISPUTE PATHS
    Scenario: Sending a passing photo for analysis that was falsely marked as missing and disputing it
        When I click on the inspect button with a "passing" label photo that is going to be misidentified
        Then I should be on the "label result" page
        Then I should see "No Label Found"
        When I click on the dispute button
        Then I should see the dispute modal
        When I click on the confirm dispute button, expecting a "pass"
        When I click on the submit button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "green"
    
    Scenario: Sending a failing photo for analysis that was falsely marked as missing and disputing it
        When I click on the inspect button with a "failing" label photo that is going to be misidentified
        Then I should be on the "label result" page
        Then I should see "No Label Found"
        When I click on the dispute button
        Then I should see the dispute modal
        When I click on the confirm dispute button, expecting a "fail"
        Then I should see "Fail Reason(s)"
        When I click on the submit as "failed" button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "red"

    # passing photos
    Scenario: Sending a passing photo for analysis and submitting it
        When I click on the inspect button with a "passing" label photo
        Then I should be on the "label result" page
        When I click on the submit button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "green"

    # failing photos (present but with errors)
    Scenario: Sending a failing photo for analysis and submitting it as failed
        When I click on the inspect button with a "failing" label photo
        Then I should be on the "label result" page
        Then I should see "Fail Reason(s)"
        And I should see "Torn"
        When I click on the submit as "failed" button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "red"

    Scenario: Sending a failing photo for analysis and submitting it as passed
        When I click on the inspect button with a "failing" label photo
        Then I should be on the "label result" page
        Then I should see "Fail Reason(s)"
        And I should see "Torn"
        When I click on the submit as "passed" button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "label" button colour should be "green"

    