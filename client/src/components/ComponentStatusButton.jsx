import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    updateCurrentComponentName, 
    selectWorkorderComponents, 
    selectCurrentComponent 
} from '../store/workorder/workorderSlice';
import { Button, Spoiler, Text, Paper } from "@mantine/core"
import OptionsModal from "../components/OptionsModal";


function ComponentStatusButton(props) {
    const componentName = props.component;
    const [optionsModal, setOptionsModal] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const workorderComponents = useSelector(selectWorkorderComponents);
    const currentComponent = useSelector(selectCurrentComponent);
    const currentComponentImageCount = useMemo(() => {
        return workorderComponents[componentName]?.images.length || 0;
    }, [workorderComponents]);
    
    const currentStatusSubmitted = useMemo(() => {
        if (workorderComponents[componentName]) {
            return ['green', 'red'].includes(workorderComponents[componentName].status);
        }
    }, [workorderComponents]);

    const computedClassName = componentName.toLowerCase().split(' ').join('-') + '__btn';

    const handleClick = () => {
        dispatch(updateCurrentComponentName(componentName));
        // console.log(workorderComponents[componentName].status);
        if (currentComponentImageCount >= 0 && !currentStatusSubmitted) {
            setOptionsModal(true)
            return;
        } else if (currentStatusSubmitted) {
            navigate('/status-report');
            return;
        }
    }

    return (
        <div>
            {optionsModal &&
                <OptionsModal
                    optionsModal={optionsModal}
                    setOptionsModal={setOptionsModal}
                />
            }
            
            
        {workorderComponents[componentName] &&
        <Button 
            color = {workorderComponents[componentName].status}
            variant="light" 
            className={computedClassName} 
            onClick={handleClick}
            style={{
                // display: "flex", 
                marginTop: 30, 
                marginInline: 20, 
                width: 120, 
                height: 120, 
                borderColor: "#1c7ed6", 
                overflowWrap: "break-word", 
                wordBreak: "break-all", }} 
            // border colour from mantine default
        > 
            <div style={{ overflowWrap: "break-word", wordBreak: "break-all",}} > 
                <h3 style={{maxWidth: 110, overflowWrap: "break-word", wordBreak: "break-all", }} >{componentName}</h3>
            </div>

        </Button>
        }
        </div>
        
    )
}

export default ComponentStatusButton;