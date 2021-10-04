/**
 * Prints menu object in a more readable form.
 * @param {*} menu menu object
 */
module.exports = (menu, restaurantName) => {
  console.log();
  console.log(
    `V ${menu.day}, ${menu.date} je v restauraci "${restaurantName}" menu následovní:`
  );
  console.log('  Polévky:');
  menu.soups.forEach((soup) =>
    console.log(`    ${soup.name} -- ${soup.price} Kč`)
  );
  console.log('  Hlavní jídla:');
  menu.meals.forEach((meal) =>
    console.log(`    ${meal.name} -- ${meal.price} Kč`)
  );
  console.log();
};
