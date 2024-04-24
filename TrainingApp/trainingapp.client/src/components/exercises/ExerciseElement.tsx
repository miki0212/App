import { useEffect, useState } from "react";
import IExercise from "../../Interfaces/IExercise";

import "./ExerciseElementStyle.css"
import { jwtDecode } from "jwt-decode";
import IExercisesFavourites from "../../Interfaces/IExercisesFavourites";
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import { json } from "react-router-dom";

export default function ExerciseElementComponent(props: { exercise: IExercise }) {
    const [isExerciseFavourite, setIsExerciseFavourite] = useState(false);
    const [decodedToken, setDecodedToken] = useState();

    const [dtoExercisesFavourites, setDtoExercisesFavourites] = useState<IExercisesFavourites>();

    useEffect(() => {
        checkExercisesFavourites();
    },[])

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token != null) {
            const decodedToken = jwtDecode(token);
            const exercisesFavourites: IExercisesFavourites = {
                UserId: decodedToken.id,
                ExerciseId: props.exercise.id,
            }
            setDtoExercisesFavourites(exercisesFavourites);
        }
    },[])

    const checkExercisesFavourites = async () => {
        //Get id from token
        const token = localStorage.getItem('userToken');

        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                //console.log(decodedToken.id);
                const exercisesFavourites: IExercisesFavourites = {
                    UserId: decodedToken.id,
                    ExerciseId: props.exercise.id,
                }

                //console.log(exercisesFavourites);

                const url = `${LINK}${ENDPOINT.USERDATA.CHECKFAVOURITEEXERCISES}`;

                await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*"
                    },
                    body: JSON.stringify(exercisesFavourites)
                }).then(response => {
                    if (response.status === 200) {
                        //console.log(response.json())
                        return response.json();
                    } else {
                        throw new Error("Check exerice Favourites ERROR");
                    }
                }).then(data => {
                        
                    setIsExerciseFavourite(data);
                })

            } catch (e) {
                console.log('ERROR')
            }
        }
    }

    const addExerciseFavourite = () => {
        if (isExerciseFavourite) {
            addFavourite();
            //setIsExerciseFavourite(!data);
        } else {
            addFavourite();
            //setIsExerciseFavourite(!data);
        }
    }

    const addFavourite = async () => {
        const url = `${LINK}${ENDPOINT.USERDATA.ADDREMOVEFAVOURITEEXERCISES}`;
        const data = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify(dtoExercisesFavourites)
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error('add remove exercises favourite ERROR');
                throw new Error('add remove exercises favourite ERROR');
            }
        }).then(data => {
            return data;
            setIsExerciseFavourite(!data);
            console.log("is Favourite : " + data)
            console.log("is Favourite : " + isExerciseFavourite)
        })
        setIsExerciseFavourite(!isExerciseFavourite);
        return data;
        console.log("is Favourite : " + data)
    }

    return (
        <div className={"exercise-element-container"}>
            <div className={`exercise-element`}>{props.exercise.exerciseName}</div>
            <div className={`exercise-element`}>{props.exercise.difficult}</div>
            <div className={`exercise-element`}>{props.exercise.category}</div>
            <div className={`exercise-element`}>{props.exercise.equipment ? 'Wymagane' : "Nie wymagane"}</div>
            <div className={`exercise-element`}><button onClick={()=>addExerciseFavourite()} className={`exercise-like-btn`}>{isExerciseFavourite ? "-" : "+"}</button></div>
        </div>
    )
}