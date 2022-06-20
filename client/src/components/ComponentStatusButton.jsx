import { useNavigate } from 'react-router-dom';
import '../views/ComponentStatus.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';

function ComponentStatusButton(props) {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/camera')}>
            {props.component}
        </button>
    )
}

export default ComponentStatusButton;