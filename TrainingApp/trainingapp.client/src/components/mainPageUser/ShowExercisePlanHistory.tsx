import { useEffect, useState } from "react"
import "./ShowExercisesPlanHistoryStyle.css"
import { ENDPOINT, LINK } from "../../ENDPOINTS"
import { IUserExerciseList } from "../../Interfaces/IUserExercisesList";
import { jwtDecode } from "jwt-decode";

export default function ShowExercisePlanHistory() {

    const [userExercisePlan, setUserExercisePlan] = useState<IUserExerciseList[]>();
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
        console.log("TOKEN ID : ")
        const token = localStorage.getItem('userToken');
     
        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken)
                console.log("TOKEN ID : " + decodedToken.id)
                setUserId(decodedToken.id as string);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
    }
    const fetchData = async () => {
        let url;
        console.log("Elo : "+userExercisePlan)
        console.log(userExercisePlan)

        if (userId === '') {
            url = `${LINK}${ENDPOINT.USERDATA.GETUSEREXERCISESPLAN.replace('{UserId}', '2')}`;
            setUserId('1')
        } else {
            url = `${LINK}${ENDPOINT.USERDATA.GETUSEREXERCISESPLAN.replace('{UserId}', userId)}`;
        }

        console.log(userId + " id")

        //const url = `${LINK}${ENDPOINT.USERDATA.GETUSEREXERCISESPLAN.replace('{UserId}', userId)}`;
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
                throw new Error("GETUSEREXERCISESPLAN");
            }
        }).then(data => {
            //console.log(data);
            setUserExercisePlan(data as IUserExerciseList[]);
        })
    }

    return (
        <div className={`user-exercises-history-container`}>
            {userExercisePlan ?
                <div>
                    <div className={`user-exercise-table-header`}>
                        <div className={`user-exercise-table-name`}>Nazwa</div>
                        <div className={`user-exercise-table-name`}>Powtorzenia</div>
                    </div>
                    {userExercisePlan?.map((exercises, index) => (
                        <div className={`user-exercises-history-row`} key={index}>
                            <div className={`user-exercises-table-counter`}>{index+1}</div>
                            <div className={`user-exercises-table-element`}>{exercises.exerciseName}</div>
                            <div className={`user-exercises-table-element`}>{exercises.repeat}</div>
                        </div>))}
                </div>
          
                : <div> Brak Cwiczen</div>

        }
        </div>
    )
}