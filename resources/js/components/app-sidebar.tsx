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
        roles: ['admin', 'super_user', 'employer', 'recruiter', 'candidate'],
    },
    {
        title: 'Propiedades',
        href: '/properties',
        icon: Building,
        roles: ['admin', 'super_user', 'employer', 'recruiter', 'candidate'],
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: UserCog,
        roles: ['admin', 'super_user', 'employer', 'recruiter', 'candidate'],
    },
];

export function AppSidebar() {

    const { props: { auth } } = usePage<SharedData>();

    const mainNavItemsFilter = mainNavItems.filter((item) => item.roles.includes(auth.user.role));

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
