import { useEffect, useState } from "react";
import "./UserCaloricGoalStyle.css";
import { ENDPOINT, LINK } from "../../../ENDPOINTS";
import { jwtDecode } from "jwt-decode";
import { IUserProfileData } from "../../../Interfaces/UserProfileData";

export default function UserCaloricGoal() {

    const [userProfileData, setUserProfilData] = useState<IUserProfileData>();
    const [userId, setUserId] = useState('');
    const [userCaloricGoal, setUserCaloricGoal] = useState(0);

    const [userCalories, setUserCalories] = useState<number>(0);

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
            getCalories();
        }
     
    }, [userId]);

    const getCalories = async () => {

        const url = `${LINK}${ENDPOINT.MEALS.CalculateCalories.replace("{UserId}", userId)}`;

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
            setUserCalories(data as number);
        })
    }



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
            console.log(data);
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
        <div className="user-caloric-goal-container">
            {userCalories} / {userCaloricGoal}
        </div>
    );
}