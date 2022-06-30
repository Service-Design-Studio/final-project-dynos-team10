import { useDispatch } from "react-redux";
import { setToken, setIsAuthenticated } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch(setToken(''));
        dispatch(setIsAuthenticated(false));

        navigate('/login');
    }

    return (
        <div>
            <h1>Welcome to the home page</h1>
            <p>If you have made it here, it means you are logged in successfully</p>
            <p>You can experiment with other routes such as /qc-entry</p>
            <button onClick={logout}>Log out</button>
        </div>
    )
}