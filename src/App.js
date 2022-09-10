import './App.css';
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/home' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
