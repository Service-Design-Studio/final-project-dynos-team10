import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";
import {useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectWorkorderComponents, addNewComponent } from "../store/workorder/workorderSlice";
import { useEffect } from "react";

function ComponentStatus({navigation}) {
    const componentnames = ["label" , "wire", "xxx", "yyy"];
    const location = useLocation();
    const components = useSelector(selectWorkorderComponents);

    useEffect(() => {
        console.log({components});
    }, [components])

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