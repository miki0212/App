import { Routes } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../register/RegisterComponent';
import MainPageUserController from '../mainPageUser/MainPageUserComponent';
import UserProfileComponent from '../userProfile/UserProfileComponent';
import Header from '../header/Header';
import Navigation from '../navigation/Navigation';
import ExercisesComponent from '../exercises/ExercisesComponent';

export default function MainWindow() {
	return (
        <Router>
            <div>
                <Header />
                <Navigation />
                <Routes>
                    <Route path="/" element={<LoginComponent />} />     
                    <Route path="/register" element={<RegisterComponent />} />

                    <Route path="/user/UserMainPage" element={<MainPageUserController />} />
                    <Route path="/user/UserProfile" element={<UserProfileComponent />} />
                    <Route path="/user/Exercises" element={<ExercisesComponent />} />

                </Routes>
            </div>
        </Router>
	)
}