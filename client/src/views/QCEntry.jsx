import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { $axios } from '../helpers/axiosHelper';
import { useDispatch } from "react-redux";
import { setWorkorderNumber } from "../store/workorder/workorderSlice";
import {
  AppShell,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  TextInput,
  Select,
  Button,
} from "@mantine/core";

function QCEntry({ navigation }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    serialno: "",
    type: "default",
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
    if (values.type === "default") {
      errors.type = "Type of machine is required!";
    }
    return errors;
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
      const result = await $axios.post('workorders', {
        workorder_number: formValues.serialno,
        machine_type: formValues.type
      });
      console.log({result});
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
        <div style={{ display: "flex", flexDirection:"row", alignItems: "center", height: "100%" }}>
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


      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", marginTop: "10%"}}>

      <TextInput
        placeholder="MACHINE S/N"
        name="serialno"
        type="text"
        value={formValues.serialno}
        onChange={handleChange}
        size="sm"
        style= {{paddingLeft: 12, paddingRight: 12, width: 200}}
      />

      <p>{formErrors.serialno}</p>

      <Select
        placeholder="Machine Type"
        name="type"
        value={formValues.type}
        data={[
          { value: "machine_1", label: "Machine 1" },
          { value: "machine_2", label: "Machine 2" },
          { value: "machine_3", label: "Machine 3" },
        ]}
        onChange={(e) => setFormValues({ ...formValues, ["type"]: e })}
      />

      <p>{formErrors.type}</p>

      <Button size="md" variant="filled" onClick={handleNextPage} uppercase>
        NEXT
      </Button>
      </div>

    </div>
  );
}

export default QCEntry;
