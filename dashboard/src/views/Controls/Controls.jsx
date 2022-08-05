import { Tabs } from "@mantine/core";
import MachineComponentTypes from "./MachineComponentTypes";

export default function Controls() {
    return (
        <div>
            <Tabs defaultValue="Machine & Component Types">
                <Tabs.List>
                    <Tabs.Tab value="Machine & Component Types">
                        Machine & Component Type
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel 
                value="Machine & Component Types"
                style={{marginTop: 10}}>
                    <MachineComponentTypes />
                </Tabs.Panel>
            </Tabs>
        </div>

        
    )
}