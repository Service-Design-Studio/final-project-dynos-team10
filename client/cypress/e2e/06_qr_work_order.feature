Feature: New Work Order with QR Code
    I want to start a new work order by scanning the QR code on a work order document

    Background: Going to QC Entry Page
        Given I am on the "qc entry" page

    @pending
    Scenario: Starting a new work order with a QR code
        When I click on the Scan QR Code button
        Then the QR scanner should "open"
    
    @pending
    Scenario: Feeding a valid QR code
        When I click on the Scan QR Code button
        And I show a valid work order QR code
        Then the QR scaner should "close"
        And the input field for "MACHINE S/N" should be filled
        And the input field for "MACHINE TYPE" should be filled
    
    @pending
    Scenario: Feeding an invalid QR code
        When I click on the Scan QR Code button
        And I show an invalid work order QR Code
        Then I should see "QR code is invalid"