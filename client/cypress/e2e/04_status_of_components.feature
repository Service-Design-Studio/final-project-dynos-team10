Feature: Components
    I want to select a component from the status of components page and upload its status to the database

    Scenario: pass/fail status not saved before clicking upload button
        Given I am on the photo review page of component "xxx"
        And I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I go to the "status of components" page with saved progress
        Then the component "xxx" button colour should be "yellow"

    @pending
    Scenario: component xxx passing manual check
        Given I am on the photo review page of component "xxx"
        And I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I click on the upload button
        Then I should see "Photo(s) successfully uploaded"
        When I click on the next icon with saved progress
        Then the component "xxx" button colour should be "green" 
        
    @pending
    Scenario: component xxx failing manual check
        Given I am on the photo review page of component "xxx"
        And I click on the fail button
        And I click on the proceed button
        Then I should see "Reasons for failing check"
        When I enter in some failing reasons
        And I click on the upload button
        Then I should see "Photo(s) successfully uploaded"
        When I click on the next icon with saved progress
        Then the component "xxx" button colour should be "red" 

    Scenario: exiting component xxx check before submitting all photos of Component xxx
        Given I am on the photo review page of component "xxx"
        When I go to the "status of components" page with saved progress
        Then the component "xxx" button colour should be "yellow"