import { useNavigate } from 'react-router-dom';
import '../views/ComponentStatus.css'

function ComponentStatusButton(props) {
    const navigate = useNavigate();

    const computedClassName = props.component.toLowerCase().split(' ').join('-') + '__btn';

    return (
        <button className={computedClassName} onClick={() => navigate('/camera')}>
            {props.component}
        </button>
    )
}

export default ComponentStatusButton;