using ClassLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.ModelBinding;
using System.Text.Json;
using System.Reflection;

namespace WebApplication {
    public class IngredientsController : ApiController {

        public HttpResponseMessage Get() {
            bool status = false;
            string error = "";
            List<object> values = new List<object>();
            try {
                DishDB db = new DishDB();
                List<Ingredient> ingredients = db.Ingredients.ToList();
                foreach (Ingredient ing in ingredients) {
                    values.Add(new {
                        id = ing.id,
                        name = ing.name,
                        image = ing.image,
                        calories = ing.calories,
                    });
                }
                if (ingredients.Count > 0) {
                    status = true;
                } else {
                    throw new Exception("no ingredients found.");
                }
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
                    ingredients = values
                }
            };
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Content = new StringContent(JsonSerializer.Serialize(result), Encoding.UTF8, "application/json");
            return response;
        }

        [HttpPost]
        public HttpResponseMessage Post([FromBody]dynamic value) {
            var formData = HttpContext.Current.Request.Form;
            Dictionary<string, dynamic> data = RequestHelpers.ConvertFormDataToDict(formData);
            Dictionary<string, dynamic> validation = Validator.Validate(typeof(Ingredient), data, RequestType.POST);

            bool status = validation["status"];
            Dictionary<string, string> errors = validation["errors"];
            Dictionary<string, dynamic> values = validation["values"];

            bool save = false;
            string errorSave = "";
            if (status) {
                try {
                    DishDB db = new DishDB();
                    Ingredient ingredientNew = new Ingredient();
                    foreach (string key in values.Keys) {
                        PropertyInfo prop = ingredientNew.GetType().GetProperty(key);
                        prop.SetValue(ingredientNew, values[key]);
                    }

                    db.Ingredients.Add(ingredientNew);
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