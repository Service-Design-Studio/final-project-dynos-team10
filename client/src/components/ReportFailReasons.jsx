import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { useListState, randomId } from '@mantine/hooks';
import { updateCurrentComponentName, selectWorkorderComponents } from '../store/workorder/workorderSlice';
import { $axios } from '../helpers/axiosHelper';

import ClearIcon from '@mui/icons-material/Clear';
import {
    useMantineTheme,
    Button,
    Paper,
    Text, 
    ScrollArea,
    Select,
    NativeSelect,
    MultiSelect,
    Checkbox
} from "@mantine/core"


function ReportFailReasons({editReport, reasons, setReasons, style, scrollHeight, componentTypeId}) {
    const theme = useMantineTheme();
    const [value, setValue] = useState('');

    const [allReasons, setAllReasons] = useState([]);
    useEffect(() => {
        (async() => {
            const possibleFailingReasons = (await $axios.get(`component_types/${componentTypeId}/failing_reasons_types`)).data.result;
            setAllReasons(possibleFailingReasons.map(el => ({
                failingReasonTypeId: el.id,
                failingReasonName: el.reason
            })))
        })()
    }, [componentTypeId])
    useEffect(() => {
        console.log({allReasons});
    }, [allReasons])

    // useMemo - derived state that depends on other states (something liddat)
    const notSelectedReasons = useMemo(() => {
        console.log({allReasons, reasons});
        return allReasons.filter(x => !reasons.find(chosenReason => chosenReason.failingReasonTypeId === x.failingReasonTypeId));
    }, [allReasons, reasons])

  // add one or more items to the end of the list
    const selectReason = (value) => {
        // value is ID only
        console.log({value, reasons});
        setValue(value);
        if (!reasons.find(chosenReason => chosenReason.failingReasonTypeId === value) && value !==null) {
            setReasons.append(allReasons.find(reason => reason.failingReasonTypeId === value)); // setReasons is in StatusReport.jsx 
        }
    }

    // remove items at given positions
    const remove = (index) => setReasons.remove(index);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const workorderComponents = useSelector(selectWorkorderComponents);

    const listItems = reasons.map((reason, index)=> {
        console.log({reason, index});
        return (
            <Paper
                shadow="xs"
                withBorder
                style={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginRight: "20%",
                    marginTop: 0, 
                    width: "97%" }}
                key={index}>

                <div style={{ overflowWrap: "break-word"}} >
                    <Text
                        size="sm"
                        style={{padding: 5, 
                                marginLeft: "0.5rem",
                                overflowWrap: "break-word",
                                wordBreak: "break-all"}}>
                        {allReasons.length > 0 && allReasons.find(el => el.failingReasonTypeId === reason.failingReasonTypeId).failingReasonName}
                    </Text>
                </div>

                {
                    editReport && 
                        <ClearIcon 
                            className={`delete-failing-reasons-btn delete-failing-reasons-btn--${index}`}
                            style={{fontSize: 20, color: "black", padding: 7}} 
                            onClick={() => remove(index)}/>
                }

            </Paper>
        )
    });

    return (

        <Paper shadow="sm" p="xs" withBorder style={style}>

            <div 
                style={{
                    display: "flex", 
                    justifyContent:"space-between", 
                    alignItems:"center"}}>
                <Text color="red" weight="Bold" style={{marginLeft: "0.5rem", marginBottom: "0.5rem"}}>Fail Reason(s)</Text>
            </div>

            {
                editReport && 
                    <Select
                        value={value}
                        // onChange={(event) => append(event.currentTarget.value)}
                        onChange={selectReason}
                        // label="Add Reasons"
                        placeholder="Scroll to Add Reasons"
                        searchable
                        clearable 
                        dropdownPosition="top"
                        nothingFound="No options"
                        // edit to return {value, label} 
                        data={notSelectedReasons.map(el => ({label: el.failingReasonName, value: el.failingReasonTypeId}))}
                        maxDropdownHeight = {120} 
                        style={{margin: "0.2rem", marginTop: 0, marginBottom: "0.4rem"}}
                    />

            }
            
            <ScrollArea 
                style={{
                    height: scrollHeight || 120,
                    // margin: "2rem", 
                    // marginTop: "0.1rem", 
                    // marginBottom: "1rem", 
                    padding: 2}}
                    type="scroll"
                    >
                <Text className="reasons-list">{listItems}</Text>
            </ScrollArea>
        </Paper>
        
    )
}

export default ReportFailReasons;