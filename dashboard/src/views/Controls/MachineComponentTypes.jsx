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
import { Box, Components, Plus, X } from 'tabler-icons-react';
import { ContentGroup } from '../../components/CollapsableContentItem';
import { $axios } from '../../helpers/axiosHelper';


export default function MachineComponentTypes() {
    const [editDrawerOpened, setEditDrawerOpened] = useState(false);
    const [editingMachineType, setEditingMachineType] = useState('');
    const [components, setComponents] = useState([]);
    const [machines, setMachines] = useState([]);
    const [failingReasons, setFailingReasons] = useState([]);

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

    const currentFailingReasons = async () => {
        try{
            const response = await $axios.get('failing_reasons_types');
            const types = response.data.result;
            console.log(types)
            setFailingReasons(types);
        }
        catch(e){
            console.error(e);
            alert(e);
        }
    };
    

    useEffect(()=>{
        currentMachines();
        currentComponents();
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

    const createNewFailingReason = async (newFailingReason) => {
        
    }

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
    };

    const deleteMachine = async (machineType) => {
        const id = machines.find(el => el.type_name === machineType).id
        try{
            const remove = await $axios.delete(`machine_types/${id}`)
            currentMachines();
        }
        catch(e) {
            console.log(e);
            alert(e);
        }
    };

    const deleteComponent = async(componentType) => {
        const id = components.find(el => el.type_name === componentType).id
        try{
            const remove = await $axios.delete(`component_types/${id}`)
            console.log(remove);
            currentComponents();
            currentMachines();
        }
        catch(e) {
            console.log(e);
            alert(e);
        }
    };

    ///------------------mapping data from axios to UI functions------------------------------
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

    const DeleteMachine =({ machineType}) => {
        return (
            <Tooltip
            label="Delete Machine"
            withArrow
            >
                <ActionIcon
                component="div"
                color="red"
                size={22}
                onClick={() => deleteMachine(machineType)}
                >
                    <X/>
                </ActionIcon>
            </Tooltip>
            )
    }

    const DeleteComponent =({ componentType }) => {
        return (
            <Tooltip
            label="Delete Component"
            withArrow
            >
                <ActionIcon
                component="div"
                color="red"
                size={22}
                onClick={() => deleteComponent(componentType)}
                >
                    <X/>
                </ActionIcon>
            </Tooltip>
            )
    }

    const mapComponents = () => {
        const listToChange = []
        components.map(el => 
            listToChange.push({
                label: el.type_name,
                deleteElement: <DeleteComponent componentType={el.type_name}/>
            })
        )
        return listToChange
    };
  
    let componentTypes = useMemo(() => mapComponents(), [components])

      const mapMachines = () => {
        const listToChange=[]
        // if (machines===[]){
        //     return [];
        // }
        machines.map(el => {
            const itemList = []
            el.component_types.map(c => 
                itemList.push({
                    label: c.type_name
                })
            );

            listToChange.push({
                label: el.type_name,
                rightElementIfEmpty: <AddComponentButton machineType={el.type_name}/>,
                footer: <Button className="edit" fullWidth mt="sm" onClick={() => editMachineType(el.type_name)}>Edit Components</Button>,
                items: itemList,
                deleteElement: <DeleteMachine machineType={el.type_name}/>
            })
        });
        return listToChange;
    }

    let machineTypes = useMemo(() => mapMachines(), [machines])

    ///------------------------start of the actual page--------------------------
    
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
    const newFailingReasonForm = useForm({
        initialValues:{
            newFaiingReasonType: '',
        },
        validate: {
            newFailingReasonType: value => {
                const existingFailingReasonTypes = failingReasonTypes.map(el => el.label);
                if (value.length <= 0) {
                    return 'Failing reason is required';
                }
                if (existingMachineTypes.includes(value)) {
                    return 'This reason already exists';
                }
                return null;
            }
        }
    })


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
        
        await createNewComponentType(newComponentForm.values.newComponentType);
        newComponentForm.reset();
        currentComponents();
    }

    const submitNewFailingReasonType = async () => {
        const validation = newFailingReasonForm.validate();
        if (validation.hasErrors) {
            return;
        }
        const { newFailingReasonType } = newFailingReasonForm.values;
        await createNewFailingReason(newFailingReasonType);
        newFailingReasonType.reset();
        currentFailingReasons();
    }

    const editMachineType = (machineType) => {
        setEditingMachineType(machineType);
        setEditDrawerOpened(true);
    }

    const machineTypesItems = machineTypes.map((item, i) => <ContentGroup key={i} {...item} />)
    const componentTypesItems = componentTypes.map((item, i) => <ContentGroup key={i} {...item} />)
    const toggleComponentType = async(event, machineType, componentType) => {
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

        // retrieving index of required components
        const selectedComponents = machineTypeComponents.map(pluck('label'));
        let componentIndex = []
         selectedComponents.forEach(componentName => {
            const id = components.find(el => el.type_name === componentName).id;
            componentIndex.push(id);
        });

        await addComponentToMachine(componentIndex);
        currentMachines();
    }

    return (
        <div className='errors'>
            <Group position="center" align="flex-start" spacing={50}>
                <div style={{width: .2*window.innerWidth}}>
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
                <div style={{width: .2*window.innerWidth}}>
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
                <div style={{width: .2*window.innerWidth}}>
                    <Group align="center" spacing={0} mb="md">
                        <Components size={20}/>
                        <Title order={5} ml="xs">
                            Failing Reasons
                        </Title>
                    </Group>
                    <TextInput
                        placeholder="Enter Fail Reasons"
                        label="New Fail Reason"
                        required
                        sx={{flexGrow: 1}}
                        // {...newComponentForm.getInputProps('newComponentType')}
                        // onKeyUp={(e) => {if (e.key === 'Enter') submitNewComponentType()}}
                        // rightSection={
                        //     <ActionIcon className='add-component-btn' onClick={submitNewComponentType}><Plus/></ActionIcon>
                        // }
                        mb="md"
                    />
                    {/* <ScrollArea className="component-list" offsetScrollbars type="hover" style={{height: .65*window.innerHeight}}>
                        {componentTypesItems}
                    </ScrollArea> */}
                </div>
            </Group>

            {/* START OF DRAWERS */}
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