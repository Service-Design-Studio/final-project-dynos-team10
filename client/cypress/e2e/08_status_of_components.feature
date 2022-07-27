# NOTE: "upload button" and its API calls need to be intercepted FOR NOW, as the drafting feature is not ready
# Why is the drafting feature needed:
# Currently the only way to set workorder number in the store is through the qc entry page
# However, all (or at least those that actually uploads) of the scenarios here require a real workorder record in the DB
# before it can do actual uploading (instead of fixtures and stubbing)
# Hence, a good way to ensure this is to do a scenario BACKGROUND that runs before each scenario in this feature
# This background should not be posting and creating new entry each run because this pollutes the db
# Instead it should target only one such valid workorder and refer to the same one throughout a single test run
Feature: Components
    I want to select a component from the status of components page and upload its status to the database

    Background: Selecting a workorder and taking some photos for component "xxx"
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"
        When I click on component "XXX" button
        And I click on the take photo button "5" times
        And I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: SAD PATH: pass/fail status not saved before clicking upload button
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I go to the "status of components" page with saved progress
        Then the component "xxx" button colour should be "yellow"

    Scenario: component xxx passing manual check
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxx" button colour should be "green"
        
    Scenario: component xxx failing manual check
        Given I click on the fail button
        And I click on the proceed button
        Then I should see "Reasons for failing check"
        When I enter in some failing reasons
        And I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxx" button colour should be "red" 

    Scenario: SAD PATH: exiting component xxx check before submitting all photos of Component xxx
        Given I go to the "status of components" page with saved progress
        Then the component "xxx" button colour should be "yellow"