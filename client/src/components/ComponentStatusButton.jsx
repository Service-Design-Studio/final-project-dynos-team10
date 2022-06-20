import { useNavigate } from 'react-router-dom';
import '../views/ComponentStatus.css'

function ComponentStatusButton(props) {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/camera')}>
            {props.component}
        </button>
    )
}

export default ComponentStatusButton;