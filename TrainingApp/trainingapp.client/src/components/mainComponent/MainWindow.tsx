import { Routes } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../register/RegisterComponent';
import MainPageUserController from '../mainPageUser/MainPageUserComponent';
import UserProfileComponent from '../userProfile/UserProfileComponent';
import Header from '../header/Header';
import Navigation from '../navigation/Navigation';
import ExercisesComponent from '../exercises/ExercisesComponent';
import AdminPanelLoginComponent from '../../adminPanel/AdminPanelLoginComponent';
import NavigationAdmin from '../../adminPanel/navigationAdmin/NavigationAdmin';
import MainAdminPage from '../../adminPanel/mainAdminPage/MainAdminPage';
import AddExerciseAdmin from '../../adminPanel/addExercise/AddExerciseAdmin';
import MealContainerComponent from '../meal/mealContainer/MealContainerComponent';
import ManageUserComponent from '../../adminPanel/blockUserAdmin/manageUserComponent/ManageUserComponent';
import UserRankingContainer from '../userRanking/UserRankingContainer';

export default function MainWindow() {
	return (
		<Router>
			<div>
				<Header />
				<Navigation />

				{/*Admin*/}
				<NavigationAdmin />

				<Routes>
					{/*Admin Panel*/}
					<Route path="/admin/login" element={<AdminPanelLoginComponent />}></Route>
					<Route path="/admin/adminMainPage" element={<MainAdminPage />}></Route>
					<Route path="/admin/ManageUser" element={<ManageUserComponent />}></Route>
					<Route path="/admin/addExercise" element={<AddExerciseAdmin />}></Route>


					{/*User*/}
					<Route path="/" element={<LoginComponent />} />
					<Route path="/register" element={<RegisterComponent />} />

					<Route path="/user/UserMainPage" element={<MainPageUserController />} />
					<Route path="/user/UserProfile" element={<UserProfileComponent />} />
					<Route path="/user/Exercises" element={<ExercisesComponent />} />
					<Route path="/user/ExercisesRanking" element={<UserRankingContainer />} />

					{/*Meals*/}
					<Route path="/user/Meal" element={<MealContainerComponent />} />
			
				</Routes>
			</div>
		</Router>
	)
}