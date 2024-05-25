import { useEffect, useState } from "react"
//import "./ShowExercisesPlanHistoryStyle.css"
import "./../../../mainPageUser/ShowExercisesPlanHistoryStyle.css"

import { ENDPOINT, LINK } from "../../../../ENDPOINTS"
//import { IUserExerciseList } from "../../Interfaces/IUserExercisesList";
import { jwtDecode } from "jwt-decode";
import { IUserMealList } from "../../../../Interfaces/meal/IUserMealList";

export default function ShowMealHistory() {

    const [userMealPlan, setUserMealPlan] = useState<IUserMealList[]>();

    const [userId, setUserId] = useState('');

    useEffect(() => {
        getToken();
    })
    useEffect(() => {

        if (userId !== '') {
            fetchData();
        }
    }, [userId])

    const getToken = async () => {
        const token = localStorage.getItem('userToken');

        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id as string);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
    }
    const fetchData = async () => {
        let url;

        if (userId === '') {
            url = `${LINK}${ENDPOINT.MEALS.GET_USER_MEAL_HISTORY.replace('{UserId}', '2')}`;
            setUserId('1')
        } else {
            url = `${LINK}${ENDPOINT.MEALS.GET_USER_MEAL_HISTORY.replace('{UserId}', userId)}`;
        }

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
                throw new Error("GET_USER_MEAL_PLAN");
            }
        }).then(data => {
            setUserMealPlan(data as IUserMealList[]);
        })
    }

    return (
        <div className={`user-exercises-history-container`}>
            {userMealPlan ?
                <div>
                    <div className={`user-exercise-table-header`}>
                        <div className={`user-exercise-table-name`}>Nazwa</div>
                        <div className={`user-exercise-table-name`}>Kalorie</div>
                    </div>
                    {userMealPlan?.map((meal, index) => (
                        <div className={`user-exercises-history-row`} key={index}>
                            <div className={`user-exercises-table-counter`}>{index + 1}</div>
                            <div className={`user-exercises-table-element`}>{meal.mealName}</div>
                            <div className={`user-exercises-table-element`}>{meal.calories.toFixed(2)} kcal</div>
                        </div>))}
                </div>

                : <div> Brak Posilkow !!!</div>

            }
        </div>
    )
}