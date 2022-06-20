import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";

function ComponentStatus() {
    const componentnames = ["Label" , "Wires", "XXX"]

    return (
        <div className="ComponentStatus">
            <header>
            <FaBars style={{color: "black", fontSize: "30px", marginTop:"30px", marginRight: "30px", marginLeft: "20px"}}/> 
            <h1>Machine 123</h1>
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