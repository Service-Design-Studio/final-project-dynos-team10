import React, { useState, useEffect } from "react";
import {
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Textarea,
  Button,
  List,
  Paper,
  Text
} from "@mantine/core";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function FailReasons() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const [value, setValue] = useState("");
  const [reasons, setReasons] = useState([]);

  const handleChange = (e) => {
    setValue(e.currentTarget.value);
    console.log(e.target);
  };

  const handleClick = () => {
    setReasons((arr) => [...arr, value]);
    setValue("");
    console.log(reasons);
  };

  const listItems = reasons.map((reason) => <List.Item>{reason}</List.Item>);

  return (
    <div>
      <Header height={70} p="md">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <h1>Machine 123</h1>
        </div>
      </Header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          marginTop: "10%",
        }}
      >
        <HighlightOffIcon
          style={{ fontSize: 100, color: "red", alignItems: "center" }}
        ></HighlightOffIcon>
      <Text>Reasons for failing check:</Text>
      </div>
      

      <Paper
        style={{ margin: 40, padding: 20, marginTop: 0 }}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          marginTop: "10%",
        }}
      >
        <Button size="md" variant="filled" uppercase onClick={handleClick}>
          ENTER
        </Button>
      </div>
    </div>
  );
}

export default FailReasons;
