import React from "react";

import Navbar from './Navbar';
import Hero from './Hero';
import Pomodoro from './Pomodoro';
import Notes from './Notes';
import ToDoList from './ToDoList';
import Saved from './Saved';
import { useState, useLayoutEffect } from 'react';
import { POMODORO, TODOLIST, NOTES, SAVED } from './constants';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    let [display, setDisplay] = useState(false)
    let navigate = useNavigate();
    let [token, setToken] = useState(localStorage.getItem('token') || '')

    let [timerSettings, setTimerSettings] = useState(localStorage.getItem('timerSettings') ? JSON.parse(localStorage.getItem('timerSettings')) : {
        focusTime: 1,
        breakTime: 1,
        focus: true,
        secondsLeft: 1 * 60,
        focusTimeSec: 60,
        breakTimeSec: 60,
        isStart: false
    })

    let [toDoList, setToDoList] = useState(localStorage.getItem('toDoList') ? JSON.parse(localStorage.getItem('toDoList')) : [
        { text: 'Demo Task', checked: false }
    ])

    let [notes, setNotes] = useState(localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [
        { title: 'Demo Title', text: 'Demo Note' }
    ])

    let [saved, setSaved] = useState(localStorage.getItem('saved') ? JSON.parse(localStorage.getItem('saved')) : [
        { text: 'Demo' }
    ])

    const [current, setCurrent] = useState(POMODORO)

    const currentComponent = () => {
        if (current === POMODORO)
            return <Pomodoro timerSettings={timerSettings} setTimerSettings={setTimerSettings} token={token} />
        else if (current === TODOLIST)
            return <ToDoList toDoList={toDoList} setToDoList={setToDoList} token={token} />
        else if (current === NOTES)
            return <Notes notes={notes} setNotes={setNotes} token={token} />
        else if (current === SAVED)
            return <Saved saved={saved} setSaved={setSaved} token={token} />
    }

    const verifyToken = () => {
        fetch('http://localhost:5000/verify', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ token: token })
        })
            .then((res) => {
                if (!res.ok)
                    navigate('/')
                else
                    setDisplay(true)
            }).catch(err => console.log(err))
    }

    useLayoutEffect(() => {
        verifyToken()
    }, [])

    function renderLoading() {
        return (
            <div className="loading">
                <img src="assets/bubble-loading.svg" alt="Laoding" />
                <p>Loading</p>
            </div>
        );
    }

    return (
        <>
            {display ?
                <div>
                    <Navbar setCurrent={setCurrent} />
                    <div className='center'>
                        <Hero saved={saved} setSaved={setSaved} />
                        {currentComponent()}
                    </div>
                </div>
                :
                renderLoading()
            }
        </>
    );
}