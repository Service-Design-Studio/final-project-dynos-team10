import BarGroupChart from "../../components/BarGroupChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import machineTypePassFail from "../../hooks/machineTypesPassFail";


export default function AnalyticsMachineTypes() {
  const {data, keys, colourScale, valueAccessorFunction} = machineTypePassFail();
  console.log(data);

    return (
        <div style={{width: 500, height: 500}}>
            <ParentSize>
                {({ width, height }) => (
                    <BarGroupChart
                        width={width}
                        height={height}
                        data={data}
                        keys={keys}
                        colorScale={colourScale}
                        accessor={valueAccessorFunction}
                    />
                )}
            </ParentSize>
        </div>
    )
}

