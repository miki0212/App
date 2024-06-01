import { ReactEventHandler, useEffect, useState } from "react"
import IExercise from "../../Interfaces/IExercise";
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import UserExercisesListElementComponent from "./UserExercisesListElementComponent";

import "./UserAddExerciseComponentStyle.css"
import { jwtDecode } from "jwt-decode";
import INewExerciseInPlan from "../../Interfaces/INewExerciseInPlan";
import { json } from "node:stream/consumers";


export default function UserAddExerciseComponent(props: { isActiveAddExercise: boolean, setIsActiveAddExercise: any, getExercisesCalories : any }) {
    const [choosenExercise, setChoosenExercise] = useState<IExercise>();
    const [exercisesList, setExercisesList] = useState<IExercise[]>();
    const [repetitions, setRepetitions] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const [repeatExercise, setRepeatExercise] = useState(0);
    const [userId, setUserId] = useState(0);

    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('userToken');
    
        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken)
              
                setUserId(decodedToken.id as number);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
    })

    const searchExercisesByName = async (e: Event) => {
        setErrorMessage("");
        setChoosenExercise(null);
        setExercisesList(null);
        const inputValue = (e.target as HTMLInputElement).value;
        if (inputValue.length > 0 && inputValue.length <= 20) {
            const url = `${LINK}${ENDPOINT.USERDATA.GETEXERCISEBYNAME.replace('{searchString}', inputValue)}`;

            await fetch(url, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    //TODO
                    throw new Error('[UserAddExerciseComponent] : [searchExercisesByName] : ERROR')
                }
            }).then(data => {
                setExercisesList(data as IExercise[]);
                console.log(data);
            })
        }
    }

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');

        setRepeatExercise(newValue);
    };

    const addExerciseToPlan = async () => {
        if (repeatExercise === 0) {
            setErrorMessage("Podaj poprawna liczbe powtorzen !!!");
        }
        if (choosenExercise != null && userId != 0 && repeatExercise != 0) {

            const newExercise: INewExerciseInPlan = {
                exerciseId: choosenExercise.id,
                userId: userId,
                repeat: repeatExercise,
                date : '12/20/24'
            }

            console.log(newExercise)

            const url = `${LINK}${ENDPOINT.USERDATA.ADDUSEREXERCISESPLAN}`;
            await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                },
                body: JSON.stringify(newExercise)
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.error('[UserAddExerciseComponent] : [addExerciseToPlan] : ERROR')
                    throw new Error('[UserAddExerciseComponent] : [addExerciseToPlan] : ERROR')
                }
            }).then(data => {
                if (data == true) {
                    setStatusMessage("Dodano cwiczenie do listy")
                    setTimeout(() => {
                        setStatusMessage("")
                    }, 1500)
                }
                props.getExercisesCalories();
            })
        }
    }

    return (
        <div className={`add-exercise-container`} >
            <h2>Data : 04/21/2024 </h2>
            <h4>Wyszukaj cwiczenie</h4>

            <input className={'user-add-exercise-input-search'} type='text' placeholder={`Wyszukaj cwiczenie`} onChange={searchExercisesByName} />

            <div className={`user-exercises-list`}>
                {exercisesList?.length > 0 ?
                    exercisesList.map((element, index) => (
                        <UserExercisesListElementComponent key={index} exercise={element} choosenExercise={choosenExercise} setChoosenExercise={setChoosenExercise} />
                    ))
                     :
                    <>Brak cwiczen</>}
            </div>
            <div className={`user-add-exercises-repetitions-container`}>
                <input className={'user-add-exercises-repetions-input'} type={'text'} placeholder={`Liczba powtorzen`} value={repeatExercise} onChange={handleInputChange}></input>
            </div>
            <div className={`user-add-exercise-btn`}>
            <div>
                <button onClick={() => { addExerciseToPlan() }}>Dodaj</button>
                    <button onClick={() => { props.setIsActiveAddExercise(!props.isActiveAddExercise) }}>Anuluj</button>
                </div>
                <div className={`status-message-div`}>
                    {errorMessage}
                </div>
                <div className={`status-message-div`}>
                    {statusMessage}
                </div>
            </div>


        </div>
    )
}