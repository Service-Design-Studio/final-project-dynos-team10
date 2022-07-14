Feature: Failing Reasons Input
    I want to enter and update a list of failing reasons manually for any component before uploading

    Scenario: Creating multiple failing reasons
        Given I am on the photo review page of component "xxx"
        And I click on the fail button
        And I click on the proceed button
        Then I should see "Reasons for failing check"
        When I enter in "4" failing reasons
        Then I should see "4" failing reasons


    @pending
    Scenario: Deleting failing reasons