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
  // console.log(term); // display content from input

  // Check if empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`) // fetch return a promise
      // Catch the promise with '.then' and give us a response.
      // Now we have to format this response to json with 'res.json' which return another promise
      .then(res => res.json())
      // So we do a second '.then' and that give us the data
      .then(data => {
        // console.log(data);
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
                <div class="meal-info" data-mealId="${meal.idMeal}">
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

// Fetch Meal by ID
function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      const meal = data.meals[0];
      console.log(meal);
      addMealToDOM(meal);
    });
}

// Add Meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src=${meal.strMealThumb} alt=${meal.strMeal} />
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
    </div>
    
  </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);

// Show Single Meal Page
mealsEl.addEventListener('click', e => {
  // go through all child element (item)
  const mealInfo = e.path.find(item => {
    // console.log(item);
    // check if there is a class
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  // console.log(mealInfo);

  // If mealInfo exist
  if (mealInfo) {
    // Keep the data-attribute (id) of mealInfo
    const mealId = mealInfo.getAttribute('data-mealid');
    // console.log(mealId); // 52934, 32532, ...
    // Get pass mealId into a function
    getMealById(mealId);
  }
});
