import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";

function ComponentStatus() {
    const componentnames = ["Label" , "Wires"]

    return (
        <div className="ComponentStatus">
            <header>
            <FaBars style={{color: "black", fontSize: "30px", marginTop:"30px", marginRight: "30px", marginLeft: "20px"}}/> 
            <h1>Machine 123</h1>
            </header>
            
            <div className="Buttongroup">
                {/* componentnames.map((component) => 
            <ComponentStatusButton component={component} />
                ) */}
            <ComponentStatusButton component="LABEL" />
            <ComponentStatusButton component="WIRE" />
            </div>

            <ComponentStatusButton component="XXX" />
            <ComponentStatusButton component="XXX" />
            

        </div>
    )
}

export default ComponentStatus;