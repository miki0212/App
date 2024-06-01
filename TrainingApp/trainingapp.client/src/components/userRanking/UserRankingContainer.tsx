import { useEffect, useState } from "react"
import { IUserRankingList } from "../../Interfaces/IUserRankingList";
import { jwtDecode } from "jwt-decode";
import { ENDPOINT, LINK } from "../../ENDPOINTS";

import "./UserRankingContainer.scss"

export default function UserRankingContainer() {
    const [userRanking, setUserRanking] = useState<IUserRankingList>();
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token != null) {
            try {
                const decodedToken = jwtDecode(token);

                setUserId(decodedToken.id as number);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
    })

    useEffect(() => {
        if (userId != 0) {
            fetchRanking()
        }
    }, [userId])

    //useEffect(() => {
    //    console.log("USER RANKING")
    //    console.log(userRanking?.userRanking)
    //}, [userRanking])

    const fetchRanking = async () => {
        const url = `${LINK}${ENDPOINT.USERDATA.GET_EXERCISES_USER_RANKING.replace('{userId}', userId.toString())}`

        fetch(url, {
            method: "GET",
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
        }).then(data => {
            console.log(data)
            setUserRanking(data as IUserRankingList)
        })
    }

    return (
        <div className={`ranking-container`}>
            <div className={`ranking-content`}>
                <h3>Ranking Wykonanych Cwiczen</h3>
               
                <div className={`ranking-list`}>
                    <div className={`main-row`}>
                        <div>Pozycja</div>
                        <div>Login</div>
                        <div>Spalone kalorie</div>
                    </div>
                    {userRanking?.userRanking != undefined ? userRanking.userRanking.map((user, element) => (



                        <div className={
                            userRanking.myRank === element + 1
                                ? `row-my-place`
                                : element === 0
                                    ? `row row-gold`
                                    : element === 1
                                        ? `row row-silver`
                                        : element === 2
                                            ? `row row-brown`
                                            : `row`
                        } key={element}>
                            <div>{element + 1}</div>
                            <div>{user.login}</div>
                            <div>{user.calories}</div>
                        </div>
                    ))
                        : 'Ladowanie danych'
                    }
                    {userRanking?.myRank != undefined ? <div className={`user-rank`}>Jestes na pozycji : {userRanking.myRank}</div> : ''}
                </div>
            </div>
        </div>
    )
}