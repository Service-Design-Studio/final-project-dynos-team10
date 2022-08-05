Feature: New Work Order with QR Code
    I want to start a new work order by scanning the QR code on a work order document

    Background: Going to QC Entry Page
        Given I am on the "qc entry" page

    Scenario: Starting a new work order with a QR code
        When I click on the Scan QR Code button
        Then the QR scanner should be "opened"
        When I click on the close icon
        Then the QR scanner should be "closed"
    
    Scenario: Feeding a valid QR code
        When I click on the Scan QR Code button
        And I show a "valid" work order QR code
        Then the QR scanner should be "closed"
        And the input field for "MACHINE S/N" should be filled
        And the input field for "MACHINE TYPE" should be filled
    
    Scenario: SAD PATH: Feeding an invalid QR code
        When I click on the Scan QR Code button
        And I show a "invalid" work order QR code
        Then I should see "QR code is invalid"