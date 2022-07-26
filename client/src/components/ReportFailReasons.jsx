import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { useListState, randomId } from '@mantine/hooks';
import { updateCurrentComponentName, selectWorkorderComponents } from '../store/workorder/workorderSlice';

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


function ReportFailReasons({editReport, reasons, setReasons, style, scrollHeight}) {
    const theme = useMantineTheme();
    const [value, setValue] = useState('');
    // selectedReasons = reasons;
    const allReasons = [
        'Crumpled', 
        'Torn', 
        'Slanted', 
        'Wrong Position', 
        'Wrong Text', 
        'Markings', 
        'Others'
    ];

    // notSelectedReasons: reasons in the dropdown list 
    // notSelectedReasons array = allReasons array - reasons array
    // let difference = arr1.filter(x => !arr2.includes(x));

    // useMemo - derived state that depends on other states (something liddat)
    const notSelectedReasons = useMemo(() => {
        return allReasons.filter(x => !reasons.includes(x));
    }, [allReasons, reasons])

  // add one or more items to the end of the list
    const selectReason = (value) => {
        {setValue(value)}
        if (!reasons.includes(value) && value!==null){
            setReasons.append(value); // setReasons is in StatusReport.jsx 
        }
    }

    // remove items at given positions
    const remove = (index) => setReasons.remove(index);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const workorderComponents = useSelector(selectWorkorderComponents);

    const listItems = reasons.map((reason, index)=> 
        
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
                {reason}
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
        
    );
    

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
                        data={notSelectedReasons}
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