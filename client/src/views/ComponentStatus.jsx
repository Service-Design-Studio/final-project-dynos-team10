import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";
import {useLocation} from 'react-router-dom';

function ComponentStatus({navigation}) {
    const componentnames = ["LABEL" , "WIRE", "XXX", "YYY"]
    const location = useLocation();
    return (
        <div className="ComponentStatus">
            <header>
            <FaBars style={{
            color: "black",
            fontSize: "1.5rem",
            margin: "1.5rem",
            marginTop: "2rem"
          }}/> 

            <h1>{location.state.serialno}</h1>
            </header>
            
            <div className="Buttongroup">
                {
                    componentnames.map((componentname) => 
                        <ComponentStatusButton component={componentname} />
                    )
                }

            </div>
        </div>
    )
}

export default ComponentStatus;