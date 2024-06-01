
import { useEffect, useState } from "react"
import MealListContainerComponent from "../mealListContainer/MealListContainerComponent"
import "./MealContainerComponent.scss"
import { DEFAULT_HEADERS } from "../../../helper/DefaultHeaders";
import { ENDPOINT, LINK } from "../../../ENDPOINTS";

export default function MealContainerComponent() {
	const [currentPage, setCurrentPage] = useState(1);

	const [maxPage, setMaxPage] = useState<number>(0)

	const [mealList, setMealList] = useState();

	const [isLoaded, setIsLoaded] = useState(false);

	const [mealName, setMealName] = useState('');

	useEffect(() => {
		getMaxMealPage();

		if (maxPage != 0) {
			setIsLoaded(true);

		}
	}, [])

	const getMaxMealPage = async () => {
		const url = `${LINK}${ENDPOINT.MEALS.GET_MEAL_MAX_PAGE}`;

		await fetch(url, {
			method: "GET",
			headers: DEFAULT_HEADERS
		}).then(response => {
			if (response.status === 200) {
				return response.text();
			}
		}).then(data => {
			setMaxPage(parseInt(data));
		})
	}

	useEffect(() => {
		if (mealName == '') {
			setCurrentPage(1)
			getMaxMealPage();
		}
	}, [mealName])


	const getNextPage = async () => {
		if (currentPage + 1 <= maxPage)
			setCurrentPage(currentPage+1)
	}
	const getPrevPage = async () => {
		if (currentPage-1 > 0)
		setCurrentPage(currentPage - 1)
	}


	return (

		<>
			<div className={`meal-container`}>

				<h2>Lista posilkow</h2>
				<input className={`meal-search-input`} type={`text`} placeholder={`Wyszukaj posilek`} onChange={(e) => setMealName((e.target as HTMLInputElement).value)}></input>
				<MealListContainerComponent searchMealName={mealName} page={currentPage} />
				{mealName == '' ?
					<div className={`meal-container-btn`}>
						<button onClick={getPrevPage} > Poprzednia strona</button>
						<div>{currentPage} / {maxPage}</div>
						<button onClick={getNextPage}>Nastepna strona</button>
					</div>
					:
					<></>}
			</div >
		</>
	)
}