const DEV_SERVER_URL = "http://localhost:3000/";

const descriptionToRouteMap = {
    'home': '',
    "status of components": 'component-status',
    "take photo": 'camera',
    'photo review': 'photo-review',
    'qc entry': 'qc-entry',
    'register': 'register',
    'login': 'login',
    'drafts': 'qc-list',
<<<<<<< HEAD
<<<<<<< HEAD
    'status-report': 'status-report'
=======
    'camera': 'camera',
    'status report': 'status-report'
>>>>>>> 3d374d43faa9a0de10d51788aa42a3e1551102da
=======
    'camera': 'camera',
    'status report': 'status-report'
>>>>>>> 35642822a5a4b56fa57ff4cf47eb066be467022b
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