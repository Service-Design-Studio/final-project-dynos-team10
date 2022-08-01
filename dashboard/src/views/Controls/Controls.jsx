import { Tabs } from "@mantine/core";
import MachineComponentTypes from "./MachineComponentTypes";
import ComponentFailingReasons from "./ComponentFailingReasons";

export default function Controls() {
    return (
        <Tabs>
            <Tabs.Tab label="Machine & Component Types">
                <MachineComponentTypes />
            </Tabs.Tab>
            <Tabs.Tab label="Component Types & Failing Reasons">
                <ComponentFailingReasons />
            </Tabs.Tab>
        </Tabs>
    )
}