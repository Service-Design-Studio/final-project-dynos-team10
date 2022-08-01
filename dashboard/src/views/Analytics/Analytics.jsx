import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction } = usePassFailAnalytics();
    const navigate = useNavigate();

    return (
        <div>
            <div style={{width: '500px', height: '500px'}}>
                <ParentSize>
                    {({ width, height }) => (
                        <PieChart
                            width={width}
                            height={height}
                            data={binaryCategorisedWorkorders}
                            valueAccessorFunction={valueAccessorFunction}
                            getCategoryColor={getCategoryColor}
                            onClick={() => navigate('/analytics/pass-fail')}
                        />
                    )}
                </ParentSize>
            </div>
        </div>
    )
}