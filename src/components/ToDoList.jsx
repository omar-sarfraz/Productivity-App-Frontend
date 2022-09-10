import React, { useEffect, useState } from 'react';

export default function ToDoList({ toDoList, setToDoList, token }) {
    const [addItem, setAddItem] = useState({ text: '', checked: false })

    const setLocalList = () => {
        localStorage.setItem('toDoList', JSON.stringify(toDoList))

        fetch('http://localhost:5000/home/list', {
            method: 'POST',
            headers: {
                "content-type": 'application/json',
                "authorization": `bearer ${token}`
            },
            body: JSON.stringify(toDoList)
        }).then(resp => console.log(resp))
            .catch(err => console.log(err))
    }

    useEffect(() => setLocalList(), [toDoList])

    function handleCheckBox(index) {
        let newList = toDoList.filter((item, currentIndex) => currentIndex !== index)
        let element = toDoList[index]
        element.checked = !element.checked
        newList.push(element)
        setToDoList(newList)
    }

    function handleAddTask(e) {
        setAddItem({ text: e.target.value, checked: false })
    }

    function handleAddTaskBtn() {
        if (!addItem.text)
            return
        let newList = toDoList.filter((item) => item.text !== addItem.text)
        newList.unshift(addItem)
        setToDoList(newList)
        setAddItem({ text: '', checked: false })
    }

    const handleDelete = (index) => {
        let newList = toDoList.filter((item, currentIndex) => currentIndex !== index)
        setToDoList(newList)
    }

    function renderDeleteBtn(index) {
        return (
            <button className='list-delete-btn' onClick={() => handleDelete(index)}><img src='assets/delete-icon.svg' alt='Delete' /></button>
        );
    }

    return (
        <div className='list-main'>
            <div className='container'>
                <h1>To Do List</h1>
                <div className='list-inner'>
                    <div className='list-input'>
                        <input
                            className='task-input'
                            type="text"
                            value={addItem.text}
                            id='task-input'
                            placeholder='Enter Task Here'
                            onChange={(e) => handleAddTask(e)}
                        />
                        <button className='add-task-btn' onClick={handleAddTaskBtn} >Add New Task</button>
                    </div>
                    <div className='list-area' style={{ display: !toDoList.length ? 'none' : 'inherit' }}>
                        {
                            toDoList.map((item, index) => {
                                return (
                                    <div className='list-item' key={index}>
                                        <input
                                            className='box'
                                            type="checkbox"
                                            id={index}
                                            checked={item.checked}
                                            onChange={() => handleCheckBox(index)}
                                        />
                                        <p style={
                                            item.checked ?
                                                {
                                                    textDecoration: 'line-through',
                                                    color: '#7D7A7A',
                                                    width: '100%'
                                                }
                                                :
                                                { width: '100%' }
                                        }>
                                            {item.text}
                                        </p>
                                        {renderDeleteBtn(index)}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}