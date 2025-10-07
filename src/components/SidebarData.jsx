import React from 'react'
import * as AiIcons  from "react-icons/ai";
import { MdQuiz } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'My Flash Cards',
        path: '/my',
        icon: <AiIcons.AiFillFolder />,
        cName: 'nav-text'
    },
    {
        title: 'Not Memorized',
        path: '/not_memorized',
        icon: <MdOutlinePendingActions />,
        cName: 'nav-text'
    },

    {
        title: 'Review',
        path: '/review',
        icon: <MdQuiz />,
        cName: 'nav-text'
    },

    {
        title: 'About',
        path: '/About',
        icon: <AiIcons.AiFillInfoCircle />,
        cName: 'nav-text'
    },

    {
        title: 'Settings',
        path: '/',
        icon: <AiIcons.AiFillSetting />,
        cName: 'nav-text'
    }

]