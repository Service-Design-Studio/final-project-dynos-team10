const DEV_SERVER_URL = "http://localhost:3000/";

const descriptionToRouteMap = {
    'home': '',
    "status of components": 'component-status',
    "take photo": 'camera'
}

/**
 * This function will build the appropriate route for testing based on a path description
 * It is the tester's responsibility to map path descriptions used in our cucumber DSL
 * to the front end app routes
 */
function buildRoute(pageDescription) {
    return DEV_SERVER_URL + descriptionToRouteMap[pageDescription];
}

export { DEV_SERVER_URL, buildRoute }