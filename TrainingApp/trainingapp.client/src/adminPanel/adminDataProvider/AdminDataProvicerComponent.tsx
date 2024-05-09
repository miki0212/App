import React, { useEffect, useState } from "react";
import { IDecodedToken } from "../../Interfaces/IDecodedToken";
import DecodedTokenProperties from "../../helper/DecodedToken";

//export default function AdminDataProviderComponent({ children }) {
//    const [adminToken, setAdminToken] = useState < IDecodedToken>();

//    useState(() => {
//        setAdminToken(DecodedTokenProperties());
//    })

//    return (
//        <MyContext.Provider value={sharedData}>
//            {children}
//        </MyContext.Provider>
//    );
//}
const AdminDataContext = React.createContext('');

export default function AdminDataProviderComponent({ children }) {
    const [adminToken, setAdminToken] = useState<IDecodedToken>({
        accountType: '',
        id: '',
        login:''
    });

    useEffect(() => {
        setAdminToken(DecodedTokenProperties());
    }, [])

    return <AdminDataContext.Provider value={adminToken}>{children}</AdminDataContext.Provider>;
}