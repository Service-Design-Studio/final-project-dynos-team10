import React, { useEffect, useState } from "react";
import {
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Center,
  Group,
  Box,
  Text,
  Divider
} from "@mantine/core";
import ClearIcon from '@mui/icons-material/Clear';
import { Container } from "@mui/system";
// import { Box } from "@mui/material";
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

<<<<<<< HEAD
      <Paper
        shadow="xs"
        style={{padding: 7,
                marginTop: 5, 
                display: "flex", 
                justifyContent: "space-between", 
                marginRight: "20%", 
                width: "100%" }}
        key={index}
        >

        <Paper
          style={{
          width: "100%" }}
        > 
          <Text style={{width: "300px"}} >{reason}</Text> 
        </Paper>
        
        <ClearIcon 
          className="delete-failing-reasons-btn" 
          style={{fontSize: 20, color: "black", marginLeft: 50, alignItems: "center"}} 
          onClick={() => handleDelete(index)}/>
      </Paper>


=======
    <ClearIcon className={`delete-failing-reasons-btn delete-failing-reasons-btn--${index}`} style={{fontSize: 10, color: "black", marginLeft: 50}} onClick={() => handleDelete(index)}/>
    
    </Group>
>>>>>>> c8616f87cb67718eaa89b40e9946b0884311a51e
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
<<<<<<< HEAD
          <Paper p="md"
            style={{ margin: 40, padding: 10, marginTop: 0 }}
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[0],
            })}
            withBorder
          >
            <Text>{listItems}</Text>
          </Paper>
=======
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
>>>>>>> c8616f87cb67718eaa89b40e9946b0884311a51e

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
s
        </div>
     );
}

export default InputDisplay ;
