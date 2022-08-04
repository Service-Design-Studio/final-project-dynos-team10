import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { $axios } from "../helpers/axiosHelper";
import { useDispatch } from "react-redux";
import { startNewWorkorder } from "../store/workorder/workorderSlice";
import {
  TextInput,
  Text,
  Button,
  Stack,
  Modal,
  Select
} from "@mantine/core";
import QrReader from 'modern-react-qr-reader';

function QCEntry() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [existingMachineTypes, setExistingMachineTypes] = useState([]);
  useEffect(() => {
    (async () => {
      let response;
      try {
        response = await $axios.get('machine_types');
        setExistingMachineTypes(response.data.result);
      } catch (e) {
        console.log(e);
      }
    })()
  }, [])
  const existingMachineTypesOptions = useMemo(() => existingMachineTypes.map(el => {
    return {
      value: el.type_name,
      label: el.type_name
    }
  }), [existingMachineTypes])

  const [formValues, setFormValues] = useState(
    { serialno: "", type: "" }
  );

  const [formErrors, setFormErrors] = useState({});
  const [prevValue, setPrevValue] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    console.log(e.target);
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
    if (!values.type) {
      errors.type = "Type of machine is required!";
    }
    return errors;
  };

  useEffect(() => {
    (async() => {
      setIsLoading(true);
      try {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
          const result = await createWorkOrder();
          console.log({ result });
          dispatch(startNewWorkorder(formValues.serialno));
          navigate("/component-status");
        }
      } catch (e) {
        console.error(e);
        const errors = {};
        if (e.response.data.errors.workorder_number) {
          errors.serialno = 'workorder number is taken';
        }
        if (e.response.data.errors.machine_type) {
          errors.type = 'machine type does not exist';
        }
        setFormErrors(errors);
      }
      setIsLoading(false);
    })();
  }, [formErrors, isSubmit]);

  const createWorkOrder = async () => {
    const existingMachineTypeObj = existingMachineTypes.find(el => el.type_name === formValues.type);
    return await $axios.post("workorders", {
      workorder_number: formValues.serialno,
      machine_type_id: existingMachineTypeObj.id,
    });
  };

  const [opened, setOpened] = useState(false);
  
  const handleResult = (result) => {
    if (result !== null) {
      if (prevValue !== formValues && opened){
        console.log(typeof result)
        console.log(result)
        const data = result.split(",");
        setPrevValue(formValues);

        setFormValues({serialno: data[0], type: data[2]});

        if (!existingMachineTypes.find(el => el.type_name === data[2])) {
          setFormErrors({type: 'This machine type does not exist'});
        }
        setOpened(false);
      }

      setOpened(false);
      return;
      // just comment out if dont want to reload
      // window.location.reload();
    }
  };

  const handleError = err => {
    console.error(err)
  }

  return (
    <div>

      <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Scan QR Code"
      >
        {
          opened &&
          <QrReader
            delay={300}
            facingMode={"environment"}
            onError={handleError}
            onScan={handleResult}
            style={{ width: '100%' }}
            className="qr-scanner"
          />
        }
          

      </Modal>
      <Stack spacing={"md"} align="center" justify={"center"}>
        <Stack
          spacing={"5"}
          align="center"
          justify={"center"}
          style={{ marginTop: "10%" }}
        >

          <TextInput
            placeholder="MACHINE S/N"
            name="serialno"
            type="text"
            value={formValues.serialno}
            onChange={handleChange}
            size="sm"
            style={{ paddingLeft: 12, paddingRight: 12, width: 200 }}
          />

          <Text size="sm" color={"red"}>
            {formErrors.serialno}
          </Text>

        </Stack>

        <Stack spacing={"5"} align="center" justify={"center"}>
          <Select
            placeholder="MACHINE TYPE"
            data={existingMachineTypesOptions}
            searchable
            clearable 
            nothingFound="No options"
            value={formValues.type}
            onChange={val => setFormValues({ ...formValues, 'type': val })}
          />
          {/* <TextInput
            placeholder="MACHINE TYPE"
            name="type"
            type="text"
            value={formValues.type}
            onChange={handleChange}
            size="sm"
            style={{ paddingLeft: 12, paddingRight: 12, width: 200 }}
          /> */}

          <Text size="sm" color={"red"}>
            {formErrors.type}
          </Text>
        </Stack>
      </Stack>

      <Stack style={{marginTop: "10%"}} spacing={"md"} align="center" justify={"center"}>
      <Button 
      className="qr-scanner-btn" 
      size="sm" 
      variant="outline" 
      onClick={() => setOpened(true)}>
        SCAN QR CODE
      </Button>

  
      <Button
        size="md"
        variant="filled"
        onClick={handleNextPage}
        uppercase
        className="submit-workorder-btn"
        loading={isLoading}
      >
        NEXT
      </Button>
  
      </Stack>
    </div>
  );
}

export default QCEntry;
