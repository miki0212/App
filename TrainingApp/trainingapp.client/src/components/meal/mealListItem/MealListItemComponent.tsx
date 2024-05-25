

import { useEffect, useState } from 'react';
import IMeal from '../../../Interfaces/meal/IMeal';
import './MealListItemComponent.scss';

export default function MealListItemComponent(props: { meal: IMeal }) {
    const [mealElement, setMealElement] = useState<IMeal>(props.meal);

    useEffect(() => {
        setMealElement(props.meal)
    }, [props.meal])

    return (
        <div className={`meal-table-row`}>
            <div className={`meal-name-column`}> {mealElement.mealName}</div>
            <div> {mealElement.calories}</div>
            <div> {mealElement.carbohydrates}</div>
            <div> {mealElement.protein}</div>
            <div> {mealElement.fat}</div>
            <div> {mealElement.fiber}</div>
        </div>
    )
}