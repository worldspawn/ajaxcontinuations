using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using MvcAjaxSupport;
using MvcAjaxSupport.Filters;
using MvcAjaxSupport.Mapping;

namespace ajaxcontinuations
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleException());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            GenericResult.Mappings.AddResultMapping(new[] { "text/html", "application/xhtml+xml", "*/*" }, new ViewResultMapping());
            GenericResult.Mappings.AddResultMapping(new[] { "application/json" }, new JsonResultMapping());

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }
    }
}