import { useEffect, useState } from "react";
import "./UserCaloricGoalStyle.css";
import { ENDPOINT, LINK } from "../../../ENDPOINTS";
import { jwtDecode } from "jwt-decode";
import { IUserProfileData } from "../../../Interfaces/UserProfileData";

export default function UserCaloricGoal(props: { userCalories: number, getCalories: any, userExercisesCalories : number,getExercisesCalories:any,}) {

    const [userProfileData, setUserProfilData] = useState<IUserProfileData>();
    const [userId, setUserId] = useState('');
    const [userCaloricGoal, setUserCaloricGoal] = useState(0);

    const [userCaloricExercises, setUserCaloricExercises] = useState(0);

    const [percent, setPercent] = useState<number>(1); 

    useEffect(() => {

        setTimeout(() => { 
            const cal = props.userExercisesCalories + userCaloricGoal;

            let calc: number = 0;

            calc = parseInt((props.userCalories * 100 / cal).toFixed(0));

            console.log("CALC " + calc)
            setPercent(calc)
        },1200)

    }, [props.userCalories, props.userExercisesCalories, userCaloricGoal])

    useEffect(() => {
        console.log("CALORIES CHANGE")
    }, [props.userCalories])

    useEffect(() => {
        getToken();
    })
    useEffect(() => {

        if (userId !== '') {
            fetchData();
        }
    }, [userId])
    useEffect(() => {
        calculateCaloricGoal();
    }, [userProfileData])

    useEffect(() => {
        if (userId != '') {

            props.getCalories();
        }

    }, [userId]);

    const containerStyle = {
        '--percent-height': `${percent}%`

    } as React.CSSProperties;

    const getToken = async () => {
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
        const url = `${LINK}${ENDPOINT.USERDATA.GETPROFILEDATA.replace("{userId}", userId)}`;
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
            setUserProfilData(data as IUserProfileData)
        })
    }

    const calculateCaloricGoal = () => {
        let sex = userProfileData?.sex;
        let weight = userProfileData?.weight as number;
        let height = userProfileData?.height as number;
        let age = userProfileData?.age as number;
        let caloricGoal = 0;

        if (sex) {
            caloricGoal = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            caloricGoal = 447.593 + (9.247 * weight) + (3.908 * height) - (4.330 * age);
        }

        setUserCaloricGoal(Math.round(caloricGoal));

    }

    return (
        <div className={`user-caloric-goal-info`}>
            Cel kaloryczny : Utrzymanie wagi
            <h3>Zapotrzebowanie kaloryczne </h3>
            <div style={containerStyle} className="user-caloric-goal-container">

                {props.userCalories.toFixed(0)} / {userCaloricGoal + props.userExercisesCalories}
            </div>

            <h3>Zapotrzebowanie zwiekszone o cwiczenia :</h3>
            {props.userExercisesCalories}
        </div>
    );
}