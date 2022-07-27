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
import { useState } from 'react';
import { Box, Components, Plus } from 'tabler-icons-react';
import { ContentGroup } from '../../components/CollapsableContentItem';
import { $axios } from '../../helpers/axiosHelper';


export default function MachineComponentTypes() {
    const [machineTypes, machineTypesHandlers] = useListState([]);
    const [componentTypes, componentTypesHandlers] = useListState([]);
    const [editDrawerOpened, setEditDrawerOpened] = useState(false);
    const [editingMachineType, setEditingMachineType] = useState('');
    
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
    };

    const createNewComponentType = async (newComponent) => {
        try {
        const result = await $axios.post("/component_types", {
            type_name: newComponent});
            console.log({result});
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
            console.log({result});
            } 
         catch(e) {
            console.error(e);
            alert(e);
            }
        }

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
    const submitNewMachineType = () => {
        const validation = newMachineForm.validate();
        if (validation.hasErrors) {
            return;
        }
        const { newMachineType } = newMachineForm.values;
        machineTypesHandlers.append({
            label: newMachineType,
            rightElementIfEmpty: <AddComponentButton machineType={newMachineType}/>,
            footer: <Button fullWidth mt="sm" onClick={() => editMachineType(newMachineType)}>Edit Components</Button>
        })
        createNewMachineType(newMachineType)
        newMachineForm.reset();
    }
    const submitNewComponentType = () => {
        const validation = newComponentForm.validate();
        if (validation.hasErrors) {
            return;
        }
        componentTypesHandlers.append({
            label: newComponentForm.values.newComponentType
        })
        createNewComponentType(newComponentForm.values.newComponentType)
        newComponentForm.reset();
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

    const machineTypesItems = machineTypes.map((item, i) => <ContentGroup key={i} {...item} />)
    const componentTypesItems = componentTypes.map((item, i) => <ContentGroup key={i} {...item} />)

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
    }

    return (
        <>
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
                            <ActionIcon onClick={submitNewMachineType}><Plus/></ActionIcon>
                        }
                        mb="md"
                    />
                    <ScrollArea offsetScrollbars type="hover" style={{height: .65*window.innerHeight}}>
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
                            <ActionIcon onClick={submitNewComponentType}><Plus/></ActionIcon>
                        }
                        mb="md"
                    />
                    <ScrollArea offsetScrollbars type="hover" style={{height: .65*window.innerHeight}}>
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
        </>
    )
}