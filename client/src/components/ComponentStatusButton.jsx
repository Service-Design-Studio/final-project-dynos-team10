import { useNavigate } from 'react-router-dom';

function ComponentStatusButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/camera')}>
            Label
        </button>
    )
}

export default ComponentStatusButton;