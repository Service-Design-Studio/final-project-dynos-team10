import { Carousel } from '@mantine/carousel';
import { Card, Image, Text, Group, Badge, Button, createStyles, Paper, ScrollArea, Modal, Center } from '@mantine/core';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        width: '300px'
    },
    section: {
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },
}));

function FailingReasonText({content}) {
    return (
        <Paper shadow="xs" p="sm" mt="xs">
            <Text size="sm" style={{overflowWrap: 'break-word'}}>{content}</Text>
        </Paper>
    )
}

export default function ComponentCard({componentRecord}) {
    const { classes, theme } = useStyles();
    console.log(componentRecord);
    const { componentType, failingReasons, images, status: isCompleted } = componentRecord;
    const [opened, setOpened] = useState(false);

    return (
        <div>
            <Card withBorder radius="md" p="sm" className={classes.card}>
                <Card.Section>
                    <Center>
                        <Image
                            src={images[0]?.public_url}
                            alt="Image" 
                            width={300}
                            height={200}
                        />
                    </Center>
                </Card.Section>
                <Card.Section className={classes.section} p="sm">
                    <Group position="apart">
                        <Text size="lg" weight={500}>{componentType.charAt(0).toUpperCase() + componentType.slice(1)}</Text>
                        <Badge size="sm" color={isCompleted ? "teal" : "red"}>
                            <span id={"status-" + componentType} >{isCompleted ? "Passed" : "Failed"}</span>
                        </Badge>
                    </Group>
                </Card.Section>
                {
                    !isCompleted &&
                    <Card.Section className={classes.section} mt="md">
                        <Text size="sm" color="gray">Failing Reasons</Text>
                        <ScrollArea
                            style={{height: 130}}
                            offsetScrollbars
                        >
                            {failingReasons.map((el, i) => <FailingReasonText key={i} content={el.reason} />)}
                        </ScrollArea>
                    </Card.Section>
                }
                <Button className={"single-workorder-" + componentType} radius="sm" mt="xs" fullWidth onClick={()=>setOpened(true)}>
                    View Images
                </Button>
            </Card>

            <Modal
            opened={opened}
            onClose={()=>setOpened(false)}
            title={componentType.charAt(0).toUpperCase() + componentType.slice(1) + " Images"}
            >
                <Carousel
                    withIndicators
                    id={`${componentType}-images`}
                >
                    {images.map((el,i) => 
                        <Carousel.Slide key={i}>
                            <Center>
                                <Image
                                    src={el.public_url}
                                    alt="Image"
                                    width={300}
                                    height={300}
                                />
                            </Center>
                        </Carousel.Slide>
                    )}
                </Carousel>
            </Modal>
        </div>
    )
}