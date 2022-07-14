import React, { useEffect, useState } from "react";
import {
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Center,
  Group,

} from "@mantine/core";
import ClearIcon from '@mui/icons-material/Clear';
import { Container } from "@mui/system";
import { Box } from "@mui/material";
import { addFailReasons } from "../store/workorder/workorderSlice";
import { useDispatch, useSelector } from "react-redux";



function InputDisplay ( {reasons, value, setReasons, setValue} ) {
    const theme = useMantineTheme();
    const dispatch = useDispatch();
  
    const handleDelete = (i) => {
      console.log('index is' + i);
      console.log("deleting" + i);
      setReasons((arr) => [...arr.slice(0, i), ...arr.slice(i+1)]);
    };

    const listItems = reasons.map((reason, index) =>
    <Group grow> 
    
    <Container size="10">
      <Box key={index}>
        {reason}
      </Box>
    </Container>

    <ClearIcon className={`delete-failing-reasons-btn delete-failing-reasons-btn--${index}`} style={{fontSize: 10, color: "black", marginLeft: 50}} onClick={() => handleDelete(index)}/>
    
    </Group>
    );
    
    const handleEnter = () => {
      setReasons((arr) => [...arr, value]);
      setValue("");
    };

    const handleDisplay = (e) => {
      setValue(e.currentTarget.value);
    };

    useEffect(() => {
      console.log("reasons = " + reasons);
      dispatch(addFailReasons(reasons));
    }, [reasons]);

    return ( 
        <div>
        <Paper
        style={{ margin: 40, padding: 10, marginTop: 0 }}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
        })}
        withBorder
        className="reasons-list"
      >
          {listItems}

      </Paper>

      <Textarea
        style={{ margin: 40, marginTop: 20 }}
        placeholder="Type one reason at a time"
        required
        autosize
        size="sm"
        value={value}
        onChange={handleDisplay}
      />

        <Center>
        <Button
          size="md"
          variant="filled"
          uppercase 
          onClick={handleEnter}
          className="enter-reason-btn"
        >
          ENTER
        </Button>
        </Center>
        </div>
     );
}

export default InputDisplay ;
