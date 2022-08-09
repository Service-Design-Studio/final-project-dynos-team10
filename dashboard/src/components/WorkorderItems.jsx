import { useNavigate } from "react-router-dom";
import { ContentGroup } from "./CollapsableContentItem";
import { Group, Button, Text } from "@mantine/core";

const WORKORDER_DETAILS_BTN_CLASS = 'view-workorder-btn';

function WorkorderItemBuilder(item, i, theme) {
    return (
        <Group
            position="apart"
            align="center"
            key={i}
            sx={{
                fontWeight: 700,
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
            }}
        >
            <Text
                key={item.label}
            >
                {item.label}
            </Text>
            <Button
                className={WORKORDER_DETAILS_BTN_CLASS}
                data-workorder-id={item.workorder_id}
            >
                View Details
            </Button>
        </Group>
    )
}

export default function WorkorderItems({chartSize, items=[]}) {
    const navigate = useNavigate();

    const handleClick = e => {
        const el = e.target.closest(`.${WORKORDER_DETAILS_BTN_CLASS}`);
        if (el) {
            let { workorderId } = el.dataset;
            workorderId = parseInt(workorderId, 10);
            if (workorderId) navigate(`/workorders/${workorderId}`);
        }
    }

    return (
        <div style={{ flexGrow: 1, width: chartSize}} onClick={handleClick}>
            {items.map((item, i) => (
                <ContentGroup
                    key={i}
                    {...item}
                    customItemElBuilder={WorkorderItemBuilder}
                />
            ))}
        </div>
    )
}