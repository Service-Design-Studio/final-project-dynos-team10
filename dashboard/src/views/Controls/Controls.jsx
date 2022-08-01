import { Tabs } from "@mantine/core";
import MachineComponentTypes from "./MachineComponentTypes";

export default function Controls() {
    return (
        <Tabs>
            <Tabs.Tab label="Machine & Component Types">
                <MachineComponentTypes />
            </Tabs.Tab>
        </Tabs>
    )
}