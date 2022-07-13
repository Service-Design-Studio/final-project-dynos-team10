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

  const [value, setValue] = useState("");
  const [reasons, setReasons] = useState([]);

  const handleChange = (e) => {
    setValue(e.currentTarget.value);
    console.log(e.target);
  };

  const handleClick = () => {
    setReasons((arr) => [...arr, value]);
    setValue("");
  };

  const handleNextPage = () => {
    navigate('/component-status')
  };

  const UploadButton = () => {
    if (reasons.length > 0) {
        return (<Button onClick={handleNextPage} style={{marginLeft: 10}} size="md" variant="filled" uppercase>UPLOAD</Button>)
    };
    return (<Button style={{marginLeft: 10}} size="md" variant="filled" uppercase disabled>UPLOAD</Button>)
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
      
      <InputDisplay 
      reasons={reasons}
      value={value}
      setReasons={setReasons}
      setValue={setValue}
      />

      <Center style={{marginTop:20, marginRight: 10}}>
        <UploadButton/>
      </Center>
        

    </div>
  );
}

export default FailReasons;
