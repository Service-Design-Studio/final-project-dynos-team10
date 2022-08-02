import { useEffect } from "react"
import { getCompletedWorkorders } from "../../helpers/workorderHelper"

export default function Workorders() {
    useEffect(() => {
        getCompletedWorkorders();
    }, [])

    return (
        <div>
            
        </div>
    )
}