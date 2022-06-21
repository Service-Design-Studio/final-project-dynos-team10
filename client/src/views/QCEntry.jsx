import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComponentStatus.css'
import { FaBars } from "react-icons/fa";

function QCEntry() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        serialno: "",
        type: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true)
    };

    useEffect (() => {
        if (Object.keys(formErrors).length === 0 && isSubmit){
            console.log(formValues)
        }
    }, [formErrors])

    const validate = (values) =>{
        const errors = {};
        if (!values.serialno){
            errors.serialno = "Serial number is required!";
        }
        if (!values.type){
            errors.type = "Type of machine is required!";
        }
        return errors;
    };

    return (  
        <div>
            <header>
                <FaBars style={{color: "black", fontSize: "30px", marginTop:"30px", marginRight: "30px", marginLeft: "20px"}}/> 
                <h1>New QC Entry</h1>
            </header>

            <form onSubmit={handleSubmit}>
                <div className='machine number'>
                    <input 
                    placeholder='MACHINE S/N'
                    name="serialno"
                    type="text"
                    value={formValues.serialno}
                    onChange = {handleChange}
                    />
                </div>
                <p>{ formErrors.serialno }</p>

                <div className='machine type'>
                    <select name="type" value={formValues.type} onChange={handleChange}>
                        <option value=""></option>
                        <option value="M1">Machine 1</option>
                        <option value="M2">Machine 2</option>
                        <option value="M3">Machine 3</option>
                    </select>
                </div>
                <p>{ formErrors.type }</p>

                <button>
                    NEXT 
                </button>
            </form>

        </div>
    );
}

export default QCEntry;
