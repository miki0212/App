import { useEffect, useState } from "react";
import ManageUserList from "../manageUserList/ManageUserList";
import "./ManageUserComponentStyle.scss";
import { IDecodedToken } from "../../../Interfaces/IDecodedToken";
import IStatusMessage from "../../../Interfaces/Admin/IStatusMessage";
import IAdminPrivileges from "../../../Interfaces/Admin/IAdminPrivileges";
import { ENDPOINT, LINK } from "../../../ENDPOINTS";
import DecodedTokenProperties from "../../../helper/DecodedToken";
import IUserMagageData from "../../../Interfaces/Admin/Nowy folder/IUserManageData";

export default function ManageUserComponent() {

    const [adminToken, setAdminToken] = useState<IDecodedToken>();
    const [adminPrivileges, setAdminPrivileges] = useState<IAdminPrivileges>();
    const [acces, setAcces] = useState<boolean>(false);

    const [userList, setUserList] = useState<IUserMagageData[]>([])
    const [userCurrentPage, setUserCurrentPage] = useState<number>(1);
    const [userMaxPage, setUserMaxPage] = useState<number>(1);

    //FETCH USER DATA
    useEffect(() => {
        if (adminPrivileges?.BlockUser) {
            fetchUserData();
            getUserMaxPage();
        }
    }, [adminPrivileges])

    useEffect(() => {
        checkAccess();
    }, [adminToken]);

    useEffect(() => {
        if (adminPrivileges?.BlockUser) {
            fetchUserData();
            getUserMaxPage();
        }
    }, [userCurrentPage])

    useEffect(() => {
        checkExistsAdminToken();
    }, []);

    const getUserMaxPage = async () => {
        const url = `${LINK}${ENDPOINT.ADMIN.GET_MAX_USER_PAGE}`;

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
            console.log("MAX PAGE : "+  data);
            setUserMaxPage(data);
        })
    }
    const fetchUserData = async () => {
        const url = `${LINK}${ENDPOINT.ADMIN.GET_ADMIN_USER_LIST.replace('{pageNumber}', userCurrentPage.toString())}`;

        await fetch(url, {
            method: "GET",
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error('[ManageUserComponent][GET_ADMINU_USER_LIST][ERROR]')
                throw new Error('[ManageUserComponent][GET_ADMINU_USER_LIST][ERROR]')
            }
        }).then(data => {
            setUserList(data);
        })
    }

    const checkExistsAdminToken = () => {
        const token: IDecodedToken = DecodedTokenProperties();

        if (token != null && token.accountType === 'Admin') {
            //setNewExercise(prevValue => ({
            //    ...prevValue,
            //    AdminId: parseInt(token.id)
            //}))
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
                const message = (data as IStatusMessage).message
                const adminPriv: IAdminPrivileges = JSON.parse(message);

                if (adminPriv.CreateExercise) {
                    setAcces(true)
                } else {
                    setAcces(false)
                }

                setAdminPrivileges(adminPriv);
            })
        }
    }

    const getPrevPage = () => {
        if (userCurrentPage - 1 > 0)
            setUserCurrentPage(userCurrentPage - 1)
    }

    const getNextPage = () => {
        if (userCurrentPage + 1 <= userMaxPage)
        setUserCurrentPage(userCurrentPage+1)
    }

    return (
        <div className={`manage-user-component`}>
            <h2>Zarzadzaj uzytkownikami</h2>
            <ManageUserList userList={userList} />
            <div className={`btn-container`}>
                <button className={`btn-prev`} onClick={getPrevPage}>Poprzednia strona</button>
                {userCurrentPage} / {userMaxPage}
                <button className={`btn-next`} onClick={getNextPage}>Nastepna strona</button>
            </div>
        </div>
    )
}