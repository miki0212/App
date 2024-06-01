import { useEffect, useState } from "react";
import { ENDPOINT, LINK } from "../../../ENDPOINTS";
import IUserMagageData from "../../../Interfaces/Admin/Nowy folder/IUserManageData";
import { DEFAULT_HEADERS } from "../../../helper/DefaultHeaders";

import "./ManageUserListElement.scss";

export default function ManageUserListElement(props: { user: IUserMagageData }) {
    const [isBlock, setIsBlock] = useState<boolean>(props.user.IsBlocked)


    useEffect(() => {
        setIsBlock(props.user.IsBlocked);
    }, [props.user.IsBlocked])

    const blockUser = async () => {
        const url = `${LINK}${ENDPOINT.ADMIN.BLOCK_USER.replace('{userId}', props.user.Id.toString())}`;

        await fetch(url, {
            method: "GET",
            headers: DEFAULT_HEADERS
        }).then(response => {
            if (response.status === 200) {
                return response.text();
            } else {
                console.error('[ManageUserComponent][GET_ADMINU_USER_LIST][ERROR]')
                throw new Error('[ManageUserComponent][GET_ADMINU_USER_LIST][ERROR]')
            }
        }).then(data => {
            props.user.IsBlocked = !props.user.IsBlocked;
            setIsBlock(!isBlock);
        })
    }


    return (
        <div className={`manage-user-list-element`}>
            <div className={`username`}>
                {props.user.Login}
            </div>

            <div className={`username`}>
                {props.user.Imie}
            </div>

            <div className={`username`}>
                {props.user.Nazwisko}
            </div>

            <div className={`username`}>
                {props.user.Email}
            </div>

            <button onClick={blockUser}>{isBlock == true ? 'Odblokuj' : 'Zablokuj'}</button>
        </div>
    )
}