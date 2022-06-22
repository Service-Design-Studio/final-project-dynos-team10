Feature: Components
    I want to select a component from the status of components page to qc

    @pending
    Scenario: going to the status of components page from the home page
        Given I am on the home page
        And I click on the “QC List” button
        Then I am on the status of components page

    @pending
    Scenario: going to going to the status of components page from the side bar page
        Given I am on the side bar page
        And I click on the “QC List” button
        Then I am on the status of components page

    @pending
    Scenario: component xxx passing manual check
        Given I am on the manual status of component xxx (pass) page
        And I click on the “Done” button
        Then I am on the status of components page
        And the “component xxx” button colour turns green

    @pending
    Scenario: component xxx failing manual check
        Given I am on the manual status of component xxx (fail) page
        And I type the reasons for incorrect positioning in "Reasons for failing check" box
        Then the “Done” button turns blue
        And the “Done” button can be clicked
        And I click on the “Done” button
        Then I am on the status of components page
        And the “component xxx” button colour turns red

    @pending
    Scenario: exiting component xxx check before submitting all photos of Component xxx
        Given I am on the photo review page
        And I have taken multiple pictures
        And I do not click on the “upload” button
		#dont say And I press the "back" button bc he may exit the app
        Then the “component xxx” button colour turns yellow

    @pending
    Scenario: Leaving photo review page before uploading all photos of component xxx
        Given I am on the photo review page
        And I press the “Back” button
        Then I am on the status of components page

    @pending
    Scenario: Label passing AI imaging check
        Given I am on the status of labels (pass) page
        And I click “Done” button
        Then I am on the status of components page
        And the "label" component button colour turns green

    @pending
    Scenario: Label failing AI imaging check true negative
        Given I am on the status of labels (fail) page
        And I click “Done” button
        Then I am on the status of components page
        And the "label" component button colour turns red

    @pending
    Scenario: Label failing AI imaging check false negative
        Given I am on the status of labels (fail) page
        And I click “Check Manually” button
        Then I am on the status of labels (Manual check) page
        And the "label" component button colour turns yellow