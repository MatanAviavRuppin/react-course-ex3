using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using System.Text.Json;
using System.ComponentModel;

namespace ClassLibrary {

    public static class Validator {

        public static Dictionary<string, dynamic> Validate(Type component, Dictionary<string, dynamic> data, RequestType type) {
            //methods in the component
            MethodInfo InputRulesMethod = component.GetMethod("InputRules");
            MethodInfo InputTypesRulesMethod = component.GetMethod("InputTypesRules");
            MethodInfo InputRestRulesMethod = component.GetMethod("InputRestRules");
            MethodInfo InputLabelsMethod = component.GetMethod("InputLabels");

            Dictionary<string, dynamic> InputRules = (Dictionary<string, dynamic>)InputRulesMethod.Invoke(null, null);
            Dictionary<string, Type> InputTypesRules = (Dictionary<string, Type>)InputTypesRulesMethod.Invoke(null, null);
            Dictionary<string, dynamic> InputRestRules = (Dictionary<string, dynamic>)InputRestRulesMethod.Invoke(null, null);
            Dictionary<string, string> InputLabels = (Dictionary<string, string>)InputLabelsMethod.Invoke(null, null);

            //track errors
            Dictionary<string, string> errors = new Dictionary<string, string>();
            Dictionary<string, dynamic> finalValues = new Dictionary<string, dynamic>();
            List<string> mandatoryKeys = new List<string>(); //name, image, calories

            //collect mandatory keys
            foreach (string key in InputRestRules.Keys) {
                Dictionary<RequestType, bool> keyRestRules = InputRestRules[key];
                if (keyRestRules[type]) {
                    mandatoryKeys.Add(key);
                }
            }

            //check if mandatory keys included in the form data
            bool status = true;
            foreach (string key in mandatoryKeys) {
                string keyLabel = InputLabels[key];
                if (!data.ContainsKey(key)) {
                    errors.Add(key, "* " + keyLabel + ": value is not included in the request.");
                    status = false;
                    continue;
                }

                Dictionary<string, dynamic> validityKeyCheck = Validator.IsValidatedKey(data[key], InputTypesRules[key], keyLabel, InputRules[key]);
                finalValues.Add(key, validityKeyCheck["value"]);
                if (!validityKeyCheck["status"]) {
                    errors.Add(key, validityKeyCheck["error"]);
                    status = false;
                    continue;
                }
            }
            return new Dictionary<string, dynamic>() {
                { "status", status },
                { "errors", errors },
                { "values", finalValues }
            };
        }

        public static Dictionary<string, dynamic> IsValidatedKey(dynamic value, Type type, string keyLabel, Dictionary<string, dynamic> rules) {
            bool status = true;
            bool loop = true;
            bool casting = true;
            string error = "";
            dynamic finalValue = null;

            if (value == "" && rules.Keys.Contains("required")) {
                status = false;
                error = "* " + keyLabel + ": value is required.";
                loop = false;
                casting = false;
            }
            else if (value == "" && !rules.Keys.Contains("required")) {
                status = true;
                loop = false;
                casting = false;
                finalValue = null;
            }

            if (casting) {
                try {
                    if (type == typeof(string)) {
                        value = Convert.ToString(value);
                    }
                    else if (type == typeof(double)) {
                        value = Convert.ToDouble(value);
                    }
                    else if (type == typeof(int)) {
                        value = Convert.ToInt32(value);
                    }
                    else if (type == typeof(int[])) {
                        value = JsonSerializer.Deserialize<int[]>(value);
                    }
                    finalValue = value;
                }
                catch (Exception e) {
                    status = false;
                    error = "* " + keyLabel + ": the value is not in allowed type.";
                    loop = false;
                }
            }
            
            if (loop) {
                foreach (string key in rules.Keys) {
                    if (key == "minNumber" && value < rules[key]) {
                        status = false;
                        error = "* " + keyLabel + ": minimum value is " + rules[key];
                        break;
                    }
                    if (key == "maxNumber" && value > rules[key]) {
                        status = false;
                        error = "* " + keyLabel + ": maximum value is " + rules[key];
                        break;
                    }
                    if (key == "minLength" && value.Length < rules[key]) {
                        status = false;
                        error = "* " + keyLabel + ": minimum length is " + rules[key];
                        break;
                    }
                    if (key == "maxLength" && value.Length > rules[key]) {
                        status = false;
                        error = "* " + keyLabel + ": maximum length is " + rules[key];
                        break;
                    }
                }
            }

            return new Dictionary<string, dynamic>() {
                { "status", status },
                { "error", error },
                { "value", finalValue }
            };
        }
    }
}
