import { Routes, Route } from 'react-router-dom';
import { Home, Login } from '../index';
export function MyRouters () {
    return (

        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    )
    
}