import { useEffect, useState } from "react";
import IExercise from "../../Interfaces/IExercise";

import "./ExerciseElementStyle.css"
import { jwtDecode } from "jwt-decode";
import IExercisesFavourites from "../../Interfaces/IExercisesFavourites";
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import { json } from "react-router-dom";
import DecodedTokenProperties from "../../helper/DecodedToken";
import { IDecodedToken } from "../../Interfaces/IDecodedToken";

export default function ExerciseElementComponent(props: { exercise: IExercise }) {
    const [isExerciseFavourite, setIsExerciseFavourite] = useState(false);
    const [decodedToken, setDecodedToken] = useState();

    const [dtoExercisesFavourites, setDtoExercisesFavourites] = useState<IExercisesFavourites>();

    useEffect(() => {
        checkExercisesFavourites();
    }, [props.exercise])

    useEffect(() => {
        const decodedToken = DecodedTokenProperties();

        if (decodedToken != null) {
            const exercisesFavourites: IExercisesFavourites = {
                UserId: decodedToken.id,
                ExerciseId: props.exercise.id,
            }
            setDtoExercisesFavourites(exercisesFavourites);
        }
    }, [props.exercise])

    const checkExercisesFavourites = async () => {

        const decodedToken: IDecodedToken = DecodedTokenProperties();

        if (decodedToken != null) {

            const exercisesFavourites: IExercisesFavourites = {
                UserId: decodedToken.id,
                ExerciseId: props.exercise.id,
            }

            try {
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
                        return response.json();
                    } else {
                        console.error("[ExerciseElement][checkExercisesFavourites] [ERROR]")
                        throw new Error("[ExerciseElement][checkExercisesFavourites] [ERROR]");
                    }
                }).then(data => {

                    setIsExerciseFavourite(data);
                })

            } catch (e) {
                console.error("[ExerciseElement][checkExercisesFavourites] [ERROR]")
            }
        }
    }

    const addExerciseFavourite = () => {
        if (isExerciseFavourite) {
            addFavourite();
        } else {
            addFavourite();
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
                console.error("[ExerciseElement][addFavourite] [ERROR]")
            }
        }).then(data => {
            return data;
        })
        setIsExerciseFavourite(!isExerciseFavourite);
        return data;
    }

    return (
        <div className={"exercise-element-container"}>
            <div className={`exercise-element`}>{props.exercise.exerciseName}</div>
            <div className={`exercise-element`}>{props.exercise.difficult}</div>
            <div className={`exercise-element`}>{props.exercise.category}</div>
            <div className={`exercise-element`}>{props.exercise.equipment ? 'Wymagane' : "Nie wymagane"}</div>
            <div className={`exercise-element`}><button onClick={() => addExerciseFavourite()} className={`exercise-like-btn`}>{isExerciseFavourite ? "-" : "+"}</button></div>
        </div>
    )
}