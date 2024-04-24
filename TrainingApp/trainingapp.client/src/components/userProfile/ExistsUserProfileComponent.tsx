import { useState } from 'react'
import { IUserProfileData } from '../../Interfaces/UserProfileData'
import './ExistsUserProfileStyle.css'
export default function ExistsUserProfileComponent(props: { userProfileData: IUserProfileData }) {

    const [editData, setEdidtData] = useState(false);

    const [copyProfileData, setCopyProfileData] = useState<IUserProfileData>(props.userProfileData);

    const handleEditData = () => {
        setEdidtData(!editData);
    }

    return (
        <div className="profile-container">
            <div className="profile-image-container">
                <div className="profile-image">
                    USER IMAGE IN THE FUTURE
                </div>
                <div className="profile-basic-data-container">
                    <div className="profile-basic-data">
                        Imie : {props.userProfileData.name}
                    </div>
                    <div className="profile-basic-data">
                        Nazwisko :  {props.userProfileData.lastname}
                    </div>

                    
                </div>
            </div>

            <div className="profile-extends-data-container">
                <div className="profile-extends-data">
                    Wiek : {!editData ? props.userProfileData.age : <input className={`profile-input-edit-data`} value={copyProfileData.age}></input>}
                </div>

                <div className="profile-extends-data">
                    Waga : {!editData ? props.userProfileData.weight : <input className={`profile-input-edit-data`} value={copyProfileData.weight}></input>} kg
                </div>

                <div className="profile-extends-data">
                    Wzrost :  {!editData ? props.userProfileData.height : <input className={`profile-input-edit-data`} value={copyProfileData.height}></input>} cm
                </div>
                {editData ?
                    <div className={`profile-btn-edit-container`}>
                        <button className="profile-btn-edit-data" onClick={handleEditData}>Zapisz zmiany</button>
                        <button className="profile-btn-edit-data" onClick={handleEditData}>Anuluj zmiany</button>
                    </div>
            :
                    <button className="profile-btn-edit-data" onClick={handleEditData}>Edytuj dane</button>}
                
            </div>

        </div>
    )
}