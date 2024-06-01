import IUserMagageData from "../../../Interfaces/Admin/Nowy folder/IUserManageData";
import ManageUserListElement from "../manageUserListElement/ManageUserListElement";

import "./ManageUserListStyle.scss";

export default function ManageUserList(props: { userList: IUserMagageData[]}) {


    return (
        <div className={`manage-user-component`}>
            <div className={`manage-user-list-head-element`}>
                <div className={`username`}>
                 Login
                </div>

                <div className={`username`}>
                    Imie
                </div>

                <div className={`username`}>
                    Nazwisko
                </div>

                <div className={`username`}>
                    Emali
                </div>

                <div>Status uzytkownika</div>
                {/*<div>Usun konto uzytkownika</div>*/}
            </div>
            {props.userList.map((element, key) => (
                <ManageUserListElement key={key} user={element} / >
            ))}
        </div>
    )
}