import { useDispatch } from "react-redux";
import { setToken, setIsAuthenticated } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Header,
  MediaQuery,
  Burger,
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
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const handleNextPage = () => {
      navigate('/qc-entry')
    };

    return (
    <div>
      <Header height={70} p="md">
        <div style={{ display: "flex", flexDirection:"row", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <h1>Home</h1>
        </div>
      </Header>

      <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Button 
        colour="blue" 
        variant="outline" 
        style={{marginTop: 30, marginInline: 20, height: 75}} 
        leftIcon={<AddBoxRoundedIcon style={{fontSize: 50}}/>}
        onClick={handleNextPage}
        fullWidth> 
        
            <h2 style={{color: 'black'}}>New Entry</h2>
            </Button>

            <Button 
        colour="blue" 
        variant="outline" 
        style={{marginTop: 30, marginInline: 20, height: 75}} 
        leftIcon={<DraftsRoundedIcon style={{fontSize: 50}}/>}
        fullWidth> 
            <h2 style={{color: 'black'}}>Drafts</h2>
            </Button>

</div>

      </div>
    )
}