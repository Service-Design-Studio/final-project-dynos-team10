import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { updateCurrentComponentName, selectWorkorderComponents } from '../store/workorder/workorderSlice';

import ClearIcon from '@mui/icons-material/Clear';
import {
    useMantineTheme,
    Button,
    Paper,
    Text, 
    ScrollArea,
    Select,
    NativeSelect
} from "@mantine/core"
import { useListState } from '@mantine/hooks';

function ReportFailReasons({editReport, reasons, setReasons}) {
    const theme = useMantineTheme();
    const [value, setValue] = useState('');

    // const [reasons, setReasons] = useListState(failingReasons);
    
      // add one or more items to the end of the list
    const append = (reason) => {
        if (!reasons.includes(reason)){
            setReasons.append(reason);
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

        <Paper shadow="sm" p="xs" withBorder>

            <div 
                style={{
                    display: "flex", 
                    justifyContent:"space-between", 
                    alignItems:"center"}}>
                <Text color="red" weight="Bold" style={{marginLeft: "0.5rem", marginBottom: "0.5rem"}}>Fail Reason(s)</Text>
            </div>

            {
                editReport && 
                    <NativeSelect
                        value={value}
                        onChange={(event) => append(event.currentTarget.value)}
                        // label="Add Reasons"
                        placeholder="Add Reasons"
                        searchable
                        nothingFound="No options"
                        data={['crumbled', 'torn', 'slanted', 'wrong position', 'wrong text', 'markings']}
                        maxdropdownheight={160}
                        style={{margin: "0.2rem", marginTop: 0, marginBottom: "0.4rem"}}
                    />
            }

            
            <ScrollArea 
                style={{
                    height: 120,
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