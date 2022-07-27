import { $axios } from '../helpers/axiosHelper';
import {Button, Stack, TextInput} from '@mantine/core';
import { useState } from 'react';

//POST to create new components/machine types
//PATCH to add component types to machine types
function Home() {
    const [machine, setMachine] = useState("");
    const [componentType, setComponentType] = useState("");



    //add components to a machine type
    const addComponentToMachine = async () =>{
        const id = '1';
        try{
            //ROUTE NOT WORKING
            const toUpdate = await $axios.patch('machine_types/2', 
            {id: 2, component_type_ids:[2,3,4]});
            console.log(toUpdate);
        }
        catch(e){
            console.error(e);
            alert(e);
        };
    }

        //returns array of current components
        const currentComponents = async () => {
            try{
                const response = await $axios.get("/component_types");
                console.log({response});
                const types = response.data.result;
                const pluck = property => element => element[property];
                const value= types.map(pluck('type_name'));
                console.log({value});
                
            }
            catch(e){
                console.error(e);
                alert(e);
            }
        }


     //returns array of current machine names
     const currentMachines = async () => {
        try{
            const response = await $axios.get('machine_types');
            const types = response.data.result;
            const pluck = property => element => element[property];
            const value = types.map(pluck('type_name'));
            console.log({value});
            return value
            
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    }


    const createNewMachineType = async () => {
        try {
        const result = await $axios.post("/machine_types", {
            type_name: machine});
            console.log({result});
            } 
         catch(e) {
            console.error(e);
            alert(e);
            }
        };

        const createNewComponentType = async () => {
            try {
            const result = await $axios.post("/component_types", {
                type_name: componentType});
                console.log({result});
             } 
             catch(e){
                console.error(e);
                alert(e);
                }
            };

    return ( 
        <div>
            <TextInput
            label="NEW MACHINE"
            value={machine}
            onChange={(event)=>setMachine(event.currentTarget.value)}
            />
            <Button
            onClick={createNewMachineType}
            >
                Submit
            </Button>

            <TextInput
            label="NEW COMPONENT TYPE"
            value={componentType}
            onChange={(event)=>setComponentType(event.currentTarget.value)}
            />

            <Button
            onClick={createNewComponentType}
            >
                Submit
            </Button>
            
            <Stack>
            <Button
            onClick={addComponentToMachine}
            >
                Check
            </Button>

            <Button
            onClick={currentMachines}
            >
                Current Machines
            </Button>

            <Button
            onClick={currentComponents}
            >
                Current Components
            </Button>
            </Stack>
        </div>
        

     );
};

export default Home;