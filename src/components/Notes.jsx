import React, { useEffect, useState } from 'react'

export default function Notes({ notes, setNotes, token }) {
    let [isEditNoteOpen, setIsEditNoteOpen] = useState(false)
    let [isNewNote, setIsNewNote] = useState(false)
    let [editIndex, setEditIndex] = useState(-1)
    let [title, setTitle] = useState('')
    let [text, setText] = useState('')

    const setLocalNotes = () => {
        localStorage.setItem('notes', JSON.stringify(notes))

        fetch('https://productivity-app-backend-bilcyfqs6-omar-sarfraz.vercel.app/home/notes', {
            method: 'POST',
            headers: {
                "content-type": 'application/json',
                "authorization": `bearer ${token}`
            },
            body: JSON.stringify(notes)
        }).then(resp => console.log(resp))
            .catch(err => console.log(err))
    }

    const handleEdit = (index) => {
        setTitle(notes[index].title)
        setText(notes[index].text)
        setIsEditNoteOpen(prev => !prev)
        setEditIndex(index)
    }

    const handleDelete = (index) => {
        let newList = notes.filter((item, newIndex) => newIndex !== index)
        setNotes(newList)
    }

    const handleNewNote = () => {
        setTitle('')
        setText('')
        setIsNewNote(prev => !prev)
        setIsEditNoteOpen(prev => !prev)
    }

    useEffect(() => setLocalNotes(), [notes])

    function mapNotes() {
        return (
            <div className='notes-inner-2'>
                <button className='add-note-btn' onClick={handleNewNote}>Add New Note</button>
                {
                    notes.map((item, index) => {
                        let newTitle, newText
                        if (item.title === '')
                            newTitle = item.text.slice(0, 10) + '...'
                        else
                            newTitle = item.title
                        if (item.text.length > 150)
                            newText = item.text.slice(0, 150)
                        else
                            newText = item.text
                        return (
                            <div className='note' key={index}>
                                <div className='title-edit'>
                                    <h3 className='note-title'>{newTitle}</h3>
                                    <button className='edit-note-btn' onClick={() => handleEdit(index)}> <img src="assets/notes-edit.svg" alt="Edit Note" /> </button>
                                </div>
                                <p className='note-text'>{newText}...</p>
                                <button className='delete-icon' onClick={() => handleDelete(index)}> <img src="assets/delete-icon.svg" alt="Delete" /> </button>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newNotesList
        newNotesList = notes.filter(() => true)
        if (isNewNote) {
            let newNote = { title: title, text: text }
            newNotesList.unshift(newNote)
            setIsNewNote(false)
            setTitle('')
            setText('')
        } else {
            newNotesList[editIndex].title = title
            newNotesList[editIndex].text = text
        }
        setNotes(newNotesList)
        setIsEditNoteOpen(prev => !prev)
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    function renderEditMenu() {
        return (
            <div className='edit-menu'>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <button className='back' onClick={() => setIsEditNoteOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <label htmlFor="title">Enter Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => handleTitleChange(e)} />
                    <label htmlFor="text">Enter Note Details</label>
                    <textarea name="text" id="text" cols="30" rows="10" value={text} required onChange={(e) => handleTextChange(e)}></textarea>
                    <button type="submit" className='note-done-btn'>Done</button>
                </form>
            </div>
        );
    }

    return (
        <div className='notes-main'>
            <div className='container'>
                <div className='notes-outer'>
                    <h1>Notes</h1>
                    <div className='notes-inner'>
                        {
                            isEditNoteOpen ? renderEditMenu() : mapNotes()
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}