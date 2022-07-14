import React, { useState } from "react";
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


function InputDisplay ( {reasons, value, setReasons, setValue} ) {
    const theme = useMantineTheme();
  
    const handleDelete = (i) => {
      console.log('index is' + i);
      console.log("deleting" + i);
      setReasons((arr) => [...arr.slice(0, i), ...arr.slice(i+1)]);
    };

    const listItems = reasons.map((reason, index) =>
    <Group grow> 
    <Container size="10">
      <List.Item key={index}>
        {reason}
      </List.Item>
    </Container>
    <ClearIcon className="delete-failing-reasons-btn" style={{fontSize: 10, color: "black", marginLeft: 50}} onClick={() => handleDelete(index)}/>
    </Group>
    );
    
    const handleEnter = () => {
      setReasons((arr) => [...arr, value]);
      setValue("");
    };

    const handleDisplay = (e) => {
      setValue(e.currentTarget.value);
    };

    return ( 
        <div>
        <Paper
        style={{ margin: 40, padding: 10, marginTop: 0 }}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
        })}
        withBorder
      >
        <List style={{ margin: 10, marginLeft: 20, marginRight: 20 }}>
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
