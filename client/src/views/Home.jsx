import { useDispatch } from "react-redux";
import { setToken, setIsAuthenticated } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

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
      </div>
    )
}