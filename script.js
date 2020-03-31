const submit = document.getElementById('submit');
const search = document.getElementById('search');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  singleMeal.innerHTML = '';

  // Get search term
  const term = search.value;
  console.log(term); // display content from input

  // Check if empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`) // fetch return a promise
      // Catch the promise with '.then' and give us a response.
      // Now we have to format this response to json with 'res.json' which return another promise
      .then(res => res.json())
      // So we do a second '.then' and that give us the data
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>The search results for '${term}' :</h2>`;

        // Check if meals exist with term of search
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>There is no search result, try again.</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
                <img src=${meal.strMealThumb} alt=${meal.strMeal} />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `
            )
            .join(''); // Now we need to display as a string because with map is looped through the array => add join('') method!!
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter something');
  }
}

// Event listeners
submit.addEventListener('submit', searchMeal);
