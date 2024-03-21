

import { Link, Routes } from 'react-router-dom'

import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../register/RegisterComponent';
import MainPageUserController from '../mainPageUser/MainPageUserComponent';
export default function MainWindow() {



	return (
        <Router>
            <div>

                <Routes>
                    <Route path="/" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />

                    <Route path="/user/UserMainPage" element={<MainPageUserController />} />

                </Routes>
            </div>
        </Router>
	)
}