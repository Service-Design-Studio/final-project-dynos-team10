const DEV_SERVER_URL = "http://localhost:5173/";

const descriptionToRouteMap = {
    'home': '',
    "System Controls": 'controls'
    // "take photo": 'camera',
    // 'photo review': 'photo-review',
    // 'qc entry': 'qc-entry',
    // 'register': 'register',
    // 'login': 'login',
    // 'drafts': 'qc-list'
}

/**
 * This function will build the appropriate route for testing based on a path description.
 * It is the tester's responsibility to map path descriptions used in our cucumber DSL
 * to the front end app routes
 */
function buildRoute(pageDescription) {
    return DEV_SERVER_URL + descriptionToRouteMap[pageDescription];
}

/**
 * Generates a class name to find the component button by css selector
 * @param {string} componentName 
 * @returns the DOM class name that should represent one component button in the component status page
 */
function buildComponentButtonClass(componentName) {
    return `.${componentName.toLowerCase().split(' ').join('-')}__btn`
}

function generateRandIntEndsInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const failingReasonsTextAreaPlaceholder = 'Type one reason at a time';

export { DEV_SERVER_URL, buildRoute, buildComponentButtonClass, generateRandIntEndsInclusive, failingReasonsTextAreaPlaceholder }