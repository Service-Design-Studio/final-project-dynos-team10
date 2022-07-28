Feature: Custom Machine and Component Types
    As an admin, I want to be able to add custom machine and assign custom component types to each of them, so that the inspectors know what to check for when they are working on a certain machine type, and they do not have to manually key in more components.

    # Background: Opening the control panel
    #     Given I am on the "home" page
    #     When I click the "System Controls" button in the navbar
    #     Then I should see "Machine Types"
    #     And I should see "Component Types"

    # Scenario: Creating a new component type
    #     Given I am on the "System Controls" page

    #     When I fill in the input field for "Component Type Name" 
    #     And I press the "add component" button
    #     Then I should see "Component Type 1" in the "Component Types" list
    
    # Scenario: Creating a new machine type
    #     When I fill in the input field for "Machine Type Name" 
    #     And I press the "add machine" button
    #     Then I should see "Machine Type 1" in the "Machine Types" list

    Scenario: SAD PATH: creating non-unique machine type and component types
        When I fill in the input field for "Component Type Name" with "Component Type"
        And I fill in the input field for "Machine Type Name" with "Machine Type 1"
        And I press the "add machine" button
        And I press the "add component" button
        Then I should see "This component type already exists"
        And I should see "This machine type already exists"

    Scenario: Controlling component types of a machine
        When I click add components for machine type "Machine Type 1"
        Then I should see a side panel to edit "Machine Type 1"
        When I choose "Component Type 1, Component Type 2, Component Type 3"
        And I close the side panel
        Then I should see the machine type "Machine Type 1" expandable
        When I expand "Machine Type 1"
        Then I should see the component types "Component Type 1, Component Type 2, Component Type 3"
        And I should see a "Edit Components" button