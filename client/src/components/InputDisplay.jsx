import React, { useEffect, useState } from "react";
import {
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Center,

} from "@mantine/core";
import ClearIcon from '@mui/icons-material/Clear';
import { addFailReasons } from "../store/workorder/workorderSlice";
import { useDispatch, useSelector } from "react-redux";



function InputDisplay ( {reasons, value, setReasons, setValue} ) {
    const theme = useMantineTheme();
    const listItems = reasons.map((reason, index) => <List.Item key={index}>{reason}</List.Item>);
    const dispatch = useDispatch();
    const handleDelete = () => {
      console.log('deleting')
    };

    <div style={{display: "inline", flexDirection:"row", flexWrap: "nowrap"}}> 
    <List.Item key={index}>
      {reason}
    </List.Item>
    <ClearIcon style={{fontSize: 10, color: "black", alignItems:"right", alignContent:"right" }} onClick={handleDelete}/>
    </div>

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
      >
        <List className="reasons-list" style={{ margin: 10, marginLeft: 20, marginRight: 20 }}>
          {listItems}
        </List>
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
