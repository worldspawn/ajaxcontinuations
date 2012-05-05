using System.Web.Mvc;
using ajaxcontinuations.Mvc;

namespace MvcAjaxSupport.Mapping
{
    public interface IGenericResultMapping
    {
        void Execute(GenericResult genericResult, ControllerContext controllerContext);
    }
}