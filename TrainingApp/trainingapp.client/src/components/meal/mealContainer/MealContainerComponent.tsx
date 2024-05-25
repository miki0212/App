
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


	const getNextPage = async () => {
		setCurrentPage(currentPage+1)
	}
	const getPrevPage = async () => {
		setCurrentPage(currentPage - 1)
	}


	return (

		<>
			<div className={`meal-container`}>

				<h2>Lista posilkow</h2>
				<MealListContainerComponent page={currentPage} />
				<div className={`meal-container-btn`}>
					<button onClick={getPrevPage} > Poprzednia strona</button>
					<div>{currentPage} / {maxPage}</div>
					<button onClick={getNextPage}>Nastepna strona</button>
				</div>

			</div >
		</>
	)
}