import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { 
    selectWorkorderComponents, 
    updateCurrentComponentName, 
    selectWorkorderNumber, 
    selectCurrentComponent, 
    selectCurrentComponentName 
} from "../store/workorder/workorderSlice";
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
import { $axios } from '../helpers/axiosHelper';
import { $aiAxios } from '../helpers/axiosHelper';
import { buildComponentObjWithImages } from "../helpers/componentsHelper";
import { cloneDeep } from "lodash";
import { deepCompare } from "../helpers/objectHelper";

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
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);
    const currentComponent = useSelector(selectCurrentComponent);
    const currentComponentName = useSelector(selectCurrentComponentName);
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

    const [gettingResults, setGettingResults] = useState(true);
    const [noLabel, setNoLabel] = useState(true); // if noLabel == true => label status is fail / red 
    const [submitModal, setSubmitModal] = useState(false);
    const OutcomeIcon = ({height}) => {
        return noLabel ? 
            <HighlightOff style={{fontSize: height, color: theme.colors.red[6]}} /> :
            <CheckCircleOutline style={{fontSize: height, color: theme.colors.teal[6]}} />
    }

    const [reasons, reasonsHandler] = useListState([]);
    const [ disputeModalOpened, setDisputeModalOpened ] = useState(false);

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

    const findWorkorderRecord = async() => {
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            console.log({response});
            return response.result.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
            return null;
        }
    }

    const createNewComponent = async(workorderId) => {
        const payload = {
            workorder_id: workorderId,
            component_type_id: currentComponent.componentTypeId,
        }
        if (!noLabel) {
            payload.status = true;
        } else {
            payload.failing_reasons = reasons;
        }

        let response;
        try {
            response = await $axios.post('components', payload);
            if (!response.data.success) {
                return;
            }
            console.log({response});
            const { id: component_id } = response.data.result;
            response = await $axios.post('images/batch', {
                component_id,
                images: currentComponent.images.map(el => el.src)
            })
            console.log({response});
            submitLabelResult(response);
        } catch (e) {
            console.error(e);
        }
    }

    const updateImages = async(componentId, oldImages, updatedImages) => {
        // Note: images can only be added or deleted, they cannot be edited
        console.log({componentId, oldImages, updatedImages});
        const newImages = updatedImages.filter(el => el.id === null); 
        const deletedImages = oldImages.filter(old => {
            return !updatedImages.find(newEl => newEl.id === old.id);
        })
        console.log({newImages, deletedImages});

        // await these??

        // 1) find the new images to add
        await $axios.post('images/batch', {
            component_id: componentId,
            images: newImages.map(el => el.src)
        })

        // 2) find images that are missing from the old images and delete them
        const deleteQueryParams = new URLSearchParams({
            ids: deletedImages.map(el => el.id)
        })
        await $axios.delete(`images/batch?${deleteQueryParams.toString()}`);
    }

    const updateComponentRecord = async() => {
        // get workorder id
        const workorderId = await findWorkorderRecord();
        if (!workorderId) {
            return;
        }

        // POST request, new component
        if (currentComponent.id === null) {
            console.log('We are working with a new component');
            createNewComponent(workorderId);
            return;
        }

        // here we deal with EDITING/patch requests
        let response = await $axios.get(`components/${currentComponent.id}`);
        const dbComponent = response.data.result;
        response = await $axios.get(`components/${currentComponent.id}/images`);
        const dbImages = response.data.result;
        const dbComponentWithImages = buildComponentObjWithImages(dbComponent, dbImages);
        // Issue 1 (SOLVED): component status only updated after successful upload, so this compare will not detect status changes (yet)
        // Issue 2 (SOLVED): component status changes to yellow when using camera, if got use camera to add photos, then this will detect status change (to yellow), which is not submittable
        // to solve these 2 issues, we do a deep clone of the currentComponent object, and set the status to the current state.chosenStatus (from routing)
        const currentComponentChanges = cloneDeep(currentComponent);
        console.log(currentComponentChanges.status)
        if (noLabel) { currentComponentChanges.status = 'red'; }
        if (!noLabel) { currentComponentChanges.status = 'green'; }
        console.log(currentComponentChanges.status)

        // Issue 3 (OVERLOOKED): figure out why "differences" is weird when we delete images, check the images array
        // IS THIS OKAY TO OVERLOOK? BECAUSE our updateImages array does not take the weird missing values from "differences",
        // but from the sources of truth that is "dbComponentWithImages" and "currentComponentChanges"
        // we merely use "differences" to detect changes?
        const differences = deepCompare(dbComponentWithImages, currentComponentChanges);
        console.log({differences, dbComponentWithImages, currentComponentChanges});

        // if (Object.keys(differences).length === 0) {
        //     // no differences to be updated found, tell user?
        //     console.log('no differences/changes to be committed');
        //     return;
        // }

        if (differences.images) {
            // await this?
            updateImages(currentComponentChanges.id, dbComponentWithImages.images, currentComponentChanges.images);
        }

        const payload = {
            component_id: currentComponentChanges.id
        }
        if (differences.status) {
            payload.status = currentComponentChanges.status === 'green';
        }
        // if (differences.failingReasons) {
        //     payload.failing_reasons = payload.status ? [] : currentComponentChanges.failingReasons;
        // }
        console.log({payload});

        const finalUpdateResponse = await $axios.patch(`components/${currentComponentChanges.id}`, payload);
        console.log({finalUpdateResponse});

        submitLabelResult();
    }

    const submitLabelResult = () => {
        setSubmitModal(true);
        // proceedWithDispute();
        // send to status to database
        updateComponentRecord();

    }
    

    // ---- dispute modal ----
    const [ disputeSent, setDisputeSent ] = useState(false);
    const DisputeModal = () => {
        const proceedWithDispute = () => {
            setDisputeModalOpened(false);
            setDisputeSent(true);
            setNoLabel(false);
            console.log('Disputing...');
            setGettingResults(true);
            // call API here
            setTimeout(() => {
                setGettingResults(false);
                // setSubmitModal(true);
            }, 1500)
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
                    !gettingResults && hasChosenPhoto && !disputeSent &&
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
                        <Button onClick={submitLabelResult} mt="md" fullWidth>Submit</Button>
                    </Grid>
                }
                {
                    disputeSent && !noLabel && !gettingResults &&
                    <>
                    <Center><OutcomeIcon height={100} /></Center>
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
                            <Button onClick={submitLabelResult} mt="md" fullWidth>Submit</Button>
                    </>
                    
                }

            </Paper>

            <DisputeModal />

            <Modal
                opened={submitModal}
                onClose={() => setSubmitModal(false)}
                title="Upload Successful"
                centered
            />
        </>
    )
}