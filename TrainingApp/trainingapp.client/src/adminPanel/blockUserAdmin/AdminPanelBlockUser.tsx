import { useState } from 'react'
import IBlockUserList from '../../Interfaces/Admin/IBlockUserList'

import './AdminPanelBlockUserStyle.scss'

export default function AdminPanelBlockUser() {
    const [userList, setUserList] = useState<IBlockUserList[]>();

    return (
        <div className={'block-user-container'}>
            <h2>Lista użytkowniko</h2>
            <div className={`block-user-list`}>

            </div>
        </div>
    )
}