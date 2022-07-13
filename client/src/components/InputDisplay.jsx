import React, { useState } from "react";
import {
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Center
} from "@mantine/core";

function InputDisplay () {
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

    const listItems = reasons.map((reason) => <List.Item>{reason}</List.Item>);

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
        onChange={handleChange}
      />

        <Center>
        <Button size="md" variant="filled" uppercase onClick={handleClick}>
          ENTER
        </Button>
        </Center>
        </div>
     );
}

export default InputDisplay ;
