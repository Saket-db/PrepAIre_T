import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Layers, LogOut, Search, Settings, UserCircle, Wallet } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { title } from 'process'

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Workspace",
        url: "#",
        icon: Layers,
    },
    {
        title: "AI Tools",
        url: "#",
        icon: Inbox,
    },
    {
        title: "My History",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Billing & Payments",
        url: "/billing",
        icon: Wallet,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <a href='/dashboard'>
                        <Image
                            src={'https://res.cloudinary.com/dyy1u7wvc/image/upload/v1749641075/Logo_Name_tnqqid.png'}
                            alt='logo'
                            width={100}
                            height={80}
                            className='w-full cursor-pointer'
                        />
                    </a>
                    <h2 className='text-sm text-gray-400 text-center mt-2'>Build Your Skills</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-2'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                            {/* Spacer to push logout to bottom */}
                            <div className="flex-1" />
                            <a
                                href="app/page"
                                className="flex items-center gap-2 text-lg text-red-500 p-2  hover:bg-gray-100 rounded-lg justify-center"
                            >
                                <LogOut
                                    className="h-5 w-5"
                                />
                                <span>Log Out</span>
                            </a>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    )
}