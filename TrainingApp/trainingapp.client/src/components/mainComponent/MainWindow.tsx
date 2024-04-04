

import { Link, Routes } from 'react-router-dom'

import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../register/RegisterComponent';
import MainPageUserController from '../mainPageUser/MainPageUserComponent';
import UserProfileComponent from '../userProfile/UserProfileComponent';
export default function MainWindow() {



	return (
        <Router>
            <div>

                <Routes>
                    <Route path="/" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />

                    <Route path="/user/UserMainPage" element={<MainPageUserController />} />
                    <Route path="/user/UserProfile" element={<UserProfileComponent />} />

                </Routes>
            </div>
        </Router>
	)
}