
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
		ADDUSEREXERCISESPLAN: "/UserData/AddUserExercisesPlan"
	}
}