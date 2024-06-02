const filterDishes = (dishes, filter) => {
  let filteredDishes = dishes.filter((dish) => {
    for (const key in filter) {
      if (dish[key].toString() !== filter[key].toString()) {
        return false;
      }
    }
    return true;
  });
  return filteredDishes;
};

export { filterDishes };
