Feature: Custom Machine and Component Types
    As an admin, I want to be able to add custom machine and assign custom component types to each of them, so that the inspectors know what to check for when they are working on a certain machine type, and they do not have to manually key in more components.

    Background: Opening the control panel
        Given I am on the "System Controls" page
        Then I should see "Machine Types"
        And I should see "Component Types"
        And I should see "Failing Reasons"

    Scenario: Creating a new component type
        When I fill in the input field for "Component Type Name" with "Component Type 1"
        And I click the "add component" button
        Then I should see "Component Type 1" 
        # in the "component-list"
    
    Scenario: Creating a new machine type
        When I fill in the input field for "Machine Type Name" with "Machine Type 1"
        And I click the "add machine" button
        Then I should see "MACHINE TYPE 1" 
        # in the "machine-list"

    Scenario: Creating a new failing reason
        When I fill in the input field for "Enter Fail Reasons" with "Slanted"
        And I click the "add failing reason" button
        Then I should see "Slanted" 
        # in the "failing-reasons-list"

    Scenario: Edit components in machine type
        When I click on "Machine Type 1" button 
        And I click on "Edit Components" button
        Then I should see "Component Type 1" in the side drawer
        And I select "Component Type 1"
        And I click on the close icon
        Then I should see "Component Type 1" in component list

    # Scenario: Edit failing reasons
    #     When I click on "Component Type 1" button
    #     And I click on "Edit Failing Reasons" button
    #     Then I should see "Slanted" in the side drawer
    #     And I select "Slanted"
    #     And I click on the close icon
    #     And I should see "Slanted" in failing reasons list 

        # Scenario: Deleting component type
    #     And I delete "Component Type 1" component types
    #     Then I should see "0" component types

    # Scenario: Deleting machine type
    #     And I delete "Machine Type 1" machine types
    #     Then I should see "0" machine types

    # Scenario: Delete failing reason
    #     And I delete "Slanted" failing reasons
    #     Then I should see "0" failing reasons

    # Scenario: SAD PATH: creating non-unique machine type and component types
    #     When I fill in the input field for "Component Type Name" with "Component Type"
    #     And I fill in the input field for "Machine Type Name" with "Machine Type 1"
    #     And I press the "add machine" button
    #     And I press the "add component" button
    #     Then I should see "This component type already exists"
    #     And I should see "This machine type already exists"

    # Scenario: Controlling component types of a machine
    #     When I click add components for machine type "Machine Type 1"
    #     Then I should see a side panel to edit "Machine Type 1"
    #     When I choose "Component Type 1, Component Type 2, Component Type 3"
    #     And I close the side panel
    #     Then I should see the machine type "Machine Type 1" expandable
    #     When I expand "Machine Type 1"
    #     Then I should see the component types "Component Type 1, Component Type 2, Component Type 3"
    #     And I should see a "Edit Components" button