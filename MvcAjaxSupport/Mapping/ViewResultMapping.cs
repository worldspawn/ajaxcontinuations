using System.Linq;
using System.Web.Mvc;


namespace MvcAjaxSupport.Mapping
{
    public class ViewResultMapping : IGenericResultMapping
    {
        public void Execute(GenericResult genericResult, ControllerContext controllerContext)
        {
            if (genericResult.Refresh)
            {
                new RedirectResult(controllerContext.HttpContext.Request.RawUrl).ExecuteResult(controllerContext);
                return;
            }

            if (genericResult.RedirectUri != null)
            {
                new RedirectResult(genericResult.RedirectUri.ToString()).ExecuteResult(controllerContext);
                return;
            }

            var viewName = genericResult.ResultName ?? (string)controllerContext.RouteData.Values["action"];
            ViewEngineResult view = ViewEngines.Engines.FindView(controllerContext, viewName, null);
            if (view.View == null)
                return;
            
            var viewResult = new ViewResult();
            controllerContext.Controller.ViewData.Model = genericResult.Model;
            viewResult.ViewName = viewName;
            viewResult.ViewData = controllerContext.Controller.ViewData;
            viewResult.TempData = controllerContext.Controller.TempData;

            foreach (var message in genericResult.Messages.Where(m => m.Category == MessageCategory.Error))
                controllerContext.Controller.ViewData.ModelState.AddModelError(message.Field ?? message.Text, message.Text);

            viewResult.ExecuteResult(controllerContext);
        }
    }
}