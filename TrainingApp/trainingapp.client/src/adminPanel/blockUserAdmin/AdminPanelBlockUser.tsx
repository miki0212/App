import { useState } from 'react'
import IBlockUserList from '../../Interfaces/Admin/IBlockUserList'

import './AdminPanelBlockUserStyle.scss'

export default function AdminPanelBlockUser() {
    const [userList, setUserList] = useState<IBlockUserList[]>();

    return (
        <div className={'block-user-container'}>
            <h2>Lista u¿ytkowniko</h2>
            <div className={`block-user-list`}>

            </div>
        </div>
    )
}