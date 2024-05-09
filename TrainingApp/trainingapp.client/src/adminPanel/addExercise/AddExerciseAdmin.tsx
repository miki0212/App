import { useEffect, useState } from "react"
import DecodedTokenProperties from "../../helper/DecodedToken";
import { IDecodedToken } from "../../Interfaces/IDecodedToken";
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import IStatusMessage from "../../Interfaces/Admin/IStatusMessage";
import IAdminPrivileges from "../../Interfaces/Admin/IAdminPrivileges";

import './AddExerciseAdminStyle.scss'
import INewAdminExercise from "../../Interfaces/Admin/INewAdminExercises";
import { DEFAULT_HEADERS } from "../../helper/DefaultHeaders";


export default function AddExerciseAdmin() {
    const [adminToken, setAdminToken] = useState<IDecodedToken>();
    const [adminPrivileges, setAdminPrivileges] = useState<IAdminPrivileges>();
    const [newExercise, setNewExercise] = useState<INewAdminExercise>({
        AdminId: adminToken ? parseInt(adminToken.id) : 0,
        ExerciseName: '',
        Calories: 0,
        Category: 'Strength',
        Difficult: 'Easy',
        Equipment: false,
    });

    //const [exerciseName, setExerciseName] = useState<string>();
    const [exerciseCategory, setExerciseCategory] = useState<string>();
    const [exerciseEquipment, setExerciseEquipment] = useState<string>();

    //Errors
    const [isExerciseError, setIsExerciseError] = useState(false)
    const [exerciseMessage, setExerciseMessage] = useState('')

    const [access, setAccess] = useState<boolean>(false);

    useEffect(() => {
        checkExistsAdminToken();
    }, [])

    useEffect(() => {
        checkAccess();
    }, [adminToken])

    const checkExistsAdminToken = () => {
        const token: IDecodedToken = DecodedTokenProperties();

        if (token != null && token.accountType === 'Admin') {
            setNewExercise(prevValue => ({
                ...prevValue,
                AdminId: parseInt(token.id)
            }))
            setAdminToken(token);
        } else {
            window.location.href = '/admin/login';
        }
    }

    const checkAccess = async () => {

        if (adminToken) {
            const url = `${LINK}${ENDPOINT.ADMIN.GETADMINPRIVILEGES.replace('{adminId}', adminToken.id)}`;

            await fetch(url, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.error('[MainAdminPage][getAdminPrivileges][ERROR]')
                    throw new Error('[MainAdminPage][getAdminPrivileges][ERROR]')
                }
            }).then(data => {
                console.log(data);
                const message = (data as IStatusMessage).message
                const adminPriv: IAdminPrivileges = JSON.parse(message);

                if (adminPriv.CreateExercise) {
                    setAccess(true)
                } else {
                    setAccess(false)
                }

                setAdminPrivileges(adminPriv);
            })
        }
    }

    const handleEquipmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExerciseMessage('');
        setIsExerciseError(false);

        let inputValue = false;
        if (event.target.value === '1') {
            inputValue = true;
        }
        setNewExercise(prevValue => ({
            ...prevValue,
            Equipment: inputValue
        }));
    };

    const handleDifficultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExerciseMessage('');
        setIsExerciseError(false);

        const inputValue = event.target.value;
        setNewExercise(prevValue => ({
            ...prevValue,
            Difficult: inputValue
        }));
    }

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExerciseMessage('');
        setIsExerciseError(false);

        const inputValue = event.target.value;
        setNewExercise(prevValue => ({
            ...prevValue,
            Category: inputValue
        }));
    }

    const handleExerciseNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExerciseMessage('');
        setIsExerciseError(false);

        const inputValue = event.target.value;
        setNewExercise(prevValue => ({
            ...prevValue,
            ExerciseName: inputValue
        }));
    }

    const handleCaloriersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExerciseMessage('');
        setIsExerciseError(false);

        const inputValue = e.target.value;
        const newValue = inputValue.replace(/[^0-9]/g, '');

        setNewExercise(prevValue => ({
            ...prevValue,
            Calories: parseInt(newValue)
        }));
    }

    const addNewExerciseHandler = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        let flag: boolean = true;
        if (newExercise.ExerciseName.length == 0) {
            setExerciseMessage('Podaj nazwe cwiczenia');
            flag = false;
            setIsExerciseError(true);
        }

        if (newExercise.Calories == 0) {
            flag = false;
        }

        if (flag) {
            const url = `${LINK}${ENDPOINT.ADMIN.ADD_ADMIN_EXERCISES}`
            await fetch(url, {
                method: "POST",
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(newExercise)
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.error(`[ADD_EXERCISE_ADMIN][addNewExerciseHandler][ERROR]`);
                    throw new Error(`[ADD_EXERCISE_ADMIN][addNewExerciseHandler][ERROR]`);
                }
            }).then(data => {
                const message: string = (data as IStatusMessage).message
                setIsExerciseError(false)
                setExerciseMessage(message);
            })
        }


    }

    return (
        <div className={`exercise-admin-container`}>
            {access ?
                <form onSubmit={(e) => addNewExerciseHandler(e)}>
                    <h2>Nowe Cwiczenie</h2>
                    <div className={'exercise-admin-row'}>
                        <label>Nazwa cwiczenia</label>
                        <input type='text' value={newExercise.ExerciseName} onChange={(e) => handleExerciseNameChange(e)}></input>
                    </div>
                    <div className={'exercise-admin-row'}>
                        <label>Trudnosc</label>
                        <select value={newExercise.Difficult} onChange={(e) => { handleDifficultChange(e) }}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div className={'exercise-admin-row'}>
                        <label>Kategoria</label>
                        <select value={newExercise.Category} onChange={(e) => { handleCategoryChange(e) }}>
                            <option>Strength</option>
                            <option>Core</option>
                            <option>Cardio</option>
                        </select>
                    </div>

                    <div className={'exercise-admin-row'}>
                        <label>Wymagany sprzet</label>
                        <div className={`exercise-admin-equipment-radio`}>
                            <input
                                id={`equipmentYes`}
                                type={'radio'}
                                name={'equipment'}
                                value={'1'}
                                checked={newExercise.Equipment === true}
                                onChange={(e) => handleEquipmentChange(e)}
                            />
                            <label htmlFor={`equipmentYes`}>Tak</label>
                        </div>
                        <div className={`exercise-admin-equipment-radio`}>
                            <input
                                id={`equipmentNo`}
                                type={'radio'}
                                name={'equipment'}
                                value={'0'}
                                checked={newExercise.Equipment === false}
                                onChange={(e) => handleEquipmentChange(e)}
                            />
                            <label htmlFor={`equipmentNo`}>Nie</label>
                        </div>
                    </div>

                    <div className={'exercise-admin-row'}>
                        <label>Splone Kalorie</label>
                        <input type='number' min={1} value={newExercise.Calories.toString()} onChange={(e) => handleCaloriersChange(e)} ></input>
                    </div>

                    <input className={`admin-new-exercise-btn`} type={`submit`} value={`Dodaj cwiczenie`} />
                    <div className={`${isExerciseError ? 'error-admin-message' : 'admin-message'} `}>
                        {exerciseMessage}
                    </div>
                </form>
                :
                <>
                    Nie masz uprawnien do dodawania cwiczen!!!
                </>

            }
        </div>
    )
}