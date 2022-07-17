import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { $axios } from "../helpers/axiosHelper";
import { useDispatch } from "react-redux";
import { startNewWorkorder } from "../store/workorder/workorderSlice";
import {
  useMantineTheme,
  TextInput,
  Text,
  Button,
  Stack,
  Modal,
  Center
} from "@mantine/core";
import { QrReader } from "react-qr-reader";

function QCEntry({}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(
    { serialno: "", type: "" }
    );

  const [formErrors, setFormErrors] = useState({});
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
        if (e.response.data.errors.workorder_number) {
          setFormErrors({serialno: 'workorder number is taken'});
        }
      }
      setIsLoading(false);
    })();
  }, [formErrors, isSubmit]);

  const NextButton = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    if (Object.keys(formErrors).length === 0 && isSubmit) {
        return (<Button size="md"
        variant="filled"
        onClick={handleNextPage}
        uppercase
        className="submit-workorder-btn">NEXT</Button>)
    };
    return (<Button size="md"
    variant="filled"
    onClick={handleNextPage}
    uppercase
    className="submit-workorder-btn" 
    disabled>NEXT</Button>)
  };

  const createWorkOrder = async () => {
    return await $axios.post("workorders", {
      workorder_number: formValues.serialno,
      machine_type: formValues.type,
    });
  };

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  
  const handleResult = (result, error) => {
    if (!!result) {
      const data = result?.text.split(",");
      setFormValues({serialno: data[0], type: data[2]});
      setOpened(false)
      // just comment out if dont want to reload
      // window.location.reload();
    }

    if (!!error) {
      console.info(error);
    }
  };

  const QRCode = () => {
    if (setOpened){
      return (  
      <QrReader
        onResult={handleResult}
        scanDelay={2000}
        style={{
          display: "block",
          position: "absolute",
          overflow: "hidden",
        }}
      />)
    }
  }

  return (
    <div>

      <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Scan QR Code"
      >

        <div
          style={{
            overflow: "hidden",
            position: "relative",  
            height:300,
            alignItems:"center"
          }}
        >
          <div
            style={{
              top: "0px",
              left: "0px",
              zIndex: 1,
              boxSizing: "border-box",
              border: "50px solid rgba(0, 0, 0, 0.3)",
              boxShadow: "rgba(255, 0, 0, 0.5) 0px 0px 0px 5px inset",
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          ></div>
          
          <QRCode/>


        </div>
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
          <TextInput
            placeholder="MACHINE TYPE"
            name="type"
            type="text"
            value={formValues.type}
            onChange={handleChange}
            size="sm"
            style={{ paddingLeft: 12, paddingRight: 12, width: 200 }}
          />

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
