import { Navbar, Tooltip, UnstyledButton, createStyles, Group, Center } from '@mantine/core';
import {
    Home2,
    DeviceDesktopAnalytics,
    User,
    Adjustments,
    Logout,
    ListSearch
} from 'tabler-icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';
import { useEffect, useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import CableConsumerCotext, { consumer } from './helpers/ActionCable';

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.white,
        opacity: 0.85,

        '&:hover': {
            opacity: 1,
            backgroundColor: theme.colors[theme.primaryColor][5],
        },
    },

    active: {
        opacity: 1,
        '&, &:hover': {
            backgroundColor: theme.colors[theme.primaryColor][7],
        },
    }
}));



function NavbarLink({ icon: Icon, label, active, onClick }) {
    const { classes, cx } = useStyles();

    return (
        <Tooltip label={label} position="right" withArrow transitionDuration={0}>
            <UnstyledButton onClick={onClick} 
            className={cx(classes.link, { [classes.active]: active })}>
                <Icon />
            </UnstyledButton>
        </Tooltip>
    );
}

const useNavbarStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colors[theme.primaryColor][6],
    },
}));

const routeMapStatic = {
    '/': { icon: Home2, label: 'Home' },
    '/analytics': { icon: DeviceDesktopAnalytics, label: 'Analytics' },
    '/workorders': { icon: ListSearch, label: 'View Work Orders' },
    '/controls': { icon: Adjustments, label: 'System Controls' },
    '/account': { icon: User, label: 'Account' },
}

export default function Layout() {
    const { classes } = useNavbarStyles();
    const navigate = useNavigate();
    const location = useLocation();

    const tryNavigate = (route) => {
        if (location.pathname !== route) {
            navigate(route);
        }
    }

    const links = useMemo(() => {
        const allLinks = [];
        for (const [route, routeData] of Object.entries(routeMapStatic)) {
            if (location.pathname === '/' || route === '/') {
                allLinks.push(
                    <NavbarLink
                        {...routeData}
                        key={routeData.label}
                        active={location.pathname === route}
                        onClick={() => tryNavigate(route)}
                    />
                )
            } else {
                allLinks.push(
                    <NavbarLink
                        {...routeData}
                        key={routeData.label}
                        active={location.pathname.startsWith(route)}
                        onClick={() => tryNavigate(route)}
                    />
                )
            }
        }
        return allLinks;
    }, [location])
    

    return (
        <Group align="flex-start">
            <Navbar width={{ base: 80 }} p="md" className={classes.navbar}>
                <Navbar.Section grow mt={50}>
                    <Group direction="column" align="center" spacing={0}>
                        {links}
                    </Group>
                </Navbar.Section>
                <Navbar.Section>
                    <Group direction="column" align="center" spacing={0}>
                        <NavbarLink icon={Logout} label="Logout" />
                    </Group>
                </Navbar.Section>
            </Navbar>
            <div style={{padding: '1rem', flexGrow: 1}}>
                <MantineProvider withNormalizeCSS withGlobalStyles>
                    <NotificationsProvider>
                        <CableConsumerCotext.Provider value={consumer}>
                            <Outlet />
                        </CableConsumerCotext.Provider>
                    </NotificationsProvider>
                </MantineProvider>
            </div>
        </Group>
    )
}