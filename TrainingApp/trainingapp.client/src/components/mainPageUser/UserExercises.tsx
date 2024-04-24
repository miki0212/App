import ShowExercisePlanHistory from "./ShowExercisePlanHistory"
import "./UserExercisesComponentStyle.css"

export default function UserExercisesComponent(props: { isActiveAddExercise: boolean ,setIsActiveAddExercise}) {
    return (
        <div className={`user-exercises-container`}>
            <h2>Twoja lista cwiczen : </h2>
            <ShowExercisePlanHistory />
            <button onClick={() => props.setIsActiveAddExercise(!props.isActiveAddExercise)} className={`user-exercises-add-btn`}>Dodaj Cwiczenie</button>
        </div>
    )
}