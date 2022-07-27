Feature: Detecting Labels while taking photos of them
    I want to be able to see that the system can detect if the picture I am taking is a label or not

    Background: Selecting a workorder and taking some photos for the label component
        Given I am on the "home" page
        And I click on the drafts button
        Then I should be on the "drafts" page
        When I select the "test" workorder
        Then I should see "proceed with work order test"
        When I click on the "Continue" button
        Then I should be on the "status of components" page
        And I should see "test"
        When I click on component "label" button
        Then I should see camera or upload
        And I choose camera
        When I click on the take photo button "5" times
        And I click on the right arrow button
        Then I should be on the "photo review" page

    Scenario: Sending a true label photo for analysis
        Given I choose a "true" label photo for analysis
        And I click proceed
        Then I should be on the "results" page

    Scenario: Sending a false label photo for analysis and accepting it
        Given I choose a "false" label photo for analysis
        And I click proceed
        Then I should see "Fail"
        And I should see "Failing Reasons"
        When I click proceed
        Then the component "label" button colour should be "red"

    Scenario: SAD PATH: Sending a false label photo for analysis and choosing another, true label, photo
        Given I choose a "false" label photo for analysis
        And I click proceed
        Then I should see "Fail"
        And I should see "Failing Reasons"
        When I click the choose another photo button
        Then I should be on the "photo review" page
        When I choose a "true" label photo for analysis
        And I click proceed
        Then I should be on the "results" page

    Scenario: SAD PATH: Sending a true label photo for analysis but system reports missing label, and disputing it
        Given I choose a "true" label photo for analysis
        And I click proceed
        Then I should see "Fail"
        And I should see "Failing Reasons"
        When I click the dispute button
        Then I should be on the "results" page

    