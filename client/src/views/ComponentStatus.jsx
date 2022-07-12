import ComponentStatusButton from "../components/ComponentStatusButton";
import { FaBars } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectWorkorderNumber } from "../store/workorder/workorderSlice";
import {
    Header,
    MediaQuery,
    Burger,
    useMantineTheme
  } from "@mantine/core";
  import {useState} from "react";

function ComponentStatus({navigation}) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const componentnames = ["label" , "wire", "xxx", "yyy"];
    const workorderNumber = useSelector(selectWorkorderNumber);

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

          <h1>1234</h1>
          {/* <h1>{workorderNumber}</h1> */}
        </div>
      </Header>
            
            <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {
                    componentnames.map((componentname, index) => 
                        <ComponentStatusButton key={index} component={componentname} />
                    )
                }

            </div>
        </div>
    )
}

export default ComponentStatus;