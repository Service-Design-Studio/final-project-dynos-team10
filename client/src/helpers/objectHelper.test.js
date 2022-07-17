import { deepCompare } from './objectHelper';

test('test deep compare with arrays', () => {
    const oldObj = {
        failingReasons: [],
        id: 25,
        status: 'green',
        images: [
            {id: 72},
            {id: 73},
            {id: 74},
            {id: 75},
            {id: 76}
        ]
    }

    const newObj = {
        failingReasons: ['Reason'],
        id: 25,
        status: 'red',
        images: [
            {id: 72},
            {id: 74},
            {id: 75},
            {id: 76}
        ]
    }

    const expectedObj = {
        failingReasons: ['Reason'],
        status: 'red',
        images: [
            {id: 72},
            {id: 74},
            {id: 75},
            {id: 76}
        ]
    }

    expect(deepCompare(oldObj, newObj)).toBe(expectedObj);
});