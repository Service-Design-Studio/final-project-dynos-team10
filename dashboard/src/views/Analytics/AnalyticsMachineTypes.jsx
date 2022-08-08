import { useEffect, useMemo } from "react";
import useMachineTypeAnalytics from "../../hooks/useMachineTypeAnalytics";
import BarGroupChart from "../../components/BarGroupChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
// import machineTypePassFail from "../../hooks/machineTypesPassFail";


export default function AnalyticsMachineTypes() {
  // const {data, keys, valueAccessorFunction} = machineTypePassFail(1)

    return (
        <div style={{width: 500, height: 500}}>
            <ParentSize>
                {({ width, height }) => (
                    <BarGroupChart
                        width={width}
                        height={height}
        
                        // keys={dataKeys}
                        // data={machineTypeCategories}
                        // colorScale={getCategoryColor}
                        // x1Scale={passFailScale}
                        // x0Scale={machineTypeScale}
                        // getx0={getMachineTypeCategory}
                        // tempScale={tempScale}
                    />
                )}
            </ParentSize>
        </div>
    )
}

