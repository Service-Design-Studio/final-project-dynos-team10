import { useDispatch } from "react-redux";
import { setToken, setIsAuthenticated } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useMantineTheme,
  Button
} from "@mantine/core";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';

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

      <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Button 
        colour="blue" 
        variant="outline" 
        style={{marginTop: 30, marginInline: 20, height: 75}} 
        leftIcon={<AddBoxRoundedIcon style={{fontSize: 50}}/>}
        className="home__new-entry-btn"
        onClick={() => navigate('/qc-entry')}
        fullWidth> 
        
        <h2 style={{color: 'black'}}>New Entry</h2>
      </Button>

      <Button 
        colour="blue" 
        variant="outline" 
        style={{marginTop: 30, marginInline: 20, height: 75}} 
        leftIcon={<DraftsRoundedIcon style={{fontSize: 50}}/>}
        fullWidth
        className="home__drafts-btn"
        onClick={() => navigate('/qc-list')}> 
        <h2 style={{color: 'black'}}>Drafts</h2>
      </Button>

</div>

      </div>
    )
}