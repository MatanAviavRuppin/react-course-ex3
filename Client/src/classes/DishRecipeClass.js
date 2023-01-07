export default class DishRecipeClass {

     constructor(name, ingredients, time, cookingMethod, image, id) {
          this.name = name;
          this.ingredients = ingredients;
          this.time = time;
          this.cookingMethod = cookingMethod;
          this.image = image;
          this.id = id;
     }

     getTotalCalories() {
          let sum = 0;
          for (let i of this.ingredients) {
               sum += i.calories;
          }
          return sum;
     }
}
