Feature: Custom Machine and Component Types
    As an admin, I want to be able to add custom machine and assign custom component types to each of them, so that the inspectors know what to check for when they are working on a certain machine type, and they do not have to manually key in more components.

    Background: Opening the control panel
        Given I am on the "System Controls" page
        Then I should see "Machine Types"
        And I should see "Component Types"
        And I should see "Failing Reasons"

    Scenario: Creating a new component type
        When I fill in the input field for "Component Type Name" with "Component1"
        And I click the "add component" button
        Then I should see "Component1" in the "Component Types" list
    
    Scenario: Creating a new machine type
        When I fill in the input field for "Machine Type Name" with "Machine1"
        And I click the "add machine" button
        Then I should see "MACHINE1" in the "Machine Types" list

    Scenario: Creating a new failing reason
        When I fill in the input field for "Enter Fail Reasons" with "Slanted"
        And I click the "add failing reason" button
        Then I should see "Slanted" in the "Failing Reasons" list 

    Scenario: Edit components in machine type
        When I click on "MACHINE1" button in list
        And I click on "Edit Components" button for "MACHINE1"
        Then I should see "MACHINE1" in the side drawer with components list
        Then I should see "Component1" in the side drawer with components list
        And I select "Component1"
        And I click on the close icon
        Then I should see "Component1" as a component for "MACHINE1"

    Scenario: Edit failing reasons
        When I click on "Label" button in list
        And I click on "Edit Failing Reasons" button for "Label"
        Then I should see "Slanted" in the side drawer with failing reasons list
        And I select "Slanted"
        And I click on the close icon
        And I close the "Label" dropdown button
        When I click on "Label" button in list
        Then I should see "Slanted" as a failing reason for "Label" 

    Scenario: SAD PATH: creating non-unique machine type, component types, and failing reason
        When I fill in the input field for "Component Type Name" with "Component1"
        And I click the "add component" button
        Then I should see "This component type already exists"
        And I fill in the input field for "Machine Type Name" with "Machine1"
        And I click the "add machine" button
        And I should see "This machine type already exists"
        When I fill in the input field for "Enter Fail Reasons" with "Slanted"
        And I click the "add failing reason" button
        And I should see "This reason already exists"

    Scenario: Deleting machine type, component type, and failing reason
        When I delete "Component1" for component type
        Then I should not see "Component1" in the "Component Types" list
        When I delete "Machine1" for machine type
        Then I should not see "Machine" in the "Machine Types" list
        When I delete "Slanted" for failing reason
        Then I should not see "Slanted" in the "Failing Reasons" list 

    # Scenario: Controlling component types of a machine
    #     When I click add components for machine type "Machine Type 1"
    #     Then I should see a side panel to edit "Machine Type 1"
    #     When I choose "Component Type 1, Component Type 2, Component Type 3"
    #     And I close the side panel
    #     Then I should see the machine type "Machine Type 1" expandable
    #     When I expand "Machine Type 1"
    #     Then I should see the component types "Component Type 1, Component Type 2, Component Type 3"
    #     And I should see a "Edit Components" button