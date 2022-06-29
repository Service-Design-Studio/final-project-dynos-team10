Feature: Components
    I want to select a component from the status of components page to qc

    @pending
    Scenario: going to the status of components page from the home page
        Given I am on the home page
        And I click on the qc list button
        Then I am on the status of components page

    @pending
    Scenario: going to going to the status of components page from the side bar page
        Given I am on the side bar page
        And I click on the qc list button
        Then I am on the status of components page


    @pending
    Scenario: uploading photos to the component "xxx" manual check page
        Given I am on the status of component "xxx" manual check page
        And I click on the upload photo button
        Then my camera should open
        And the pass button turns green
        And the fail button turns red

    @pending
    Scenario: component xxx passing manual check
        Given the pass button turns green
        And the fail button turns red
        Then I click on the pass button
        Then I am on the manual status pass page
        And the done button turns blue
        Then I am on the status of components page
        And the component "xxx" button colour turns green

    @pending
    Scenario: component xxx failing manual check
        Given the pass button turns green
        And the fail button turns red
        Then I click on the fail button
        Then I am on the manual status fail page
        Then I fill in the input field for "reasons for failing check" with "sample"
        Then the done button turns blue
        Then I am on the status of components page
        And the component "xxx" button colour turns red

    @pending
    Scenario: exiting component xxx check before submitting all photos of Component xxx
        Given I have taken multiple photos of component "xxx"
        And I am on the photo review page
        #And I do not click on the upload button
		#dont say And I press the "back" button bc he may exit the app
        Then the component "xxx" button colour turns yellow

    @pending
    Scenario: Label passing AI imaging check
        Given I am on the status of labels pass page
        And I click done button
        Then I am on the status of components page
        And the "label" component button colour turns green

    @pending
    Scenario: Label failing AI imaging check true negative
        Given I am on the status of labels fail page
        And I click done button
        Then I am on the status of components page
        And the "label" component button colour turns red

    @pending
    Scenario: Label failing AI imaging check false negative
        Given I am on the status of labels fail page
        And I click check manually button
        Then I am on the status of labels (Manual check) page
        And the "label" component button colour turns yellow