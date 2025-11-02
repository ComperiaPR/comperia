import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Building, LayoutGrid, UserCog  } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['admin', 'super_user', 'client'],
    },
    {
        title: 'Propiedades',
        href: '/properties',
        icon: Building,
        roles: ['admin', 'super_user', 'editor', 'client'],
    },
    {
        title: 'Maps',
        href: '/maps/preview',
        icon: Building,
        roles: ['admin', 'super_user', 'client'],
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: UserCog,
        roles: ['admin', 'super_user'],
    },
];

export function AppSidebar() {

    const { props: { auth } } = usePage<SharedData>();
    // Type assertion to specify the shape of auth.user
    const user = auth.user as unknown as { roles: { name: string }[] };

    const mainNavItemsFilter = mainNavItems.filter((item) => item.roles.includes(user.roles[0].name));

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
