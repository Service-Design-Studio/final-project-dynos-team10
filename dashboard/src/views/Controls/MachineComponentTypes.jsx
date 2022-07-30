import { 
    Button,
    Group,
    Title,
    ScrollArea,
    ActionIcon,
    Tooltip,
    TextInput,
    Drawer,
    Text,
    Checkbox
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { useState,useEffect, useMemo } from 'react';
import { Box, Components, Plus } from 'tabler-icons-react';
import { ContentGroup } from '../../components/CollapsableContentItem';
import { $axios } from '../../helpers/axiosHelper';


export default function MachineComponentTypes() {
    const [machineTypes, machineTypesHandlers] = useListState([]);
    // const [componentTypes, componentTypesHandlers] = useListState([]);
    const [editDrawerOpened, setEditDrawerOpened] = useState(false);
    const [editingMachineType, setEditingMachineType] = useState('');
    const [components, setComponents] = useState([]);
    const [machines, setMachines] = useState([]);

    const mapComponents = () => {
        const listToChange = []
        components.map(el => 
            listToChange.push({
                label: el.type_name
            })
            )
        return listToChange
    };

    const componentTypes = useMemo(() => mapComponents(), [components])

      // const mapMachines = () => {
    //     const listToChange=[]
    //     machines.map(el => {
    //         const itemList = []

    //         el.component_types.map(c => 
    //             itemList.push({
    //                 label: c.id
    //             })
    //         );

    //         listToChange.push({
    //             label: el.type_name,
    //             rightElementIfEmpty: <AddComponentButton machineType={el.type_name}/>,
    //             footer: <Button className="edit" fullWidth mt="sm" onClick={() => editMachineType(el.type_name)}>Edit Components</Button>,
    //             items: itemList
    //         })
    //     })
    // }
    // console.log(machines)
    // const machineTypes = useMemo(() => mapMachines(), [machines])
    // const machineTypesItems = () => {
    //     return machineTypes.map((item, i) => <ContentGroup key={i} {...item} />)}

    // useEffect(() => { machineTypesItems   
    // }, [machineTypes])

    const pluck = property => element => element[property];

    // machines = [{id: 1, type_name: string}]
    // components = [{id:1, type_name: string}]

///---------------------axios calls -----------------------------

    const currentComponents = async () => {
        try{
            const response = await $axios.get("/component_types");
            const values = response.data.result;
            setComponents(values);
    
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    };

    useEffect(()=> {
        currentComponents();
    }, [])
    
    const currentMachines = async () => {
        try{
            const response = await $axios.get('machine_types');
            const types = response.data.result;
            setMachines(types);
            
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    };

    useEffect(() => {
        renderAllMachines();
    }, [machines])

    // useEffect(() => {
    //     renderAllComponents();
    // }, [components])

    useEffect(()=>{
        currentMachines();
    }, [])


    const createNewComponentType = async (newComponent) => {
        try {
        const result = await $axios.post("/component_types", {
            type_name: newComponent});
         } 
         catch(e){
            console.error(e);
            alert(e);
            }
        };

    const createNewMachineType = async (newMachineType) => {
        try {
        const result = await $axios.post("/machine_types", {
            type_name: newMachineType});
            } 
         catch(e) {
            console.error(e);
            alert(e);
            }
        };

        console.log(componentTypes)
    //add components to a machine type
    const addComponentToMachine = async (componentIndex) =>{
        const id = machines.find(el => el.type_name === editingMachineType).id
        try{
            const toUpdate = await $axios.patch(`machine_types/${id}`, 
            {id, component_type_ids: componentIndex});
            console.log(toUpdate)
        }
        catch(e){
            console.error(e);
            alert(e);
        };
    }

    ///------------------start of the page------------------------------
    const newMachineForm = useForm({
        initialValues:{
            newMachineType: '',
        },
        validate: {
            newMachineType: value => {
                const existingMachineTypes = machineTypes.map(el => el.label);
                if (value.length <= 0) {
                    return 'Machine Type is required';
                }
                if (existingMachineTypes.includes(value)) {
                    return 'This machine type already exists';
                }
                return null;
            }
        }
    })

    const newComponentForm = useForm({
        initialValues:{
            newComponentType: ''
        },
        validate: {
            newComponentType: value => {
                const existingComponentTypes = componentTypes.map(el => el.label);
                if (value.length <= 0) {
                    return 'Component Type is required';
                }
                if (existingComponentTypes.includes(value)) {
                    return 'This component type already exists';
                }
                return null;
            }
        }
    })

    console.log({components})



    const submitNewMachineType = async () => {
        const validation = newMachineForm.validate();
        if (validation.hasErrors) {
            return;
        }
        const { newMachineType } = newMachineForm.values;
        await createNewMachineType(newMachineType);
        newMachineForm.reset();
        currentMachines();
    }
    const submitNewComponentType = async() => {
        const validation = newComponentForm.validate();
        if (validation.hasErrors) {
            return;
        }
        // componentTypesHandlers.append({
        //     label: newComponentForm.values.newComponentType
        // })
        
        await createNewComponentType(newComponentForm.values.newComponentType);
        newComponentForm.reset();
        currentComponents();
    }

    const editMachineType = (machineType) => {
        setEditingMachineType(machineType);
        setEditDrawerOpened(true);
    }

    const AddComponentButton = ({ machineType }) => {
        return (
            <Tooltip
                label="Add Components"
                withArrow
            >
                <ActionIcon
                    component="div"
                    variant="outline"
                    color="blue"
                    size={22}
                    onClick={() => editMachineType(machineType)}
                >
                    <Plus/>
                </ActionIcon>
            </Tooltip>
        )
    }

    const renderAllMachines = async() => {
        const transformedMachineTypes = machines.map(el => {
            return {
                label: el.type_name,
                rightElementIfEmpty: <AddComponentButton machineType={el.type_name}/>,
                footer: <Button className="edit" fullWidth mt="sm" onClick={() => editMachineType(el.type_name)}>Edit Components</Button>
            }
        })
        machineTypesHandlers.setState(transformedMachineTypes);
    }


    // const renderAllComponents = async() => {
    //     const transformedComponentTypes = components.map(el => {
    //         return {
    //                 label: el.type_name
    //         }
    //     })
    //     componentTypesHandlers.setState(transformedComponentTypes);
    // }

    const classFunc = ()=> {
        if (item.label === "Machine Type 1"){
         return 'machine-type-1';
        }
        return;
    }

    const machineTypesItems = machineTypes.map((item, i) => <ContentGroup key={i} {...item} />)
    const componentTypesItems = componentTypes.map((item, i) => <ContentGroup className={classFunc} key={i} {...item} />)
    const toggleComponentType = (event, machineType, componentType) => {
        const checked = event.currentTarget.checked;
        
        const machineTypeIndex = machineTypes.findIndex(el => el.label === machineType);
        const machineTypeData = {...machineTypes[machineTypeIndex]};
        let machineTypeComponents = machineTypeData.items ? [...machineTypeData.items] : [];
        if (checked === !!machineTypeComponents.find(el => el.label === componentType)) {
            // just to make sure we are not in a situation of UNCHECKING BUT it was already not selected
            // or checking but it was already selected
            return;
        }

        if (checked) {
            machineTypeComponents.push({label: componentType});
        } else {
            machineTypeComponents = machineTypeComponents.filter(el => el.label !== componentType);
        }
        machineTypesHandlers.setItemProp(machineTypeIndex, 'items', machineTypeComponents);

        // retrieving index of required components
        const selectedComponents = machineTypeComponents.map(pluck('label'));
        let componentIndex = []
         selectedComponents.forEach(componentName => {
            const id = components.find(el => el.type_name === componentName).id;
            componentIndex.push(id);
        });

        addComponentToMachine(componentIndex);
        
        
    }

    return (
        <div className='errors'>
            <Group position="center" align="flex-start" spacing={50}>
                <div style={{width: .4*window.innerWidth}}>
                    <Group align="center" spacing={0} mb="md">
                        <Box size={20}/>
                        <Title order={5} ml="xs">
                            Machine Types
                        </Title>
                    </Group>
                    <TextInput
                        placeholder="Machine Type Name"
                        label="New Machine Type"
                        required
                        sx={{flexGrow: 1}}
                        {...newMachineForm.getInputProps('newMachineType')}
                        onKeyUp={(e) => {if (e.key === 'Enter') submitNewMachineType()}}
                        rightSection={
                            <ActionIcon className='add-machine-btn' onClick={submitNewMachineType}><Plus/></ActionIcon>
                        }
                        mb="md"
                    />
                    <ScrollArea className="machine-list" offsetScrollbars type="hover" style={{height: .65*window.innerHeight}}>
                        {machineTypesItems}
                    </ScrollArea>
                </div>
                <div style={{width: .4*window.innerWidth}}>
                    <Group align="center" spacing={0} mb="md">
                        <Components size={20}/>
                        <Title order={5} ml="xs">
                            Component Types
                        </Title>
                    </Group>
                    <TextInput
                        placeholder="Component Type Name"
                        label="New Component Type"
                        required
                        sx={{flexGrow: 1}}
                        {...newComponentForm.getInputProps('newComponentType')}
                        onKeyUp={(e) => {if (e.key === 'Enter') submitNewComponentType()}}
                        rightSection={
                            <ActionIcon className='add-component-btn' onClick={submitNewComponentType}><Plus/></ActionIcon>
                        }
                        mb="md"
                    />
                    <ScrollArea className="component-list" offsetScrollbars type="hover" style={{height: .65*window.innerHeight}}>
                        {componentTypesItems}
                    </ScrollArea>
                </div>
            </Group>
            <Drawer
                opened={editDrawerOpened}
                onClose={() => setEditDrawerOpened(false)}
                title={`Edit Machine Type: ${editingMachineType}`}
                position="right"
                size="xl"
                closeOnEscape={false}
                closeOnClickOutside={false}
                padding="lg"
            >
                <Text weight={500} mb="md">Choose component types</Text>
                <ScrollArea offsetScrollbars type="hover" style={{height: .5*window.innerHeight}}>
                    {componentTypes.map((el, i) => (
                        <Checkbox
                            checked={
                                !!machineTypes.find(machine => machine.label === editingMachineType)?.items?.find(component => component.label === el.label)
                            }
                            label={el.label}
                            key={i}
                            mb="sm"
                            onChange={event => toggleComponentType(event, editingMachineType, el.label)}
                        />
                    ))}
                </ScrollArea>
            </Drawer>
        </div>
    )
}