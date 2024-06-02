import React from "react";
import Filter from "../Filter/Filter";
import "./Filters.css";
import { useSelector } from "react-redux";

const Filters = () => {
  const countries = Array.from(
    new Set(
      useSelector((state) =>
        state.dishesList.dishes.map((dish) => dish.country)
      )
    )
  );
  const cook_times = Array.from(
    new Set(
      useSelector((state) =>
        state.dishesList.dishes.map((dish) => dish.cook_time)
      )
    )
  );
  const allergens = Array.from(
    new Set(
      useSelector((state) =>
        state.dishesList.dishes.map((dish) => dish.allergens).flat()
      )
    )
  );
  return (
    <div>
      <div className="smaller title">Filters</div>
      <div className="filters">
        <Filter
          color="#4f290861"
          display_name="Country"
          filter_key="country"
          options={countries}
        />
        <Filter
          color="#4f290861"
          display_name="Cooking time"
          filter_key="cook_time"
          options={cook_times}
        />
        <Filter
          color="#4f290861"
          display_name="Allergens"
          filter_key="allergens"
          options={allergens}
        />
      </div>
    </div>
  );
};

export default Filters;
