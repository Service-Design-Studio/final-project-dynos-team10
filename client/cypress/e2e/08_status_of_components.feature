# NOTE: "upload button" and its API calls need to be intercepted FOR NOW, as the drafting feature is not ready
# Why is the drafting feature needed:
# Currently the only way to set workorder number in the store is through the qc entry page
# However, all (or at least those that actually uploads) of the scenarios here require a real workorder record in the DB
# before it can do actual uploading (instead of fixtures and stubbing)
# Hence, a good way to ensure this is to do a scenario BACKGROUND that runs before each scenario in this feature
# This background should not be posting and creating new entry each run because this pollutes the db
# Instead it should target only one such valid workorder and refer to the same one throughout a single test run

# THIS CREATES MULTIPLE WORKORDERS
Feature: Components
    I want to select a component from the status of components page and upload its status to the database

    Background: Selecting a workorder and taking some photos for component "xxxx"
        Given I am on the "home" page
        And I click on the new entry button
        Then I should be on the "qc entry" page
        Then I fill in the input field for "MACHINE S/N" with unique input
        And I select "m2" for machine type
        When I click on the next button, expecting success
        # And I click on the drafts button
        # Then I should be on the "drafts" page
        # When I select the "test" workorder
        # Then I should see "proceed with work order test"
        # When I click on the "Continue" button
        Then I should be on the "status of components" page
        # And I should see "test"
        When I click on component "xxxx" button
        Then I should see camera or upload
        When I choose "camera" from the options
        Then my camera should open
        And I click on the take photo button "5" times
        And I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: SAD PATH: pass/fail status not saved before clicking upload button
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I go to the "status of components" page with saved progress
        Then the component "xxxx" button colour should be "yellow"

    Scenario: component xxxx passing manual check
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxxx" button colour should be "green"
    
    # TODO: what happens when component type has 0 pre-configured failing reasons?
    # We should allow them to proceed without failing reasons in this case
    Scenario: component xxxx failing manual check
        Given I click on the fail button
        And I click on the proceed button
        Then I should see "Fail Reason(s)"
        When I select some failing reasons
        And I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxxx" button colour should be "red"

    Scenario: SAD PATH: exiting component xxxx check before submitting all photos of Component xxxx
        Given I go to the "status of components" page with saved progress
        Then the component "xxxx" button colour should be "yellow"