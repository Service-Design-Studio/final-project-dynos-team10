import { transform, isEqual, isObject } from 'lodash';

/**
 * Compares a new object to an old one and reports differences from the old and deep compares
 * @param {Object} obj1 The old object to compare against
 * @param {Object} obj2 The new object
 * @returns an object highlighting changes the new object has over the old object
 */
const deepCompare = (obj1, obj2) => {
    const changes = (obj1, obj2) => {
        return transform(obj2, (result, value, key) => {
            if (!isEqual(value, obj1[key])) {
                result[key] = (isObject(value) && isObject(obj1[key])) ? changes(obj1[key], value) : value;
            }
        })
    }

    return changes(obj1, obj2);
}

export { deepCompare }