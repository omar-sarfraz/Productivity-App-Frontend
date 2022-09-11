import React, { useEffect } from "react";

export default function Saved({ saved, setSaved, token }) {

    const setLocalSaved = () => {

        fetch('https://productivity-app-backend-bilcyfqs6-omar-sarfraz.vercel.app/home/saved', {
            method: 'POST',
            headers: {
                "content-type": 'application/json',
                "authorization": `bearer ${token}`
            },
            body: JSON.stringify(saved)
        }).then(resp => console.log(resp))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        setLocalSaved()
    }, [saved])

    function renderSaved() {
        return (
            saved.map((item, index) => (
                <div className="saveItem" key={index}>
                    {item.text}
                </div>
            ))
        );
    }

    return (
        <div className="saved-main">
            <div className="container">
                <h1>Saved Tips</h1>
                {renderSaved()}
            </div>
        </div>
    );
}