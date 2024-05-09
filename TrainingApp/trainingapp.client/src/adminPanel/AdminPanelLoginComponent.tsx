import React, { useEffect, useState } from "react"

import { ENDPOINT, LINK } from "../ENDPOINTS";
import { DEFAULT_HEADERS } from "../helper/DefaultHeaders";

import "./AdminPanelLoginComponent.scss";
import IAdminCredentials from "../Interfaces/Admin/IAdminLogin";
import IAnswerMessage from "../Interfaces/IAnswerMessage";
import { validateAdminLogin, validateAdminPassword } from "../components/Validation/Nowy folder/ValidateAdmin";
import IStatusMessage from "../Interfaces/Admin/IStatusMessage";
import DecodedTokenProperties from "../helper/DecodedToken";
import { IDecodedToken } from "../Interfaces/IDecodedToken";
export default function AdminPanelLoginComponent() {

    const [adminCredentials, setAdminCredentials] = useState<IAdminCredentials>({
        login: '',
        password: '',
    });

    const [adminLogin, setAdminLogin] = useState<string>('');
    const [adminPassword, setAdminPassword] = useState<string>('');

    const [errorLogin, setErrorLogin] = useState<boolean>(false);
    const [errorLoginMessage, setErrorLoginMessage] = useState<string>("");

    const [errorPassword, setErrorPassword] = useState<boolean>(false);
    const [errorPasswordMessage, setErrorPasswordMessage] = useState<string>("");

    const [errorLoginAdminMessage, setErrorLoginAdminMessage] = useState<string>('');

    useEffect(() => {
        checkExistsAdminToken();
    }, [])

    const checkExistsAdminToken = () => {
        console.log('check tokenb')
        const token: IDecodedToken = DecodedTokenProperties();
        if (token != null && token.accountType == 'Admin') {
            window.location.href = '/admin/adminMainPage'
        }
    }

    const backToLoginUser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/';
    }

    const loginAdmin = async (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();


        const loginValidate: IAnswerMessage = validateAdminLogin(adminCredentials.login);
        const passwordValidate: IAnswerMessage = validateAdminPassword(adminCredentials.password);
        let flag = true;

        if (loginValidate.status) {
            setErrorLogin(true);
            setErrorLoginMessage(loginValidate.message);
            flag = false;
        }

        if (passwordValidate.status) {
            setErrorLogin(true);
            setErrorPasswordMessage(passwordValidate.message);
            flag = false;
        }

        const url = `${LINK}${ENDPOINT.ADMIN.LOGINADMIN}`;

        if (flag) {
            await fetch(url, {
                method: "POST",
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(adminCredentials)
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 409) {

                    return response.text();
                }
            }).then(data => {
                const statusMessage: IStatusMessage = data as IStatusMessage;

                if (statusMessage.statusCode === '0') {
                    localStorage.setItem('userToken', statusMessage.message);
                    window.location.href = '/admin/adminMainPage'
                } else if (statusMessage.statusCode === '2') {
                    setErrorLoginAdminMessage(statusMessage.message);
                }
              
            })
        }
    }

    const adminLoginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorLoginMessage('');
        setErrorLoginAdminMessage('');

        const inputValue: string = (e.target as HTMLInputElement).value;

        if (inputValue.length <= 30) {
            setAdminCredentials((prevValue) => ({
                ...prevValue,
                login: inputValue
            }));
        }
    }

    const adminPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorPasswordMessage('');
        setErrorLoginAdminMessage('');

        const inputValue: string = (e.target as HTMLInputElement).value;

        if (inputValue.length <= 30) {
            setAdminCredentials((prevValue) => ({
                ...prevValue,
                password: inputValue
            }));
        }
    }

    return (
        <div className={`admin-login-container`} onSubmit={loginAdmin}>

            <form className={`admin-login-form`}>
                <h2>Panel logowania administratora</h2>
                <div className={`admin-login-input-row`}>
                    <label className={`admin-login-label`}>Admin Login</label>
                    <input type={`text`} value={adminCredentials.login} onChange={(e) => adminLoginHandler(e)} />
                    <div className={`admin-panel-login-error`}>{errorLoginMessage}</div>
                </div>

                <div className={`admin-login-input-row`}>
                    <label>Admin Password</label>
                    <input type={`password`} value={adminCredentials.password} onChange={(e) => adminPasswordHandler(e)} />
                    <div className={`admin-panel-login-error`}>{errorPasswordMessage}</div>
                </div>
                <input className={`admin-login-btn`} type={`submit`} value={`Zaloguj sie`} />
                <button className={`admin-login-btn-user`} onClick={(e) => backToLoginUser(e)}>Logowanie uzytkownika</button>
                <div className={`admin-panel-login-error`}>{errorLoginAdminMessage}</div>
            </form>
        </div>
    )

}