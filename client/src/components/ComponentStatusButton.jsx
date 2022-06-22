import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewComponent } from '../store/workorder/workorderSlice';
import '../views/ComponentStatus.css'

function ComponentStatusButton(props) {
    const componentName = props.component;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const computedClassName = componentName.toLowerCase().split(' ').join('-') + '__btn';

    const handleClick = () => {
        dispatch(addNewComponent(componentName));
        navigate('/camera');
    }

    return (
        <button className={computedClassName} onClick={handleClick}>
            {componentName}
        </button>
    )
}

export default ComponentStatusButton;