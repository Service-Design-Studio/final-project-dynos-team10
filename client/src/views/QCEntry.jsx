import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QCEntry.css";
import { FaBars } from "react-icons/fa";
import { $axios } from '../axiosHelper';

function QCEntry({navigation}) {
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
  };

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

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
        // createWorkOrder().then(() => {
        navigate('/component-status',{state:{serialno: formValues.serialno }});
      // });
    }
  }, [formErrors, isSubmit]);

  // const createWorkOrder = async () => {
  //   try {
  //     const result = await $axios.post('workorders', {
  //       workorder_number: formValues.serialno,
  //       machine_type: formValues.type
  //     });
  //     console.log({result});
  //   } catch (e) {
  //     console.error(e);
  //     alert(e);
  //   }
  // }

  return (
    <div>
      <header>
        <FaBars
          style={{
            color: "black",
            fontSize: "1.5rem",
            margin: "1.5rem",
            marginTop: "2rem"
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
              TYPE OF MACHINE
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
