import ComponentStatusButton from "../components/ComponentStatusButton";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { selectWorkorderNumber, addNewComponent } from "../store/workorder/workorderSlice";
import { useMantineTheme } from "@mantine/core";
import {useState, useEffect } from "react";

function ComponentStatus({navigation}) {
    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const componentnames = ["label" , "wire", "xxx", "yyy"];
    const workorderNumber = useSelector(selectWorkorderNumber);

    const [componentsReady, setComponentsReady] = useState(false);

    useEffect(() => {
        componentnames.forEach(componentName => {
            dispatch(addNewComponent(componentName));
        });
        setComponentsReady(true);
    }, []);

    return (
        <div>
            
            <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {
                    componentsReady &&
                    componentnames.map((componentname, index) => 
                        <ComponentStatusButton key={index} component={componentname} />
                    )
                }

            </div>
        </div>
    )
}

export default ComponentStatus;