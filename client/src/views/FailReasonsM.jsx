import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Text,
  Center
} from "@mantine/core";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputDisplay from "../components/InputDisplay.jsx";
import { StepContext } from "@mui/material";

function FailReasons() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [next, setNext] = useState(false)

  const handleNextPage = () => {
    navigate('/component-status')
  };

  const NextButton = () => {
    if (next) {
        return (<Button onClick={handleNextPage} style={{marginLeft: 10}} size="md" variant="filled" uppercase>NEXT</Button>)
    };
    return (<Button style={{marginLeft: 10}} size="md" variant="filled" uppercase disabled>NEXT</Button>)
  };


  return (
    <div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          marginTop: "5%",
        }}
      >
        <HighlightOffIcon
          style={{ fontSize: 100, color: "red", alignItems: "center" }}
        ></HighlightOffIcon>
      <Text style={{marginTop: 15}}>Reasons for failing check:</Text>
      </div>
      
      <InputDisplay/>

      <Center>
        <NextButton/>
      </Center>
        

    </div>
  );
}

export default FailReasons;
