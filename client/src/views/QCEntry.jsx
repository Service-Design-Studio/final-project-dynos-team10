import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { $axios } from "../helpers/axiosHelper";
import { useDispatch } from "react-redux";
import { setWorkorderNumber } from "../store/workorder/workorderSlice";
import {
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  TextInput,
  Text,
  Button,
  Stack,
} from "@mantine/core";

function QCEntry({}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(() => {
    if (state == null) {
      return { serialno: "", type: "" };
    }
    return { serialno: state.workorder, type: state.machinetype };
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

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

  const handleScanner = () => {
    navigate("/qrscanner");
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      createWorkOrder().then(() => {
        dispatch(setWorkorderNumber(formValues.serialno));
        navigate("/component-status");
      });
    }
  }, [formErrors, isSubmit]);

  const createWorkOrder = async () => {
    try {
      const result = await $axios.post("workorders", {
        workorder_number: formValues.serialno,
        machine_type: formValues.type,
      });
      console.log({ result });
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <Header height={70} p="md">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <h1>QC Entry</h1>
        </div>
      </Header>

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
      <Button size="sm" variant="outline" onClick={handleScanner}>
        SCAN QR CODE
      </Button>

      <Button
        size="md"
        variant="filled"
        onClick={handleNextPage}
        uppercase
        className="submit-workorder-btn"
      >
        NEXT
      </Button>
  
      </Stack>
    </div>
  );
}

export default QCEntry;
