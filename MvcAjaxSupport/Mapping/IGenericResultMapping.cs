using System.Web.Mvc;

namespace MvcAjaxSupport.Mapping
{
    public interface IGenericResultMapping
    {
        void Execute(GenericResult genericResult, ControllerContext controllerContext);
    }
}