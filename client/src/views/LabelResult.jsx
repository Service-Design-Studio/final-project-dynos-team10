import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { selectWorkorderComponents, updateCurrentComponentName } from "../store/workorder/workorderSlice";
import { 
    Button,
    Center,
    Grid,
    Image,
    Loader,
    Paper,
    Text,
    useMantineTheme,
    Modal,
    List
} from "@mantine/core";
import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import ReportFailReasons from "../components/ReportFailReasons";
import { useListState } from "@mantine/hooks";
import { $aiAxios } from '../helpers/axiosHelper';

/**
 * This page is for ANY labelling result that has been returned from the AI service
 * Users can dispute or choose a new photo
 */
export default function LabelResult() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const workorderComponents = useSelector(selectWorkorderComponents);
    const [hasChosenPhoto, setHasChosenPhoto] = useState(false);
    const chosenLabelPhoto = useMemo(() => {
        const chosenIndex = searchParams.get('chosenLabelPhotoIndex');
        if (chosenIndex !== null) {
            setHasChosenPhoto(true);
            return workorderComponents.label.images[chosenIndex].src || null;
        }
        setHasChosenPhoto(false);
        return null;
    }, [searchParams])

    const [gettingResults, setGettingResults] = useState(false);
    const [noLabel, setNoLabel] = useState(false);
    const OutcomeIcon = ({height}) => {
        return noLabel ? 
            <HighlightOff style={{fontSize: height, color: theme.colors.red[6]}} /> :
            <CheckCircleOutline style={{fontSize: height, color: theme.colors.teal[6]}} />
    }

    const [reasons, reasonsHandler] = useListState([]);

    useEffect(() => {
        (async() => {
            if (chosenLabelPhoto !== null) {
                setGettingResults(true);
                // call API here
                setTimeout(() => {
                    setGettingResults(false);
                    setNoLabel(true);
                }, 1500)
    
                let response;
                try {
                    response = await $aiAxios.post('prediction', {
                        image: chosenLabelPhoto
                    })
                    console.log({response});
                } catch (e) {
                    console.error(e);
                }
            }
        })()
    }, [chosenLabelPhoto])

    // ---- dispute modal ----
    const [disputeModalOpened, setDisputeModalOpened] = useState(false);
    const DisputeModal = () => {
        const proceedWithDispute = () => {
            console.log('Disputing...');
        }

        return (
            <Modal
                opened={disputeModalOpened}
                onClose={() => setDisputeModalOpened(false)}
                title="Dispute Result"
                centered
            >
                <Text weight={500}>Why are you seeing this?</Text>
                <List my="md">
                    <List.Item>
                        <Text component="span">
                            Our algorithm has detected that there was
                            <Text component="span" weight={500}> no label detected </Text>
                            in the photo you selected.
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text component="span">
                            If you believe that your photo has a label in it and our algorithm was incorrect, please click the "Confirm Dispute" button below, and we will send your image for further analysis.
                        </Text>
                    </List.Item>
                </List>
                
                <Button color="red" onClick={proceedWithDispute}>Confirm Dispute</Button>
            </Modal>
        )
    }

    const goBackLabelPhotoReview = () => {
        dispatch(updateCurrentComponentName('label'));
        navigate('/photo-review');
    }

    return (
        !hasChosenPhoto ?
        <Center style={{ height: 500, flexDirection: 'column' }}>
            <Text weight={500}>No photo for label chosen</Text>
            <Button mt="md" onClick={goBackLabelPhotoReview}>Choose label photo</Button>
        </Center> :
        <>
            <Paper shadow="sm" p="md" m="sm" style={{minHeight: .7*window.innerHeight}}>
                <Image radius="sm" src={chosenLabelPhoto} mb="md" />
                {
                    gettingResults &&
                    <Center style={{ height: 200, flexDirection: 'column' }}>
                        <Loader size="lg"/>
                        <Text weight={500} mt="xs">Analysing</Text>
                    </Center>
                }
                {
                    !gettingResults && noLabel &&
                    <Grid>
                        <Grid.Col span={4} style={{ minHeight: 200 }}>
                            <OutcomeIcon height={100} />
                            {/* Dispute should only be shown when the failing reason is because it is absent, and not just for all fail cases */}
                            <Button
                                fullWidth
                                mt="sm"
                                color="red"
                                onClick={() => setDisputeModalOpened(true)}
                            >
                                Dispute
                            </Button>
                            <Button
                                fullWidth
                                mt="sm"
                                variant="outline"
                                styles={{
                                    root: {
                                        height: 'auto',
                                        padding: '6px'
                                    },
                                    label: {
                                        whiteSpace: 'normal'
                                    }
                                }}
                                onClick={goBackLabelPhotoReview}
                            >
                                Choose Another Photo
                            </Button>  
                        </Grid.Col>
                        <Grid.Col span={8} style={{ minHeight: 200 }}>
                            <ReportFailReasons
                                editReport={true}
                                reasons={reasons}
                                setReasons={reasonsHandler}
                                scrollHeight={150}
                            />
                        </Grid.Col>
                        <Button mt="md" fullWidth>Submit</Button>
                    </Grid>
                }
            </Paper>
            <DisputeModal />
        </>
    )
}