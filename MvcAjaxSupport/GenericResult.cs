using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcAjaxSupport.Mapping;

namespace MvcAjaxSupport
{
    public class GenericResult : ActionResult
    {
        public GenericResult()
        {
            Data = new Dictionary<string, object>();
            Messages = new List<Message>();
        }

        public static GenericResultMappingProvider Mappings =  new GenericResultMappingProvider();
        public bool Refresh { get; set; }
        public IDictionary<string, object> Data { get; set; }
        public Uri RedirectUri { get; set; }
        public object Model { get; set; }
        public bool Success { get; set; }
        public string ResultName { get; set; }
        public IList<Message> Messages { get; set; }

        public static GenericResult CreateSuccess(string message = null)
        {
            return new GenericResult().SetSuccess(true).AddMessage(message, MessageCategory.Success);
        }

        public static GenericResult CreateFail(string message)
        {
            return new GenericResult().SetSuccess(false).AddMessage(message, MessageCategory.Error);
        }

        public static GenericResult CreateAccessDenied()
        {
            return new GenericResult().SetSuccess(false).AddMessage("You do not have permission to access the requested resource", MessageCategory.Error);
        }

        public GenericResult SetResultName(string name)
        {
            ResultName = name;
            return this;
        }

        public GenericResult SetRefresh(bool refresh)
        {
            Refresh = refresh;
            return this;
        }

        public GenericResult SetSuccess(bool success)
        {
            Success = success;
            return this;
        }

        public GenericResult AddMessage(string text, MessageCategory messageCategory)
        {
            Messages.Add(new Message(text, messageCategory));
            return this;
        }

        public GenericResult SetModel(object model)
        {
            Model = model;
            return this;
        }

        public GenericResult SetRedirectUri(Uri redirectUri)
        {
            RedirectUri = redirectUri;
            return this;
        }

        public IDictionary<string, object> ToDictionary()
        {
            var result = new Dictionary<string, object>(Data) { { "success", Success }, { "refresh", Refresh } };

            if (RedirectUri != null)
                result.Add("redirectUri", RedirectUri);

            if (Messages.Any())
                result.Add("messages", Messages);
            
            if (Model != null)
                result.Add("model", Model);

            if (ResultName != null)
                result.Add("resultName", ResultName);

            return result;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var request = context.HttpContext.Request;

            foreach (string type in request.AcceptTypes)
            {
                var mapping = Mappings.GetMapping(type.Split(new [] {';'}, StringSplitOptions.RemoveEmptyEntries)[0]);
                if (mapping != null)
                {
                    mapping.Execute(this, context);
                    return;
                }
            }

            var fallbackMapping = Mappings.GetMapping("*/*");
            if (fallbackMapping == null)
                throw new HttpException(406, "Not acceptable");

            fallbackMapping.Execute(this, context);
        }
    }
}