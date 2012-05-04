using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ajaxcontinuations.Mvc;

namespace ajaxcontinuations.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult TestPoint()
        {
            var model = new { Value = "Hello World!" };

            return GenericResult.CreateSuccess("This shit worked!").SetModel(model);
        }

        public ActionResult TestError()
        {
            throw new Exception("This is a test exception");
        }

        public ActionResult TestHttpError(int errorCode, string message = "test http error message")
        {
            throw new HttpException(errorCode, message);
        }
    }
}
