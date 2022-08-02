import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullWorkorder } from '../../helpers/workorderHelper';

export default function WorkorderSingle() {
    const workorderId = parseInt(useParams().workorderId, 10);
    const [workorder, setWorkorder] = useState(null);

    useEffect(() => {
        (async() => {
            if (isNaN(workorderId)) {
                return;
            }
            const result = await getFullWorkorder(workorderId);
            console.log({result});
        })()
    }, [workorderId])

    // Graphs to include: 1) number of pass/fail COMPONENTS, 2) failing reasons categories
    
    return (
        <div>
            
        </div>
    )
}