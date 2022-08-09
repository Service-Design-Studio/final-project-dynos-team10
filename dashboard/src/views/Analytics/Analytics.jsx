import { Center, Tabs } from "@mantine/core";
import AnalyticsMachineTypes from "./AnalyticsMachineTypes";
import AnalyticsPassFail from './AnalyticsPassFail';
import AnalyticsMachineFailingReasons from "./AnalyticsMachineFailingReasons";

export default function Analytics() {
    return (
        <div>
            <Center><h2 style={{marginBottom: '16px'}}>Performance Analytics</h2></Center>
            <Tabs defaultValue="0">
                <Tabs.List grow>
                    <Tabs.Tab value="0">
                        Pass/Fail by Workorders
                    </Tabs.Tab>
                    <Tabs.Tab value="1">
                        Pass/Fail by Machine Types
                    </Tabs.Tab>
                    <Tabs.Tab value="2">
                        Failing Reasons by Machine Types
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="0">
                    <AnalyticsPassFail/>
                </Tabs.Panel>

                <Tabs.Panel value="1">
                    <AnalyticsMachineTypes/>
                </Tabs.Panel>

                <Tabs.Panel value="2">
                    <AnalyticsMachineFailingReasons/>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}