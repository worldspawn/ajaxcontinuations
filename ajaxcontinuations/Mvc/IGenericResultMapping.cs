using System.Web.Mvc;

namespace ajaxcontinuations.Mvc
{
    public interface IGenericResultMapping
    {
        void Execute(GenericResult genericResult, ControllerContext controllerContext);
    }
}