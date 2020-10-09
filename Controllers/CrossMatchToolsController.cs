using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SkyserverCore.Models;
using SkyServerCore.Common;

using Microsoft.Extensions.Configuration;
using System.Net.Http;
using SkyserverCore.Common;

namespace SkyserverCore.Controllers
{
    public class CrossMatchToolsController : Controller
    {
        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;

        public CrossMatchToolsController(IConfiguration Configuration)
        {
            _configuration = Configuration;
        }

        public void setAuth()
        {
            UserAccess user = Authentication.TryUserLogin(HttpContext);
            ViewBag.GenericModel = new GenericModel() { AuthenticationURL_Login = globals.AuthenticationURL_Login, AuthenticationURL_Logout = globals.AuthenticationURL_Logout };
            ViewData["authURL"] = globals.AuthenticationURL_Login;
        }

        public IActionResult Index()
        {
            setAuth();
            return View();
        }

        public IActionResult ObjectCrossID()
        {
            setAuth();
            ViewData["name"] = "ObjectCrossID";
            return View();
        }


        [HttpPost]
        public ContentResult ObjectCrossID(ObjectCrossIDModel OCI)
        {
            ResponseREST rs = new ResponseREST();
            rs.ProcessRequestREST(Request, Response);
            string content = rs.getResult();
            string contentType = rs.getContentType();
            return new ContentResult
            {
                ContentType = contentType,
                Content = content
            };
        }

        [HttpGet]
        public IActionResult SkyQueryCrossMatch()
        {
            setAuth();
            SkyQueryCrossMatchModel model = new SkyQueryCrossMatchModel() { AuthenticationURL_Login = globals.AuthenticationURL_Login, skyQueryBaseUrl = globals.SkyQueryUrl };
            return View(model);
        }

        [HttpPost]
        public ContentResult SkyQueryCrossMatch(SkyQueryCrossMatchModel SQS)
        {
            ResponseREST rs = new ResponseREST();
            rs.ProcessRequestREST(Request, Response);
            string content = rs.getResult();
            string contentType = rs.getContentType();
            return new ContentResult
            {
                ContentType = contentType,
                Content = content
            };
        }


    }
}