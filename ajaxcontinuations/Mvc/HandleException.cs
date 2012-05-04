using System.Web;
using System.Web.Mvc;

namespace ajaxcontinuations.Mvc
{
    public class HandleException : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled)
                return;

            var result = GenericResult.CreateFail(filterContext.Exception.Message);
            filterContext.Result = result;
            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();

            var exception = filterContext.Exception as HttpException;
            string viewName = null;

            if (exception == null)
            {
                filterContext.HttpContext.Response.StatusCode = 500;
                viewName = "Error";
            }
            else
            {
                filterContext.HttpContext.Response.StatusCode = exception.GetHttpCode();
                viewName = "Error_" + filterContext.HttpContext.Response.StatusCode;
            }

            ViewEngineResult view = ViewEngines.Engines.FindView(filterContext.Controller.ControllerContext, viewName, null);
            if (view.View != null)
            {
                filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
                result.SetResultName(viewName);
            }
        }
    }
}