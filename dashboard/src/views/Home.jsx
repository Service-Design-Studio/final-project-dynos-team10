import { $axios } from '../helpers/axiosHelper';
import {Button, Stack, TextInput} from '@mantine/core';
import { useState } from 'react';


function Home() {
    const adddFailingReasonToMachine = async (failingReasonIndex) =>{
        const id = 1
        try{
            const toUpdate = await $axios.patch(`component_types/${id}`, 
            {id, failing_reasons_type_ids: [4,5]});
            console.log(toUpdate)
        }
        catch(e){
            console.error(e);
            alert(e);
        };
    };

    const currentComponents = async () => {
        try{
            const response = await $axios.get("/component_types/1");
            const values = response.data.result;
            console.log(values);
    
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    };

    return ( 
        <div>
            <Button onClick={adddFailingReasonToMachine}> ADD</Button>
     

        
            <Button onClick={currentComponents}> get</Button>
        </div>
     );
}

export default Home;