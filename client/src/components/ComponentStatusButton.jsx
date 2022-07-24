import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { 
    updateCurrentComponentName, 
    selectWorkorderComponents, 
    selectCurrentComponent 
} from '../store/workorder/workorderSlice';
import {Button} from "@mantine/core"

function ComponentStatusButton(props) {
    const componentName = props.component;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const workorderComponents = useSelector(selectWorkorderComponents);
    const currentComponent = useSelector(selectCurrentComponent);
    const currentComponentImageCount = useMemo(() => {
        return workorderComponents[componentName]?.images.length || 0;
    }, [workorderComponents]);
    
    const currentStatusSubmitted = useMemo(() => {
        return ['green', 'red'].includes(workorderComponents[componentName].status);
    }, [workorderComponents]);

    const computedClassName = componentName.toLowerCase().split(' ').join('-') + '__btn';

    const handleClick = () => {
        dispatch(updateCurrentComponentName(componentName));
        console.log(workorderComponents[componentName].status);
        if (currentComponentImageCount > 0 && !currentStatusSubmitted) {
            navigate('/photo-review');
            return;
        } else if (currentStatusSubmitted) {
            navigate('/status-report');
            return;
        }
        navigate('/camera');
    }

    return (
        workorderComponents[componentName] &&
        <Button 
            color = {workorderComponents[componentName].status}
            variant="light" 
            className={computedClassName} 
            onClick={handleClick}
            style={{marginTop: 30, marginInline: 20, width: 120, height: 120, borderColor: "#1c7ed6" }} 
            // border colour from mantine default
        > 
            <h2>{componentName}</h2>
        </Button>
        
    )
}

export default ComponentStatusButton;