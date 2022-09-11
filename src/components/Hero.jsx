import React, { useEffect, useState } from 'react';

export default function Header({ saved, setSaved }) {
    const [tips, setTips] = useState([{ text: 'Loading...' }])
    const [count, setCount] = useState(0)
    const [totalLength, setTotalLength] = useState(0)
    const [tick, setTick] = useState(false)

    useEffect(() => {
        fetch('https://productivity-app-backend-bilcyfqs6-omar-sarfraz.vercel.app/tips')
            .then(resp => resp.json())
            .then(data => {
                setTotalLength(data.tips.length)
                setTips(data.tips)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        localStorage.setItem('saved', JSON.stringify(saved))
    }, [saved])

    function handleSave() {
        setTick(true)
        let newList = saved.filter((item) => item.text !== tips[count].text)
        newList.unshift(tips[count])
        setSaved(newList)
        localStorage.setItem('saved', JSON.stringify(saved))
    }

    function handleNext() {
        setTick(false)
        if (count === totalLength - 1) {
            setCount(0)
        } else {
            setCount(count => ++count)
        }
    }

    console.log(saved)

    return (
        <>
            <div className='hero-parent'>
                <div className='hero-child1 container'>
                    <h1>Welcome, {JSON.parse(localStorage.getItem('user')).firstName}</h1>
                    <div className='hero-child2'>
                        <div>
                            <h2>Productivity Tips</h2>
                            <button onClick={handleSave} className="save">
                                {tick ? 'Saved!' : ''}
                                <img src="assets/save-icon-tips.svg" alt="Save" />
                            </button>
                        </div>
                        <p>{tips[count].text}</p>
                        <div className='next-parent'>
                            <button className='next' onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}