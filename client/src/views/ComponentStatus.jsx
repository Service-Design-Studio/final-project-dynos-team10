import ComponentStatusButton from "../components/ComponentStatusButton";
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";

function ComponentStatus() {
    const componentnames = ["LABEL" , "WIRE", "XXX", "XXX"]

    return (
        <div className="ComponentStatus">
            <header>
            <FaBars style={{
            color: "black",
            fontSize: "1.5rem",
            margin: "1.5rem",
            marginTop: "2rem"
          }}/> 
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