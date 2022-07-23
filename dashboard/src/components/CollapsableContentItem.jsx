import { Box, createStyles, Text, UnstyledButton, Collapse, Group } from "@mantine/core";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

const useStyles = createStyles(theme => ({
    control: {
        fontWeight: 500,
        display: 'block',
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        fontSize: theme.fontSizes.sm,
    
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    item: {
        fontWeight: 500,
        display: 'block',
        textDecoration: 'none',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        paddingLeft: 31,
        marginLeft: 30,
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        borderLeft: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    chevron: {
        transition: 'transform 200ms ease',
    }
}))

export function ContentGroup({ label, items, footer, rightElementIfEmpty }) {
    const { classes, theme } = useStyles();
    const hasItems = Array.isArray(items) && items.length > 0;
    const [opened, setOpened] = useState(false);
    const ChevronIcon = theme.dir === 'ltr' ? ChevronRight : ChevronLeft;

    const itemsEl = (hasItems ? items : []).map((item) => (
        <Text
          className={classes.item}
          key={item.label}
        >
            {item.label}
        </Text>
    ));

    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group position="apart" spacing={0}>
                    <Box>{label}</Box>
                    {
                        hasItems ?
                        <ChevronIcon 
                            className={classes.chevron}
                            size={14}
                            style={{
                                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                            }}
                        /> :
                        rightElementIfEmpty
                    }
                </Group>
            </UnstyledButton>
            {
                hasItems ?
                <Collapse in={opened}>
                    <>
                        {itemsEl}
                        {footer}
                    </>
                </Collapse> :
                null
            }
        </>
    )
}


export function CollapsableContentItem() {
    <Box
        sx={theme => ({
            minHeight: 220,
            padding: theme.spacing.md,
            backgroundColor: theme.white
        })}
    >
        <ContentGroup />
    </Box>
}