import { Routes, Route } from 'react-router-dom';
import { Home } from '../index';
export function MyRouters () {
    return (

        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    )
    
}