Feature: Editing Components
    I want to be able to edit the components that I have submitted, so that I can always update its information when there are changes or previously-made mistakes

    Background: Selecting a workorder, uploading some photos for component "xxx" and passing it
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
        Given I click on the pass button
        And I click on the proceed button
        Then I should see "Passed"
        When I click on the upload button
        Then I should see "Upload Successful"
        When I click on the close icon
        Then the component "xxx" button colour should be "green"
    
    Scenario: Being able to view the status report for a submitted component
        When I click on component "XXX" button
        Then I should be on the "status report" page

    Scenario: Changing status
        When I click on component "XXX" button
        And I click on the change status button
        And I select "fail"
        Then I should see a failing reasons box
        When I enter in "2" failing reasons
        And I click the save button
        Then I should see "Update Successful"
        When I click the close icon
        Then the component "xxx" button colour should be "red"

    Scenario: Updating photos
        When I click on component "XXX" button
        And I click on the add photo button
        Then I should be on the "camera" page
        When I click on the take photo button "3" times
        And I click on the right arrow button
        Then I should be on the "status report" page
        And I should see "8" photos in the carousel
        When I click on the delete photo button "2" times
        Then I should see "6" photos in the carousel
        When I click the save button
        Then I should see "Update Successful"
        When I click the close icon
        Then the component "xxx" button colour should be "green"
        When I click on component "XXX" button
        Then I should be on the "status report" page
        And I should see "6" photos in the carousel