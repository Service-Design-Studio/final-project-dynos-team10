import { Card, Image, Text, Group, Badge, Button, createStyles, Paper, ScrollArea } from '@mantine/core';

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
    const { componentType, failingReasons, images, status: isCompleted } = componentRecord;

    return (
        <Card withBorder radius="md" p="sm" className={classes.card}>
            <Card.Section>
                <Image src={images[0].public_url} alt="Image" />
            </Card.Section>
            <Card.Section className={classes.section} p="sm">
                <Group position="apart">
                    <Text size="lg" weight={500}>{componentType.charAt(0).toUpperCase() + componentType.slice(1)}</Text>
                    <Badge size="sm" color={isCompleted ? "teal" : "red"}>
                        {isCompleted ? "Passed" : "Failed"}
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
                        {/* {failingReasons.map((el, i) => <FailingReasonText key={i} content={el} />)} */}
                        {['reason1', 'reason 2', 'reason 3', 'reason 4'].map((el, i) => <FailingReasonText key={i} content={el} />)}
                    </ScrollArea>
                </Card.Section>
            }
            <Button radius="sm" mt="xs" fullWidth>
                View Images
            </Button>
        </Card>
    )
}