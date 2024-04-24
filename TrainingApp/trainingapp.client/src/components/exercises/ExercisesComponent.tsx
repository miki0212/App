import { useEffect, useState } from "react"
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import IExercise from "../../Interfaces/IExercise";
import ExerciseElementComponent from "./ExerciseElement";


export default function ExercisesComponent() {
    //Exercises list
    const [exercisesList, setExercisesList] = useState<IExercise[]>([]);
    const [exercisesMaxPage, setExercisesMaxPage] = useState(1);
    const [exercisesCurrentPage, setexercisesCurrentPage] = useState(1);

    

    //Get first exercises page
    useEffect(() => {
        //GetMaxExercisesPage
        //const fetchdata = async () => {
        //    console.log("LINK ")
        //    const url = `${LINK}${ENDPOINT.USERDATA.GETEXERCISESMAXPAGE}`;
      
        //    await fetch(url, {
        //        method: "GET"
        //    }).then(response => {
         
        //        if (response.status == 200) {
        //            return response.json();
        //        } else {
        //            throw new Error("Get Max Exercises Page ERROR");
        //        }
        //    }).then(data => {
        //        console.log(data);
        //        setExercisesMaxPage(data);
        //    })
       
        //    if (exercisesMaxPage != 0) {
        //        const urlGetExercises = `${LINK}${ENDPOINT.USERDATA.GETEXERCISES.replace('{PageNumber}', exercisesCurrentPage.toString())}`;
        //        //Get Exercises list
        //        await fetch(urlGetExercises, {
        //            method: "GET",
        //        }).then(response => {
        //            if (response.status === 200) {
        //                return response.json();
        //            } else {
        //                //TODO 
        //                throw new Error("Get Exercises ERROR");
        //            }
        //        }).then(data => {
        //            console.log(data)
        //            setExercisesList(data);
        //        })
        //    }
        //}
        fetchdata();

        //Get
    }, [])
    useEffect(() => {
        fetchdata();
    }, [exercisesCurrentPage])

    const fetchdata = async () => {
        console.log("LINK ")
        const url = `${LINK}${ENDPOINT.USERDATA.GETEXERCISESMAXPAGE}`;

        await fetch(url, {
            method: "GET"
        }).then(response => {

            if (response.status == 200) {
                return response.json();
            } else {
                throw new Error("Get Max Exercises Page ERROR");
            }
        }).then(data => {
            setExercisesMaxPage(data);
        })

        if (exercisesMaxPage != 0) {
            const urlGetExercises = `${LINK}${ENDPOINT.USERDATA.GETEXERCISES.replace('{PageNumber}', exercisesCurrentPage.toString())}`;
            //Get Exercises list
            await fetch(urlGetExercises, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    //TODO 
                    throw new Error("Get Exercises ERROR");
                }
            }).then(data => {
                setExercisesList(data);
            })
        }
    }

    const searchByExerciseName = async (e: InputEvent) => {
        const inputValue = (e.target as HTMLInputElement).value
       
        if (inputValue.length > 3) {
            console.log('TEST')
            const url = `${LINK}${ENDPOINT.USERDATA.GETEXERCISEBYNAME.replace('{searchString}', inputValue)}`
            await fetch(url, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    //TODO
                    throw new Error('ERROR')
                }
            }).then(data => {
                setExercisesList(data as IExercise[]);
            })
        } else {
            fetchdata();
        }
    }

    const nextPage = () => {
        if (exercisesCurrentPage + 1 <= exercisesMaxPage)
            setexercisesCurrentPage(exercisesCurrentPage + 1);
    }
    const prevPage = () => {
        if (exercisesCurrentPage - 1 != 0)
            setexercisesCurrentPage(exercisesCurrentPage - 1);
    }


    return (
        <div className={`exercise-container`}>
            <div className={`exercise-change-btn-container `}>
                <button className={`exercise-btn`}>Lista Cwiczen</button>
                <button className={`exercise-btn`}>Ulubione Cwiczenia</button>
            </div>

            <input className={`exercise-search-input`} onChange={searchByExerciseName} type={`text`} placeholder={`Wyszukaj cwiczenia (min 3 znaki)`} />
            <div className={`header-list`}>
                <div className={`header-list-element`}>Nazwa cwiczenia</div>
                <div className={`header-list-element`}>Trudnosc</div>
                <div className={`header-list-element`}>Kategoria</div>
                <div className={`header-list-element`}>Wyposazenie</div>
                <div className={`header-list-element`}>Ulubione</div>
            </div>
            {exercisesList.length > 0 ?
                (exercisesList.map((exercise, index) =>
                    <ExerciseElementComponent key={index} exercise={exercise} />
                ))
                :
                <div>Error</div>
            }

            <div className={`exercise-buttons`}>
                <button className={`exercise-prev-btn`} onClick={prevPage}>Poprzednia</button>
                <div>{exercisesCurrentPage} / {exercisesMaxPage}</div>
                <button className={`exercise-next-btn`} onClick={nextPage}>Nastepna</button>
            </div>
        </div>
    )

}