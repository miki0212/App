import IExercise from "../../Interfaces/IExercise";

import "./UserExercisesListElementComponentStyle.css"

export default function UserExercisesListElementComponent(props: { exercise: IExercise, choosenExercise: IExercise, setChoosenExercise }) {

    return (
        <div className={`user-exercises-row ${props.exercise == props.choosenExercise ? 'user-exercies-choosen' : ''}`} onClick={() => props.setChoosenExercise(props.exercise)} >
            <div className={`user-exercises-list-element`}>{props.exercise.exerciseName}</div>
            <div className={`user-exercises-list-element`}>{props.exercise.category}</div>
            <div className={`user-exercises-list-element`}>{props.exercise.difficult}</div>
        </div>
    )
}