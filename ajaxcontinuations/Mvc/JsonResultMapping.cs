using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace ajaxcontinuations.Mvc
{
    public class JsonResultMapping : IGenericResultMapping
    {
        private static readonly JsonSerializerSettings JSONSettings = new JsonSerializerSettings { Converters = new JsonConverter[] { new IsoDateTimeConverter(), new StringEnumConverter() }, ContractResolver = new CamelCasePropertyNamesContractResolver() };

        public void Execute(GenericResult genericResult, ControllerContext controllerContext)
        {
            var request = controllerContext.HttpContext.Request;
            var response = controllerContext.HttpContext.Response;

            if (request.Headers["X-Correlation-Id"] != null)
                response.Headers.Add("X-Correlation-Id", request.Headers["X-Correlation-Id"]);

            response.ContentType = MimeType.JSON;
            response.Write(JsonConvert.SerializeObject(genericResult.ToDictionary(), Formatting.None, JSONSettings));
        }
    }
}