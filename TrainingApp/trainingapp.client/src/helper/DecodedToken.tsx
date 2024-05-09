import { jwtDecode } from "jwt-decode";
import { IDecodedToken } from "../Interfaces/IDecodedToken";


export default function DecodedTokenProperties(): IDecodedToken {
    const token = localStorage.getItem('userToken');

    if (token != null) {
        const decodedToken = jwtDecode(token) as IDecodedToken;
        return decodedToken;
    }
    return {} as IDecodedToken;
}