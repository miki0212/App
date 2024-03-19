

import { Link, Routes } from 'react-router-dom'

import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../register/RegisterComponent';
export default function MainWindow() {

	return (
        <Router>
            <div>
                <Link to="/">Login</Link>
                <Link to="/register">Register</Link>

                <Routes>
                    <Route path="/" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                </Routes>
            </div>
        </Router>
	)
}