import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QCEntry.css";
import { FaBars } from "react-icons/fa";

function QCEntry() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    serialno: "",
    type: "default",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
        navigate("/component-status");
      }
  };

  // useEffect (() => {
  //     if (Object.keys(formErrors).length === 0 && isSubmit){
  //         console.log(formValues)
  //     }
  // }, [formErrors])

  const validate = (values) => {
    const errors = {};
    if (!values.serialno) {
      errors.serialno = "Serial number is required!";
    }
    if (values.type === "default") {
      errors.type = "Type of machine is required!";
    }
    return errors;
  };

  return (
    <div>
      <header>
        <FaBars
          style={{
            color: "black",
            fontSize: "30px",
            marginTop: "30px",
            marginRight: "30px",
            marginLeft: "20px",
          }}
        />
        <h1>New QC Entry</h1>
      </header>

      <form>

        <div className="formcontainer">
          <input
            placeholder="MACHINE S/N"
            name="serialno"
            type="text"
            value={formValues.serialno}
            onChange={handleChange}
          />

          <p>{formErrors.serialno}</p>

          <select name="type" value={formValues.type} onChange={handleChange}>
            <option value="default" disabled hidden>
              Type of Machine
            </option>
            <option value="M1">Machine 1</option>
            <option value="M2">Machine 2</option>
            <option value="M3">Machine 3</option>
          </select>

          <p>{formErrors.type}</p>

          <button onClick={handleNextPage}>NEXT</button>
        </div>
      </form>
    </div>
  );
}

export default QCEntry;
