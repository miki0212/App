import { useEffect, useState } from 'react';
import IMeal from '../../../Interfaces/meal/IMeal';

import './MealListContainerComponent.scss';
import { ENDPOINT, LINK } from '../../../ENDPOINTS';
import { DEFAULT_HEADERS } from '../../../helper/DefaultHeaders';
import MealListItemComponent from '../mealListItem/MealListItemComponent';

export default function MealListContainerComponent(props: { page: number }) {
	const [mealList, setMealList] = useState<IMeal[]>([])

	useEffect(() => {
		fetchData();
	}, [])

	useEffect(() => {
		fetchData();
	}, [props.page])

	const fetchData = async () => {
		const url = `${LINK}${ENDPOINT.MEALS.GET_MEAL_PAGE.replace("{page}", props.page.toString())}`;

		await fetch(url, {
			method: "GET",
			headers: DEFAULT_HEADERS
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			} else {
				console.error("[MEAL_LIST_CONTAINER_COMPONENT][FETCH_DATA][ERROR]");
				throw new Error("[MEAL_LIST_CONTAINER_COMPONENT][FETCH_DATA][ERROR]");
			}
		}).then(data => {
			console.log(data)
			setMealList(data as IMeal[]);
		})
	}

	return (
		<div className={`meal-list-container`}>
			<div className={`main-row-meal-table`}>
				<div className={`meal-name-table`}>Nazwa posilku</div>
				<div>Kalorie</div>
				<div>Weglowodany</div>
				<div>Proteiny</div>
				<div>Tluszcz</div>
				<div>Blonnik</div>
			</div>
			{mealList.length > 0 ? (
				mealList.map((element, index) => (
					<MealListItemComponent key={index} meal={element} />
				))
			) : (
				<></>
			)}
		</div>
	)
}