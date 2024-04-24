import { useEffect } from "react"
import "./UserExercisesComponentStyle.css"
import { ENDPOINT, LINK } from "../../ENDPOINTS"

export default function ShowExercisePlanHistory() {

    useEffect(() => {
        fetchData();
    }, []) 

    const fetchData = async () => {
        const url = `${LINK}${ENDPOINT.USERDATA.GETUSEREXERCISESPLAN.replace('{UserId}', '1')}`;
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
                throw new Error("GETUSEREXERCISESPLAN");
            }
        }).then(data => { console.log(data) })
    }

    return (
        <div className={`user-exercises-history-container`}>
         
        </div>
    )
}