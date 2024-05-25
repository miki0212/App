
export const PORT = 7087;
export const LINK = `https://localhost:${PORT}`;

export const ENDPOINT = {
	ACCOUNT: {
		LOGIN: "/Account/login",
		REGISTER: "/Account/register"
	},
	USERDATA: {
		SETPROFILEDATA : "/UserData/setProfileData",
		GETPROFILEDATA : "/UserData/getProfilData?UserId={userId}",
		
		GETEXERCISES : "/UserData/getExercises?PageNumber={PageNumber}",
		GETEXERCISESMAXPAGE : "/UserData/getExercisesMaxPage",
		GETEXERCISEBYNAME: "/UserData/getExerciseByName?searchString={searchString}",

		CHECKFAVOURITEEXERCISES: "/UserData/checkFavouriteExercises",
		ADDREMOVEFAVOURITEEXERCISES: "/UserData/addRemoveFavouriteExercise",

		//Add Exercises to list 
		ADDUSEREXERCISESPLAN: "/UserData/AddUserExercisesPlan",
		GETUSEREXERCISESPLAN: "/UserData/getUserExercisesPlan?UserId={UserId}"
	},
	MEALS: {
		GET_MEAL_MAX_PAGE: "/Meal/getMealMaxSize",
		GET_MEAL_PAGE: "/Meal/getMealPage?page={page}",
		GET_USER_MEAL_HISTORY: "/Meal/getUserMealHistory?UserId={UserId}",
		GET_MEAL_BY_NAME: "/Meal/getMealByName?searchString={searchString}",
		Add_User_Meal_History: "/Meal/addUserMealHistory",

		CalculateCalories: "/Meal/calculateCalories?UserId={UserId}"
	},
	ADMIN: {
		LOGINADMIN: "/Admin/loginAdmin",

		GETADMINPRIVILEGES: '/Admin/getAdminPrivileges?adminId={adminId}',
		ADD_ADMIN_EXERCISES: '/Admin/addAdminExercise'
	}
}