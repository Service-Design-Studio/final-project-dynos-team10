Feature: Registering as a new user
    I want to register myself as a new user

    # note: cannot test what happens when user CANCELS the authentication operation on their device
    # since we are running automated testing, it does not have access to such APIs on different devices

    # try stubbing/fixtures

    @pending
    Scenario: Registering as a completely new user
        Given I am on the "register" page
        Then I fill in the input field for "Username" with a unique input
        Then I fill in the input field for "Credential Nickname" with a unique input 
        Then I click on the register button
        Then I should see "Signed Up Successfully"
        And I should be on the "login" page

    @pending
    Scenario: Registering with non-unique username
        Given I am on the "register" page
        Then I fill in the input field for "Username" with "test"
        Then I fill in the input field for "Credential Nickname" with "test"
        Then I click on the register button
        Then I should see "username is not unique"
        And I should be on the "register" page
    
    Scenario: Registering without username
        Given I am on the "register" page
        Then I fill in the input field for "Credential Nickname" with "test"
        Then I click on the register button
        Then I should see "Username is required"
        And I should be on the "register" page

    Scenario: Registering without credential nickname
        Given I am on the "register" page
        Then I fill in the input field for "Username" with "test"
        Then I click on the register button
        Then I should see "Credential Nickname is required"
        And I should be on the "register" page

    Scenario: Registering without any fields
        Given I am on the "register" page
        Then I click on the register button
        Then I should see "Username is required"
        And I should see "Credential Nickname is required"
        And I should be on the "register" page
