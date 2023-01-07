using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary {
    public enum RequestType {
        GET = 0,
        POST = 1,
        PUT = 2,
        DELETE = 3
    }

    public static class RequestHelpers {

        public static Dictionary<string, dynamic> ConvertFormDataToDict(NameValueCollection formData) {
            Dictionary<string, dynamic> data = new Dictionary<string, dynamic>();
            foreach (string key in formData.AllKeys) {
                data.Add(key, formData[key]);
            }
            return data;
        }
    }
}
