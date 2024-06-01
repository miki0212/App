//import { useState } from "react"

//import { jwtDecode } from "jwt-decode";

//export default function MainPageUserController() {

//	const [isLoggedIn, setIsLoggedIn] = useState(false);

//	useState(() => {
//		const token = localStorage.getItem('userToken');

//		if (token != null ) {
//			setIsLoggedIn(true)
//			try {
//				const decodedToken = jwtDecode(token);
//				console.log(decodedToken.username);
//				return decodedToken;
//			} catch (error) {
//				console.error('B³¹d dekodowania tokena:', error);
//				return null;
//			}
//		}
//		else {
//			setIsLoggedIn(false);
//			window.location.href = '/';
//		}
//	})

//	function isTokenExpired(token: string) {
//		const decodedToken = jwtDecode(token);
//		const currentTime = Math.floor(Date.now() / 1000);

//		if (typeof (decodedToken.exp) != 'undefined') {
//			if (decodedToken.exp < currentTime) {
//				return true;
//			}
//		}

//		return false;
//	}

//	function logout() {
//		localStorage.removeItem('userToken');
//		window.location.href = '/';
//	}

//	return (
//		<>
//			<div>Witaj </div>
//			<button onClick={() => { window.location.href = "/user/UserProfile" }}>Profil</button>
//			<button onClick={()=>logout()}>Wyloguj Sie</button>
//		</>
//	)
//}



import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Header from '../header/Header';
import Navigation from '../navigation/Navigation';

import './MainPageUserComponentStyle.css';
import { IUserProfileData } from '../../Interfaces/UserProfileData';
import { IDecodedToken } from '../../Interfaces/IDecodedToken';
import { ENDPOINT, LINK } from '../../ENDPOINTS';
import UserExercisesComponent from './UserExercises';
import UserAddExerciseComponent from './UserAddExercisesComponent';
import UserCaloricGoal from './CaloricGoal/UserCaloricGoal';
import UserMealHistory from '../meal/user/userMealHistory/UserMealHistory';
import UserAddMealComponent from '../meal/user/addNewMeal/UserAddMealComponent';



export default function MainPageUserController() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
    const [login, setLogin] = useState('');
    const [userCalories, setUserCalories] = useState<number>(0);

    const [userExercisesCalories, setUserExercisesCalories] = useState<number>(0);

    const [userProfileData, setUserProfileData] = useState<IUserProfileData>({
        UserId: 0,
        Age: 0,
        Height: 0,
        Weight: 0,
        Sex: true,
    })
    const [userProfileDataExists, setUserProfileDataExists] = useState(false);

    //Exercises component
    const [isActiveAddExercise, setIsActiveAddExercise] = useState(false);

    const [isActiveAddMeal, setIsActiveAddMeal] = useState(false);

    const [userId, setUserId] = useState(0);

    useEffect(() => {
        //Check exists token
        const token = localStorage.getItem('userToken');

        if (token != null) {
            setIsLoggedIn(true);
            try {
                const decodedToken = jwtDecode(token);
                setDecodedToken(decodedToken as IDecodedToken);
                console.log(decodedToken)
                console.log("TEST")
                checkAndGetUserProfileData(decodedToken.id as string);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
        else {
            setIsLoggedIn(false);
            window.location.href = '/';
        }
    },[])

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                //console.log(decodedToken)

                setUserId(decodedToken.id as number);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
    })

    useEffect(() => {
        if (userId != 0) {
            getCalories();
            getExercisesCalories();
            //getTestRanking();
        }
    }, [userId])


    const getTestRanking = () => {
        const url = `${LINK}${ENDPOINT.USERDATA.GET_EXERCISES_USER_RANKING.replace("{userId}", userId.toString())}`

        fetch(url, {
            method: "GET"
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
    }
    async function checkAndGetUserProfileData(userID : string) {
        const url = `${LINK}${ENDPOINT.USERDATA.GETPROFILEDATA.replace("{userId}", userID)}`;

        await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
        }).then(response => {
            if (response.status == 200) {
                return response.json();
            }
        }).then(data => {
            if (data !== null && data !== undefined) {
                setUserProfileDataExists(true);
                setUserProfileData(data as IUserProfileData);
            } else {
                setUserProfileDataExists(false);
            }
        })
    }

    const getCalories = async () => {
     
        const url = `${LINK}${ENDPOINT.MEALS.CalculateCalories.replace("{UserId}", userId.toString())}`;
        
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("GETUSERPROFILEDATA");
            }
        }).then(data => {
            //console.log("CALORIES : "+data)
            setUserCalories(data as number);
        })
    }

    const getExercisesCalories = async () => {
        const url = `${LINK}${ENDPOINT.USERDATA.CALCULATE_EXERCISE_CALORIES.replace("{UserId}", userId.toString())}`;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("GETUSERPROFILEDATA");
            }
        }).then(data => {
            console.log(data);
            setUserExercisesCalories(data as number)
        })
    }


 
    return (
        <>
            {
                isLoggedIn ?
                    <div className="main-container">
                        <div className="components-container">
                            <div className="component-exercise" id="component-1">
                                {userProfileDataExists ?
                                    <>
                                        {isActiveAddExercise ? <UserAddExerciseComponent getExercisesCalories={getExercisesCalories} isActiveAddExercise={isActiveAddExercise} setIsActiveAddExercise={setIsActiveAddExercise}></UserAddExerciseComponent> : <UserExercisesComponent isActiveAddExercise={isActiveAddExercise} setIsActiveAddExercise={setIsActiveAddExercise} />}
                                       
                                    </>
                                    :
                                    <>
                                        Uzupelnij profil
                                    </>}

                            </div>
                            <div className="calories-goal-component" id="component-2">
                                {/*<h3>Zapotrzebowanie kaloryczne</h3>*/}
                                <UserCaloricGoal getCalories={getCalories} userCalories={userCalories} userExercisesCalories={userExercisesCalories} getExercisesCalories={getExercisesCalories} />
                            </div>
                            <div className="component food-list-component" id="food-list-component">
                                {isActiveAddMeal ? <UserAddMealComponent isActiveAddMeal={isActiveAddMeal} setIsActiveAddMeal={setIsActiveAddMeal} getUserCalories={getCalories} userCalories={userCalories}></UserAddMealComponent> : <UserMealHistory isActiveAddMeal={isActiveAddMeal} setIsActiveAddMeal={setIsActiveAddMeal} />}
                            </div>
                        </div>
                    </div >

                    :

                    <div>Loading ...</div>
            }
        </>
    );
};

