Feature: Failing Reasons Input
    I want to enter and update a list of failing reasons manually for any component before uploading

    Background: Go to fail page
        Given I am on the photo review page of component "xxx"
        And I click on the fail button
        And I click on the proceed button
        Then I should see "Reasons for failing check"

    Scenario: Creating multiple failing reasons
        When I enter in "4" failing reasons
        Then I should see "4" failing reasons

    Scenario: Deleting failing reasons
        When I enter in "5" failing reasons
        And I delete "2" failing reasons
        Then I should see "3" failing reasons
