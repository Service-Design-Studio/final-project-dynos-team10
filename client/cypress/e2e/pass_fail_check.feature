Feature: Pass Fail Check
    I want to check if the component passes or fails QC

    Scenario: Status of Label passes true positive
        Given I am on the photo review page
        And the AI imaging deems the label to be correctly positioned
        Then I am on the status of labels (pass) page
        And I click “Done” button

	        #And the "label" component button colour turns green


    Scenario: Status of Label passes false positive
        Given I am on the photo review page
        And the AI imaging deems the label to be correctly positioned
        Then I am on the status of labels (pass) page
	        #And the "label" component button colour turns green

    Scenario: Status of Label fails
        Given I am on the photo review page
        And the AI imaging deems the label to be incorrectly positioned
        Then I see the reasons for incorrect positioning in "Reasons for failing check" box

    Scenario: Status of Label fails true negative
        Given I am on the photo review page
        And AI imaging deems the label to be incorrectly positioned
        And the label is incorrectly positioned
        Then I click "done" button
	        #And the "label" component button colour turns red

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
	        #And the "label" component button colour turns green

    Scenario: manual check of status of label failed
        Given I am on the status of labels (manual check) page
        And I click on the "upload photo" button
        Then I see the photo taken
        And the label is incorrectly positioned
        Then I click "failed" button
        Then I am on the status of labels (failed) page
        And I type the reasons for incorrect positioning in "Reasons for failing check" box
	        #And the "label" component button colour turns red


