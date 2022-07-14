Feature: New Work Order with QR Code
    I want to start a new work order by scanning the QR code on a work order document

    @pending
    Scenario: Starting a new work order with a QR code
        Given I am on the "qc entry" page
        Then I click on the Scan QR Code button