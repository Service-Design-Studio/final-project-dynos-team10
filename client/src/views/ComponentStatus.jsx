import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectWorkorderNumber } from "../store/workorder/workorderSlice";

function ComponentStatus({navigation}) {
    const componentnames = ["label" , "wire", "xxx", "yyy"];
    const workorderNumber = useSelector(selectWorkorderNumber);

    return (
        <div className="ComponentStatus">
            <header>
            <FaBars style={{
            color: "black",
            fontSize: "1.5rem",
            margin: "1.5rem",
            marginTop: "2rem"
          }}/> 

            <h1>{workorderNumber}</h1>
            </header>
            
            <div className="Buttongroup">
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