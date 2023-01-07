using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary
{
    public partial class Ingredient
    {
        public static Dictionary<string, string> InputLabels() {
            Dictionary<string, string> dict = new Dictionary<string, string>()
            {
                {"id", "Id"},
                {"name", "Name"},
                {"image", "Image"},
                {"calories", "Calories"}
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
                        {"maxLength", 15},
                        {"required", true}
                    }
                },
                {
                    "phone",
                    new Dictionary<string, dynamic>(){
                        {"minLength", 9},
                        {"maxLength", 10},
                        {"isPhone", 10},
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
                    "calories", 
                    new Dictionary<string, dynamic>(){
                        {"minNumber", 0}, 
                        {"maxNumber", 5000},
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
                {"calories", typeof(double)}
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
                    "calories",
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
