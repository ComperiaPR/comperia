import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Building, History, Info, LayoutGrid, List, Map, MessageSquare, Search, UserCog, UserSearch  } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['admin', 'super_user', 'client'],
        _open: false,
    },
    {
        title: 'Map Search',
        href: '/map/preview',
        icon: Map,
        roles: ['admin', 'super_user', 'client'],
        _open: false,
    },
    {
        title: 'Basic Search',
        href: '/properties/basic-search',
        icon: Search,
        roles: ['admin', 'super_user', 'client'],
        _open: false,
    },
    {
        title: 'List Search',
        href: '/properties/view/list',
        icon: List,
        roles: ['admin', 'super_user', 'client'],
        _open: false,
    },
    {
        title: 'About Us',
        href: '/about',
        icon: Info,
        roles: ['admin', 'super_user', 'client'],
        _open: false,
    },
    {
        title: 'Admin',
        href: '',
        icon: UserCog,
        _open: false,
        roles: ['admin', 'super_user'],
        submenu: [
            {
                title: 'Users',
                href: '/users',
                icon: UserSearch,
                _open: false,
                roles: ['admin', 'super_user'],
            },
            {
                title: 'Property',
                href: '/properties',
                icon: Building,
                roles: ['admin', 'super_user', 'editor'],
                _open: false,
            },
            {
                title: 'Contact',
                href: '/contacts',
                icon: MessageSquare,
                roles: ['admin', 'super_user'],
                _open: false,
            },
            {
                title: 'Auth Logs',
                href: '/auth-logs',
                icon: History,
                roles: ['admin', 'super_user'],
                _open: false,
            },
        ],
    },
];

export function AppSidebar() {

    const { props: { auth } } = usePage<SharedData>();
    // Type assertion to specify the shape of auth.user
    const user = auth.user as unknown as { roles?: { name: string }[] };
    const userRoleNames = (user.roles ?? []).map((role) => role.name);

    const mainNavItemsFilter = mainNavItems.filter((item) => item.roles.some((role) => userRoleNames.includes(role)));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItemsFilter} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
