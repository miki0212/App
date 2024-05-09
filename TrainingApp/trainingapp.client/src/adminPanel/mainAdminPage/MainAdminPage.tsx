import { useEffect, useState } from 'react'
import { IDecodedToken } from '../../Interfaces/IDecodedToken'
import DecodedTokenProperties from '../../helper/DecodedToken'
import IAdminPrivileges from '../../Interfaces/Admin/IAdminPrivileges';
import { ENDPOINT, LINK } from '../../ENDPOINTS';
import IStatusMessage from '../../Interfaces/Admin/IStatusMessage';

import './MainAdminPageStyle.scss'


export default function MainAdminPage() {
    const [adminToken, setAdminToken] = useState<IDecodedToken>();
    const [adminPrivileges, setAdminPrivileges] = useState<IAdminPrivileges>();

    useEffect(() => {
        checkExistsAdminToken();
    }, [])

    useEffect(() => {
        if (adminToken) {
            getAdminPrivileges();
        }
    }, [adminToken])

    const checkExistsAdminToken = () => {
        const token: IDecodedToken = DecodedTokenProperties();

        if (token != null && token.accountType === 'Admin') {
            setAdminToken(token);
        } else {
            window.location.href = '/admin/login';
        }
    }

    const getAdminPrivileges = async () => {
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
                setAdminPrivileges(adminPriv);
            })
        }
    }

    return (
        <div className={`admin-privileges-container`}>
            {adminPrivileges ?
                <div className={`admin-privileges-container-properties`}>
                    <h2>Twoje uprawnienia</h2>
                    <div className={`admin-privileges-value-row`}>
                        <div className={`admin-privileges-property`}>Dodawanie adminow</div>
                        <div className={`admin-privileges-value`}>{adminPrivileges.CreateAdmin ? 'Tak' : 'Nie'}</div>
                    </div>


                    <div className={`admin-privileges-value-row`}>
                        <div className={`admin-privileges-property`}>Blokowanie uzytkownika </div>
                        <div className={`admin-privileges-value`}>{adminPrivileges.BlockUser ? 'Tak' : 'Nie'}</div>
                    </div>
                    <div className={`admin-privileges-value-row`}>
                        <div className={`admin-privileges-property`}>Usuwanie konta uzytkownika </div>
                        <div className={`admin-privileges-value`}>{adminPrivileges.DeleteUserAccount ? 'Tak' : 'Nie'}</div>
                    </div>
                    <div className={`admin-privileges-value-row`}>
                        <div className={`admin-privileges-property`}>Edycja listy cwiczen </div>
                        <div className={`admin-privileges-value`}>{adminPrivileges.CreateExercise ? 'Tak' : 'Nie'}</div>
                    </div>
                    <div className={`admin-privileges-value-row`}>
                        <div className={`admin-privileges-property`}>Edycja listy posilkow </div>
                        <div className={`admin-privileges-value`}>{adminPrivileges.CreateMeal ? 'Tak' : 'Nie'}</div>
                    </div>
                </div>
                : <>Loading ... </>
            }
        </div>
    )
}