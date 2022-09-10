import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function Auth() {

    let [error, setError] = useState({
        message: '',
        show: false
    })

    let clear = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    let navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState(clear)
    const [token, setToken] = useState('')

    const handleSwitch = () => {
        setIsLogin(prev => !prev)
        setError({ message: '', show: false })
    }

    function clearForm() {
        setFormData(clear)
    }

    const handleLogin = (event) => {
        event.preventDefault();

        let loginData = {
            email: formData.email,
            password: formData.password
        }

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(async (resp) => {
                let data = await resp.json()
                if (!resp.ok) {
                    setError({ message: data.message, show: true })
                } else {
                    clearForm();
                }
                return data
            })
            .then((data) => {
                setToken(data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('timerSettings', JSON.stringify(data.user.timerSettings))
                localStorage.setItem('toDoList', JSON.stringify(data.user.toDoList))
                localStorage.setItem('notes', JSON.stringify(data.user.notes))
                localStorage.setItem('saved', JSON.stringify(data.user.saved))
            })
            .catch(err => console.log(err))
    }

    const handleSignUp = (event) => {
        event.preventDefault();

        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(async (resp) => {
                let data = await resp.json()
                if (!resp.ok) {
                    setError({ message: data.message, show: true })
                } else {
                    clearForm();
                }
                return data
            })
            .then((data) => {
                setToken(data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('timerSettings', JSON.stringify(data.user.timerSettings))
                localStorage.setItem('toDoList', JSON.stringify(data.user.toDoList))
                localStorage.setItem('notes', JSON.stringify(data.user.notes))
                localStorage.setItem('saved', JSON.stringify(data.user.saved))
            })
            .catch(err => console.log(err))
    }

    const handleChange = (event) => {
        setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    function renderError() {
        return (
            <div className="error">
                {error.message}
            </div>
        );
    }

    function renderLogin() {
        return (
            <div className="container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Enter Your Email *</label>
                    <input type="email" name="email" id="email" placeholder="abc@gmail.com" required value={formData.email} onChange={handleChange} />
                    <label htmlFor="password">Enter Your Password *</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
                    {error.show ? renderError() : <div></div>}
                    <button type="submit"> <img src="assets/email-icon.svg" alt="Email" /> Login With Email</button>
                </form>
                <p>Don't have an account? <button className="signup-redirect-btn" onClick={handleSwitch}>SignUp</button></p>
            </div>
        );
    }

    function renderSignUp() {
        return (
            <div className="container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <div className="name">
                        <input type="text" name="firstName" id="firstName" required placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                        <input type="text" name="lastName" id="lastName" required placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <label htmlFor="email">Enter Your Email *</label>
                    <input type="email" name="email" id="email" placeholder="abc@gmail.com" required value={formData.email} onChange={handleChange} />
                    <label htmlFor="password">Enter Your Password *</label>
                    <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} />
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
                    {error.show ? renderError() : <div></div>}
                    <button type="submit"> <img src="assets/email-icon.svg" alt="Email" /> SignUp With Email</button>
                </form>
                <p>Already have an account? <button className="signup-redirect-btn" onClick={handleSwitch}>SignIn</button></p>
            </div>
        );
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
            setError({ message: '', show: false })
            return navigate('/home')
        }
    }, [token])

    return (
        <div className="auth-main">
            <img src="assets/logo.png" alt="ProductiveCo." className="auth-logo" />
            {isLogin ? renderLogin() : renderSignUp()}
        </div>
    );
}