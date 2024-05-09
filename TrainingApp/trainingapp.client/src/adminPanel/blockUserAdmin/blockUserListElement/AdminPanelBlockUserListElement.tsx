import { useEffect, useState } from 'react'
import './AdminPanelBlockUserListElementStyle.scss'
import IAdminPrivileges from '../../../Interfaces/Admin/IAdminPrivileges';
import { ENDPOINT, LINK } from '../../../ENDPOINTS';
import { DEFAULT_HEADERS } from '../../../helper/DefaultHeaders';


export default function AdminPanelBlockUserListElement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const [adminPrivileges, setAdminPrivileges] = useState(false);

    useEffect(() => {

    }, [])

    const getAdminPrivilages = async () => {
        const url = `${LINK}${ENDPOINT.ADMIN.GETADMINPRIVILEGES.replace('{adminId}','1')}`

        await fetch(url, {
            method: "POST",
            headers: DEFAULT_HEADERS
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error(`[ADMIN_PANEL_BLOCK_USER_ELEMENT][GET_ADMIN_PRIVILEGES][ERROR]`)
                throw new Error(`[ADMIN_PANEL_BLOCK_USER_ELEMENT][GET_ADMIN_PRIVILEGES][ERROR]`)
            }
        })
    }



    return (
        <>
            <div></div>
        </>
    )
}