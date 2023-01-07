using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ClassLibrary;
using System.Text.Json;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Reflection;
using System.Web;

namespace WebApplication {
    public class RecipesController : ApiController {
        public HttpResponseMessage Get() {
            bool status = false;
            List<object> values = new List<object>();
            try {
                DishDB db = new DishDB();
                List<Recipe> recipes = db.Recipes.ToList();
                foreach (Recipe rec in recipes) {
                    List<object> ingredients = new List<object>();
                    foreach (Ingredient i in rec.Ingredients) {
                        ingredients.Add(new {
                            id = i.id,
                            name = i.name,
                            image = i.image,
                            calories = i.calories
                        });
                    }

                    var obj = new {
                        id = rec.id,
                        name = rec.name,
                        image = rec.image,
                        cookingMethod = rec.cookingMethod,
                        time = rec.time,
                        ingredients = ingredients
                    };
                    values.Add(obj);
                }
                status = true;
            } catch(Exception e) {
                status = false;
            }

            var result = new {
                reach = true,
                status = status,
                values = new {
                    recipes = values
                }
            };
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Content = new StringContent(JsonSerializer.Serialize(result), Encoding.UTF8, "application/json");
            return response;
        }

        public HttpResponseMessage Get(int id) {
            bool status = false;
            dynamic values = false;
            string error = "";
            try {
                DishDB db = new DishDB();
                Recipe recipe = db.Recipes.Where(r => r.id == id).FirstOrDefault();
                if (recipe == null) {
                    throw new Exception("recipe not found.");
                }
                List<object> ingredients = new List<object>();
                foreach (Ingredient ing in recipe.Ingredients) {
                    ingredients.Add(new {
                        id = ing.id,
                        name = ing.name,
                        image = ing.image,
                        calories = ing.calories
                    });
                }
                if (ingredients.Count == 0) {
                    throw new Exception("ingredients not found.");
                }
                values = new {
                    id = recipe.id,
                    name = recipe.name,
                    image = recipe.image,
                    cookingMethod = recipe.cookingMethod,
                    time = recipe.time,
                    ingredients = ingredients
                };
                status = true;
            }
            catch (Exception e) {
                status = false;
                error = e.Message;
            }

            var result = new {
                reach = true,
                status = status,
                error = error,
                values = new {
                    recipe = values
                }
            };

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Content = new StringContent(JsonSerializer.Serialize(result), Encoding.UTF8, "application/json");
            return response;
        }

        [HttpPost]
        public HttpResponseMessage Post([FromBody] dynamic value) {
            var formData = HttpContext.Current.Request.Form;
            Dictionary<string, dynamic> data = RequestHelpers.ConvertFormDataToDict(formData);
            Dictionary<string, dynamic> validation = Validator.Validate(typeof(Recipe), data, RequestType.POST);

            bool status = validation["status"];
            Dictionary<string, string> errors = validation["errors"];
            Dictionary<string, dynamic> values = validation["values"];

            bool save = false;
            string errorSave = "";
            if (status) {
                try {
                    DishDB db = new DishDB();

                    //check ingredients first
                    int[] ingredientsValues = (int[])values["ingredients"];
                    List<Ingredient> ingredients = db.Ingredients.Where(ing => ingredientsValues.Contains(ing.id)).ToList();
                    if (ingredients.Count != ingredientsValues.Length) {
                        throw new Exception("Failed to save changes in the database. Some ingredients not found");
                    }

                    Recipe recipeNew = new Recipe();
                    List<string> excludedKeys = new List<string>() { "ingredients" };
                    foreach (string key in values.Keys) {
                        if (!excludedKeys.Contains(key)) {
                            PropertyInfo prop = recipeNew.GetType().GetProperty(key);
                            prop.SetValue(recipeNew, values[key]);
                        }
                    }
                    recipeNew.Ingredients = ingredients;

                    db.Recipes.Add(recipeNew);
                    int affectedRows = db.SaveChanges();
                    if (affectedRows == 0) {
                        throw new Exception("Failed to save changes in the database");
                    }
                    save = true;
                } 
                catch(Exception e) {
                    save = false;
                    errorSave = e.Message;
                }
            }

            var result = new {
                reach = true,
                status = status,
                statusSave = save,
                errorSave = errorSave,
                errors = errors,
                values = values
            };
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Content = new StringContent(JsonSerializer.Serialize(result), Encoding.UTF8, "application/json");
            return response;
        }

    }
}