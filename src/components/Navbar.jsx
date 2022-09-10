import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { POMODORO, TODOLIST, NOTES, SAVED } from './constants';

export default function Navbar({ setCurrent }) {
    let navigate = useNavigate()

    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(true)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

    const handleNavClick = () => {
        isMobile ? setIsNavOpen(prev => !prev) : setIsNavOpen(true)
    }

    function handleLink(set) {
        setCurrent(set);
        handleNavClick();
    }

    useEffect(() => {
        if (window.innerWidth > 786) {
            setIsMobile(false)
            setIsNavOpen(true)
        } else {
            setIsNavOpen(false)
        }
        const updateWindowSize = () => {
            if (window.innerWidth > 786) {
                setIsMobile(false)
                setIsNavOpen(true)
            } else {
                setIsMobile(true)
            }
        }

        window.addEventListener('resize', updateWindowSize)

        return () => {
            window.removeEventListener('resize', updateWindowSize)
        }
    }, [isMobile])

    const handleProfileClick = () => {
        setIsProfileMenuOpen((prev) => !prev)
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    function renderProfileMenu() {
        return (
            <div className='profile-btn-menu'>
                <button className='cross2' onClick={handleProfileClick} ><img src="assets/Cross-icon.svg" alt="Close" /></button>
                <div className='profile-btn-menu-div'><button onClick={() => handleLink(SAVED)}> <img src="assets/save-icon.svg" alt="Saved" /> Saved</button></div>
                <div className='profile-btn-menu-div'><button onClick={() => handleLogout()}> <img src="assets/logout-icon.svg" alt="LogOut" /> LogOut</button></div>
            </div>
        );
    }



    return (
        <div className='navbar'>
            <img src="assets/logo.png" alt="Productive Co. Logo" className='logo' />
            {!isNavOpen ?
                <button onClick={handleNavClick} className={'nav-btn'}><img src="assets/hamburger.svg" alt="Menu" /></button>
                :
                <nav>
                    <button className='cross' onClick={handleNavClick}><img src="assets/Cross-icon.svg" alt="Close" /></button>
                    <ul>
                        <li> <button onClick={() => handleLink(POMODORO)}><img src="assets/timer-icon-nav.svg" alt="Timer Icon" /> Pomodoro Timer</button> </li>
                        <li> <button onClick={() => handleLink(TODOLIST)}><img src="assets/list-icon-nav.svg" alt="List Icon" /> To Do List</button> </li>
                        <li> <button onClick={() => handleLink(NOTES)}><img src="assets/notes-icon-nav.svg" alt="Notes Icon" /> Notes</button> </li>
                    </ul>
                    <div className='profile-main'>
                        <button className='profile-btn' onClick={handleProfileClick}>
                            {JSON.parse(localStorage.getItem('user')).firstName[0]}
                        </button>
                        {isProfileMenuOpen ? renderProfileMenu() : <div></div>}
                    </div>
                </nav>
            }
        </div>
    );
}