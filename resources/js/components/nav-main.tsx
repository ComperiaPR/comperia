import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {/* Si tiene submenú, haz el menú colapsable */}
                        {item.submenu && item.submenu.length > 0 ? (
                            <>
                                <div
                                    className="flex items-center cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        item._open = !item._open;
                                        // Forzar renderizado (no óptimo, pero simple para ejemplo)
                                        window.dispatchEvent(new Event('sidebar-toggle'));
                                    }}
                                >
                                    <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                        <Link
                                            href={item.href}
                                            prefetch
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </div>
                                {item._open && (
                                    <SidebarMenuSub className="ml-6 mt-1">
                                        {item.submenu.map((sub: NavItem) => (
                                            <SidebarMenuSubItem key={sub.title}>
                                                <SidebarMenuSubButton asChild isActive={page.url.startsWith(sub.href)} >
                                                    <Link href={sub.href} prefetch>
                                                        {sub.icon && <sub.icon />}
                                                        <span>{sub.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                )}
                            </>
                        ) : (
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link
                                    href={item.href}
                                    prefetch
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
