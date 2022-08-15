# stub responses to build graphs

Feature: Workorder Analytics
    As a manager, I want to be able to view various analytics for the submitted workorders from the dashboard

    Background: On the analytics/home page
        Given I am on the "home" page
    
    # pass fail by workorders
    Scenario: Succcesful workorder pass/fail query
        When I select the "Pass/Fail by Workorders" analytics tab
        And I drag the slider to some day, expecting "results" for "Pass/Fail by Workorders"
        Then I should not see "No data found"

    Scenario: Empty workorder pass/fail query
        When I select the "Pass/Fail by Workorders" analytics tab
        And I drag the slider to some day, expecting "no results" for "Pass/Fail by Workorders"
        Then I should see "No data found"

    # pass fail by machine types
    Scenario: Succcesful machine types pass/fail query
        When I select the "Pass/Fail by Machine Types" analytics tab
        And I drag the slider to some day, expecting "results" for "Pass/Fail by Machine Types"
        Then I should not see "No data found"

    Scenario: Empty machine types pass/fail query
        When I select the "Pass/Fail by Machine Types" analytics tab
        And I drag the slider to some day, expecting "no results" for "Pass/Fail by Machine Types"
        Then I should see "No data found"

    # failing reasons by machine types
    Scenario: Succcesful machine types failing reasons pass/fail query
        When I select the "Failing Reasons by Machine Types" analytics tab
        And I drag the slider to some day, expecting "results" for "Failing Reasons by Machine Types"
        Then I should not see "No data found"

    Scenario: Empty machine types failing reasons pass/fail query
        When I select the "Failing Reasons by Machine Types" analytics tab
        And I drag the slider to some day, expecting "no results" for "Failing Reasons by Machine Types"
        Then I should see "No data found"