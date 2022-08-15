import { Center, Tabs } from "@mantine/core";
import AnalyticsMachineTypes from "./AnalyticsMachineTypes";
import AnalyticsPassFail from './AnalyticsPassFail';
import AnalyticsMachineFailingReasons from "./AnalyticsMachineFailingReasons";

export default function Analytics() {
    const tabs = ["Pass/Fail by Workorders", "Pass/Fail by Machine Types", "Failing Reasons by Machine Types"]

    return (
        <div>
            <Center><h2 style={{marginBottom: '16px'}}>Performance Analytics</h2></Center>
            <Tabs defaultValue="0">
                <Tabs.List grow>
                    {tabs.map((el, i) => <Tabs.Tab className="analytics-tab-btn" value={`${i}`} key={i} data-tabname={el}>{el}</Tabs.Tab>)}
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