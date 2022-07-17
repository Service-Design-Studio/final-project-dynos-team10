/*
interface Component {
    images: Image[],
    status: 'green' | 'red' | 'yellow' | 'blue'
    failingReasons: string[],
    id: number | null, // null to indicate this has not yet been in the DB
}

interface Image {
    id: number | null,
    src: string
}
*/

/**
 * Given a DB query for a component and its images, build a component object that conforms to the interface in the redux store
 * Allows for comparison betweem redux (local) state and DB data.
 * @param {*} component 
 * @param {*} images 
 * @returns
 */
const buildComponentObjWithImages = function(component, images) {
    const formattedImages = images.map(imageEl => {
        return {
            id: imageEl.id,
            src: imageEl.public_url
        }
    })

    const componentObj = {
        id: component.id,
        status: component.status ? 'green' : 'red',
        images: formattedImages,
        failingReasons: component.status ? [] : component.failing_reasons
    }

    return componentObj;
}

export { buildComponentObjWithImages };