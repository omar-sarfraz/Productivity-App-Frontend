import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useRef, useEffect } from 'react';
import ReactSlider from 'react-slider';

export default function Pomodoro({ timerSettings, setTimerSettings, token }) {
    let [isTimer, setIsTimer] = useState(true)

    const setLocalTimer = () => {
        localStorage.setItem('timerSettings', JSON.stringify(timerSettings))

        fetch('https://productivity-app-backend-bilcyfqs6-omar-sarfraz.vercel.app/home/timer', {
            method: 'POST',
            headers: {
                "content-type": 'application/json',
                "authorization": `bearer ${token}`
            },
            body: JSON.stringify(timerSettings)
        }).then(resp => console.log(resp))
            .catch(err => console.log(err))
    }

    const interval = useRef(null)

    useEffect(() => setLocalTimer(), [isTimer])

    useEffect(() => {
        interval.current = setInterval(() => {
            if (!timerSettings.isStart)
                return
            if (timerSettings.secondsLeft <= 0) {
                if (!timerSettings.focus) {
                    setTimerSettings((prev) => ({ ...prev, isStart: !timerSettings.isStart, focus: !prev.focus, secondsLeft: !timerSettings.focus ? timerSettings.focusTimeSec : timerSettings.breakTimeSec }))
                    return
                }
                else
                    setTimerSettings((prev) => ({ ...prev, focus: !prev.focus, secondsLeft: !timerSettings.focus ? timerSettings.focusTimeSec : timerSettings.breakTimeSec }))
            }
            setTimerSettings((prev) => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }))
            console.log(timerSettings)
        }, 1000)

        return () => clearInterval(interval.current)

    }, [timerSettings])

    const startTimer = () => {
        setTimerSettings((prev) => ({ ...prev, isStart: !prev.isStart }))
    }

    const updateTimer = (newValue) => {
        setTimerSettings((prev) => ({ ...prev, secondsLeft: !timerSettings.focus ? newValue * 60 : newValue * 60 }))
    }

    const handleBack = () => {
        setIsTimer(prev => !prev)
        localStorage.setItem('timerSettings', timerSettings)
    }

    const handleAfterSec = (newValue) => {
        setTimerSettings((prev) => ({ ...prev, breakTime: newValue, breakTimeSec: newValue * 60 }))
        if (!timerSettings.focus)
            updateTimer(newValue)
        console.log(timerSettings);
    }

    const handleAfter = (newValue) => {
        setTimerSettings((prev) => ({ ...prev, focusTime: newValue, focusTimeSec: newValue * 60 }))
        if (timerSettings.focus)
            updateTimer(newValue)
        console.log(timerSettings);
    }

    const Editor = () => {
        return (
            <div className='edit-timer'>
                <label>Choose Work Minutes: {timerSettings.focusTime}</label>
                <ReactSlider
                    className={'slider'}
                    thumbClassName={'thumb'}
                    trackClassName={'track'}
                    min={0}
                    max={180}
                    value={timerSettings.focusTime}
                    onAfterChange={handleAfter}
                />
                <label>Choose break Minutes: {timerSettings.breakTime}</label>
                <ReactSlider
                    className={'slider secondary'}
                    thumbClassName={'thumb secondary-thumb'}
                    trackClassName={'track'}
                    min={0}
                    max={180}
                    value={timerSettings.breakTime}
                    onAfterChange={handleAfterSec}
                />
                <button className='back-btn' onClick={handleBack}>Ok</button>
            </div>
        );
    }

    const PomoTimer = () => {
        return (
            <div className='pomo-timer'>
                <button className='edit-timer-btn' onClick={handleEdit}> <img src="assets/timer-edit.svg" alt="Edit Timer" /> </button>
                <CircularProgressbar
                    value={timerSettings.secondsLeft}
                    text={`${minutes ? minutes : minutes + '0'}:${seconds ? seconds : seconds + '0'}`}
                    maxValue={timerSettings.focus ? timerSettings.focusTimeSec : timerSettings.breakTimeSec}
                    strokeWidth={6}
                    styles={buildStyles({
                        pathColor: timerSettings.focus ? "#0C1541" : "#787FA3",
                        textColor: timerSettings.focus ? "#0C1541" : "#787FA3"
                    })}
                />
                <p
                    style={
                        {
                            color: timerSettings.focus ? '#0C1541' : '#787FA3',
                            fontWeight: 'bold'
                        }
                    }
                >
                    {timerSettings.focus ? 'It\'s time to do some work' : 'Let\'s have a short break'}
                </p>
                <button className='pomo-start' onClick={startTimer} style={{ backgroundColor: timerSettings.focus ? '#0C1541' : '#787FA3' }}>{timerSettings.isStart ? 'Stop' : 'Start'}</button>
            </div>
        );
    }

    const handleEdit = () => {
        setIsTimer(prev => !prev)
    }

    let seconds = Math.floor((timerSettings.secondsLeft) % 60)
    let minutes = Math.floor((timerSettings.secondsLeft) / 60)

    if (minutes > 0 && minutes < 10)
        minutes = '0' + minutes
    if (seconds > 0 && seconds < 10)
        seconds = '0' + seconds

    return (
        <div className='pomodoro-main'>
            <div className="container">
                <h1>Pomodoro Technique</h1>
                <div className='pomodoro-inner'>
                    <div className='pomodoro-timer'>
                        {isTimer ? <PomoTimer /> : <Editor />}
                    </div>
                    <div className='pomodoro-info'>
                        <p>The pomodoro technique is a time management framework that will improve your focus and productivity. It encourages you to work within the time you have, rather than struggle against it.</p>
                        <ol>
                            <li>Set your timer for 25 minutes, and focus on a single task until the timer rings.</li>
                            <li>When your session ends, enjoy a five-minute break.</li>
                            <li>After four pomodoros, take a longer, more restorative 15-30 minute break.</li>
                        </ol>
                        <h4>You can also change the time for each pomodoro</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}