import React from 'react';
import * as AiIcons from "react-icons/ai";
import { MdQuiz } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5"; // better gear icon

export const SidebarData = [
    {
        title: 'Home',
        path: '/login/home',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'My Flash Cards',
        path: '/login/home/my',
        icon: <AiIcons.AiFillFolder />,
        cName: 'nav-text'
    },
    {
        title: 'Not Memorized',
        path: '/login/home/not_memorized',
        icon: <MdOutlinePendingActions />,
        cName: 'nav-text'
    },
    {
        title: 'Review',
        path: '/login/home/review',
        icon: <MdQuiz />,
        cName: 'nav-text'
    },
    {
        title: 'About',
        path: '/demo',
        icon: <AiIcons.AiFillInfoCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Settings',
        path: '/login/home/settings',
        icon: <AiIcons.AiFillSetting />,
        cName: 'nav-text'
    }
];
