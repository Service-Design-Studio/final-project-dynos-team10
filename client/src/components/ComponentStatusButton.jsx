import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewComponent, updateCurrentComponentName, selectWorkorderComponents } from '../store/workorder/workorderSlice';
import '../views/ComponentStatus.css'

function ComponentStatusButton(props) {
    const componentName = props.component;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const workorderComponents = useSelector(selectWorkorderComponents);
    const currentComponentImageCount = useMemo(() => {
        return workorderComponents[componentName]?.images.length || 0;
    }, [workorderComponents]);

    const computedClassName = componentName.toLowerCase().split(' ').join('-') + '__btn';

    const handleClick = () => {
        dispatch(addNewComponent(componentName));
        dispatch(updateCurrentComponentName(componentName));
        if (currentComponentImageCount > 0) {
            navigate('/photo-review');
            return;
        }
        navigate('/camera');
    }

    return (
        <button className={computedClassName} onClick={handleClick}>
            {componentName}
        </button>
    )
}

export default ComponentStatusButton;