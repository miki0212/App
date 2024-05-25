import IMeal from "../../../../Interfaces/meal/IMeal";
/*import IExercise from "../../Interfaces/IExercise";*/

import "./../../../mainPageUser/UserAddExerciseComponentStyle.css"

export default function UserMealListElementComponent(props: { meal: IMeal, chosenMeal: IMeal, setChosenMeal : any}) {

    return (
        <div className={`user-exercises-row ${props.meal == props.chosenMeal ? 'user-exercies-choosen' : ''}`} onClick={() => props.setChosenMeal(props.meal)} >
            <div className={`user-exercises-list-element`}>{props.meal.mealName}</div>
            <div className={`user-exercises-list-element`}>{props.meal.calories.toFixed(2)}</div>
            {/*<div className={`user-exercises-list-element`}>{props.exercise.difficult}</div>*/}
        </div>
    )
}