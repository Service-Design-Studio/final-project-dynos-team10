import { $axios } from '../helpers/axiosHelper';
import {Button, TextInput} from '@mantine/core';
import { useState } from 'react';

//POST to create new components/machine types
//PATCH to add component types to machine types
function Home() {
    const [machine, setMachine] = useState("");
    const [componentType, setComponentType] = useState("");

    

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

    //returns array of current components
    const currentComponents = async () => {
        try{
            ///ROUTE NOT WORKING
            const response = await $axios.get("component_types");
            console.log({response});
            // const types = response.data.result;
            // const pluck = property => element => element[property];
            // const value= types.map(pluck('type_name'));
            // console.log({value});
            
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    }

    //add components to a machine type
    const addComponentToMachine = async () =>{
        const id = 'wire'
        try{
            //ROUTE NOT WORKING
            const toUpdate = await $axios.patch('machine_types/${id}')
            console.log(toUpdate)
        }
        catch(e){
            console.error(e);
            alert(e);
        };
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
            <Button
            onClick={addComponentToMachine}
            >
                Check
            </Button>
 
        </div>
        

     );
};

export default Home;