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
        And I click "done" button
        Then I am on the photo review page
        
    Scenario: Option to take multiple photos of a component
        # REUSE FIRST 3 STEPS
        Given I am on the camera page
        And I click on the "take photo" button
        Then I see the photo taken
        When I click on the "+" button
        Then I am on the camera page
        And I see a counter
        And I continue taking pictures by clicking on the "+" button
        And I click "done" button
        Then I am on the photo review page

    Scenario: Leaving from camera page before uploading all pictures
        Given I am on the camera page
        And I have taken multiple pictures
        And I press the back button
        Then photos taken are not saved
        And I am on the component page
        And the respective component button colour turns yellow

    Scenario: Review the photos and upload
        Given I am on the photo review page
        And I click on the "upload" button
        Then I see a prompt "successfully uploaded"
        Then I am on the manual check page
        And the respective component button colour turns green
        
    Scenario: Status of Label passes true positive 
        Given I am on the photo review page
        And the AI imaging deems the label to be correctly positioned
        Then I am on the status of labels (pass) page
        And the "label" component button colour turns green
        
    Scenario: Status of Label passes false positive
        Given I am on the photo review page
        And the AI imaging deems the label to be correctly positioned
        Then I am on the status of labels (pass) page
        And the "label" component button colour turns green
        
    Scenario: Status of Label fails
        Given I am on the photo review page
        And the AI imaging deems the label to be incorrectly positioned
        Then I see the reasons for incorrect positioning in "Reasons for failing check" box
        
    Scenario: Status of Label fails true negative
        Given I am on the photo review page
        And AI imaging deems the label to be incorrectly positioned
        And the label is incorrectly positioned 
        Then I click "done" button
        And the "label" component button colour turns red
         
    Scenario: Status of Label fails suspected false negative
        Given I am on the photo review page
        And AI imaging deems the label to be incorrectly positioned
        And the label is possibly correctly positioned 
        Then I click "check manually" button
        Then I am on the status of labels (manual check) page
        
    Scenario: manual check of status of label passed
        Given I am on the status of labels (manual check) page
        And I click on the "upload photo" button
        Then I see the photo taken
        And the label is correctly positioned
        Then I click "passed" button
        Then I am on the status of labels (pass) page
        And the "label" component button colour turns green
        
    Scenario: manual check of status of label failed
        Given I am on the status of labels (manual check) page
        And I click on the "upload photo" button
        Then I see the photo taken
        And the label is incorrectly positioned
        Then I click "failed" button
        Then I am on the status of labels (failed) page
        And I type the reasons for incorrect positioning in "Reasons for failing check" box
        And the "label" component button colour turns red
   
