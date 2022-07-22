Feature: Logging In
    I want to log into my account to access the system

    # use stubs/fixtures to mock failure jsons from BE

    Scenario: Valid log in
        Given I am on the "login" page
        Then I fill in the input field for "Username" with "test"
        Then I click on the log in button, expecting "success"
        And I should be on the "home" page
    
    Scenario: SAD PATH: Log in without username
        Given I am on the "login" page
        Then I click on the log in button
        Then I should see "Username is required"
        And I should be on the "login" page

    Scenario: SAD PATH: Log in with invalid username
        Given I am on the "login" page
        Then I fill in the input field for "Username" with "acbdegfhikjl"
        Then I click on the log in button, expecting "username does not exist"
        Then I should see "Username could not be found"
        And I should be on the "login" page
    
