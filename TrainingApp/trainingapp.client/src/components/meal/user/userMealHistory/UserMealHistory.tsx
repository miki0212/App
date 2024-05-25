//import ShowExercisePlanHistory from "./../../../mainPageUser/ShowExercisesPlanHistoryStyle.css"

import ShowMealHistory from "../showMealHistory/ShowMealHistory"
import "./../../../mainPageUser/UserExercisesComponentStyle.css"

export default function UserMealHistory(props: { isActiveAddMeal: boolean, setIsActiveAddMeal : any }) {
    return (
        <div className={`user-exercises-container`}>
            <h2>Twoja lista posilkow : </h2>
            <ShowMealHistory />
            {/*<ShowExercisePlanHistory />*/}
            <button onClick={() => props.setIsActiveAddMeal(!props.isActiveAddMeal)} className={`user-exercises-add-btn`}>Dodaj Posilek </button>
        </div>
    )
}