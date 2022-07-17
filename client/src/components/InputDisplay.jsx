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
  Divider,
  Grid,
  ScrollArea
} from "@mantine/core";
import ClearIcon from '@mui/icons-material/Clear';
import { addFailingReasons, selectCurrentComponentName } from "../store/workorder/workorderSlice";
import { useDispatch, useSelector } from "react-redux";

function InputDisplay ( {reasons, value, setReasons, setValue} ) {
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    const currentComponentName = useSelector(selectCurrentComponentName);
  
    const handleDelete = (i) => {
      console.log('index is' + i);
      console.log("deleting" + i);
      setReasons((arr) => [...arr.slice(0, i), ...arr.slice(i+1)]);
    };

    const listItems = reasons.map((reason, index) =>

      <Paper
        shadow="xs"
        style={{marginTop: 10, 
                marginBottom: 10,
                display: "flex", 
                justifyContent: "space-between", 
                marginRight: "20%", 
                width: "99%" }}
        key={index}
      >
        <div style={{ overflowWrap: "break-word"}} >
          <Text
            size="sm"
            style={{padding: 5, 
                    marginLeft: "0.5rem",
                    overflowWrap: "break-word",
                    wordBreak: "break-all"}}
          >
            {reason}
          </Text> 
        </div>
        
        <ClearIcon 
          className="delete-failing-reasons-btn" 
          style={{fontSize: 20, color: "black", padding: 7}} 
          onClick={() => handleDelete(index)}/>

      </Paper>

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
      dispatch(addFailingReasons({
        componentName: currentComponentName,
        failingReasons: reasons
      }));
    }, [reasons]);

    return ( 
        <div>

          <Text weight={500} style={{ marginTop: 20,  textAlign: "center"}}>Reasons for failing check:</Text>
{/* 
          <Paper p="md"
            style={{ margin: 30, padding: 10, marginTop: 10 }}
            sx={(theme) => ({backgroundColor: theme.colors.gray[0],})}
            withBorder
          >
            <Text>{listItems}</Text>
          </Paper> */}
          
            <ScrollArea 
              style={{height: 210,
                      margin: "2rem", 
                      marginTop: "0.1rem", 
                      marginBottom: "1rem", 
                      padding: 10, 
                      backgroundColor: theme.colors.gray[0]}} 
                      type="scroll"
                      >
              <Text>{listItems}</Text>
            </ScrollArea>

          <div style={{display:"flex", justifyContent: "right", marginRight: "2rem", marginLeft: "2rem"}}>
            <Textarea
              style={{ width: "100%", marginRight: "0.6rem" }}
              placeholder="Type one reason at a time"
              required
              autosize
              size="sm"
              value={value}
              onChange={handleDisplay}
            />

            <Center>
              <Button
                size="sm"
                variant="filled"
                uppercase 
                onClick={handleEnter}
                className="enter-reason-btn"
              >
                ENTER
              </Button>
            </Center>
          </div>
        </div>
     );
}

export default InputDisplay ;
