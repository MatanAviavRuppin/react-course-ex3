using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary
{
    public partial class Recipe
    {
        public static Dictionary<string, string> InputLabels() {
            Dictionary<string, string> dict = new Dictionary<string, string>()
            {
                {"id", "Id"},
                {"name", "Name"},
                {"image", "Image"},
                {"cookingMethod", "Cooking Method"},
                {"time", "Cooking Time"},
                {"ingredients", "Ingredients"},
            };
            return dict;
        }

        public static Dictionary<string, dynamic> InputRules() {
            Dictionary<string, dynamic> dict = new Dictionary<string, dynamic>()
            {
                {
                    "id",
                    new Dictionary<string, dynamic>(){
                        {"minNumber", 0},
                        {"maxNumber", 999999},
                        {"required", true}
                    }
                },
                {
                    "name",
                    new Dictionary<string, dynamic>(){
                        {"minLength", 3},
                        {"maxLength", 40},
                        {"required", true}
                    }
                },
                {
                    "image",
                    new Dictionary<string, dynamic>(){
                        {"minLength", 10},
                        {"maxLength", 255},
                        {"required", true}
                    }
                },
                {
                    "cookingMethod",
                    new Dictionary<string, dynamic>(){
                        {"minLength", 3},
                        {"maxLength", 40},
                        {"required", true}
                    }
                },
                {
                    "time",
                    new Dictionary<string, dynamic>(){
                        {"minNumber", 1},
                        {"maxNumber", 60 * 12},
                        {"required", true}
                    }
                },
                {
                    "ingredients",
                    new Dictionary<string, dynamic>(){
                        {"required", true}
                    }
                },
            };
            return dict;
        }

        public static Dictionary<string, Type> InputTypesRules() {
            Dictionary<string, Type> dict = new Dictionary<string, Type>()
            {
                {"id", typeof(int)},
                {"name", typeof(string)},
                {"image", typeof(string)},
                {"cookingMethod", typeof(string)},
                {"time", typeof(double)},
                {"ingredients", typeof(int[])}
            };
            return dict;
        }

        public static Dictionary<string, dynamic> InputRestRules() {
            Dictionary<string, dynamic> dict = new Dictionary<string, dynamic>()
            {
                {
                    "id",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, true},
                        {RequestType.POST, false},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, true}
                    }
                },
                {
                    "name",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, false},
                        {RequestType.POST, true},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, false}
                    }
                },
                {
                    "image",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, false},
                        {RequestType.POST, true},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, false}
                    }
                },
                {
                    "cookingMethod",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, false},
                        {RequestType.POST, true},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, false}
                    }
                },
                {
                    "time",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, false},
                        {RequestType.POST, true},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, false}
                    }
                },
                {
                    "ingredients",
                    new Dictionary<RequestType, bool>(){
                        {RequestType.GET, false},
                        {RequestType.POST, true},
                        {RequestType.PUT, true},
                        {RequestType.DELETE, false}
                    }
                },
            };
            return dict;
        }
    }
}
