
import { ReactEventHandler, useEffect, useState } from "react"
import { ENDPOINT, LINK } from "./../../../../ENDPOINTS";
import "./../../../mainPageUser/UserAddExerciseComponentStyle.css"
import { jwtDecode } from "jwt-decode";
import { json } from "node:stream/consumers";
import IMeal from "../../../../Interfaces/meal/IMeal";
import INewMealInHistory from "../../../../Interfaces/meal/INewMealInHistory";
import UserMealListElementComponent from "../userMealListElementComponent/UsermealListElementComponent";


export default function UserAddMealComponent(props: { isActiveAddMeal: boolean, setIsActiveAddMeal: any }) {
    const [chosenMeal, setChosenMeal] = useState<IMeal>();

    const [mealList, setMealList] = useState<IMeal[]>();
    //const [repetitions, setRepetitions] = useState(0);
    const [calories, setCalories] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    //const [repeatExercise, setRepeatExercise] = useState(0);
    const [userId, setUserId] = useState(0);

    const [statusMessage, setStatusMessage] = useState("");

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

    const searchExercisesByName = async (e: Event) => {
        setErrorMessage("");
        setChosenMeal(null);
        setMealList(null);

        const inputValue = (e.target as HTMLInputElement).value;
        if (inputValue.length > 0 && inputValue.length <= 20) {
            const url = `${LINK}${ENDPOINT.MEALS.GET_MEAL_BY_NAME.replace('{searchString}', inputValue)}`;

            await fetch(url, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    //TODO
                    throw new Error('[UserAddMealComponent] : [searchMealByName] : ERROR')
                }
            }).then(data => {
                setMealList(data as IMeal[]);
            })
        }
    }

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');

        setCalories(newValue);
    };

    const addMealToPlan = async () => {
        if (calories === 0) {
            setErrorMessage("Podaj poprawna wage jedzenia !!!");
        }

        if (chosenMeal != null && userId != 0 && calories != 0) {

            const currentDate = new Date();

            // Sformatuj datê na string w formacie "dd-MM-yyyy"
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Miesi¹ce s¹ indeksowane od 0
            const year = currentDate.getFullYear();

            const formattedDate: string = `${day}-${month}-${year}`;

            const newMeal: INewMealInHistory = {
                mealId : chosenMeal.id,
                userId: userId,
                weight: calories,
                date: formattedDate
            }

            const url = `${LINK}${ENDPOINT.MEALS.Add_User_Meal_History}`;
            await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                },
                body: JSON.stringify(newMeal)
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.error('[UserAddExerciseComponent] : [addExerciseToPlan] : ERROR')
                    throw new Error('[UserAddExerciseComponent] : [addExerciseToPlan] : ERROR')
                }
            }).then(data => {
                if (data == true) {
                    setStatusMessage("Dodano posilek do listy")
                    setTimeout(() => {
                        setStatusMessage("")
                    }, 1500)
                }
            })
        }
    }

    return (
        <div className={`add-exercise-container`} >
            <h4>Wyszukaj posilek</h4>

            <input className={'user-add-exercise-input-search'} type='text' placeholder={`Wyszukaj jedzenie`} onChange={searchExercisesByName} />

            <div className={`user-exercises-list`}>
                {mealList?.length > 0 ?
                    mealList.map((element, index) => (
                        <UserMealListElementComponent key={index} meal={element} chosenMeal={chosenMeal} setChosenMeal={setChosenMeal} />
                    ))
                    :
                    <>Brak cwiczen</>}
            </div>
            <div className={`user-add-exercises-repetitions-container`}>
            Podaj wage jedzenia
                <input className={'user-add-exercises-repetions-input'} type={'text'} placeholder={`Waga jedzenia`} value={calories} onChange={handleInputChange}></input>
            </div>
            <div className={`user-add-exercise-btn`}>
                <div>
                    <button onClick={() => { addMealToPlan() }}>Dodaj</button>
                    <button onClick={() => { props.setIsActiveAddMeal(!props.isActiveAddMeal) }}>Anuluj</button>
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