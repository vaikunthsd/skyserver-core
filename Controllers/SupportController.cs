using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using SkyserverCore.Models;
using SkyServerCore.Common;

using Microsoft.Extensions.Configuration;
using System.Net.Http;
using SkyserverCore.Common;


namespace SkyserverCore.Controllers
{
    public class SupportController : Controller
    {
        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;

        public SupportController(IConfiguration Configuration)
        {
            _configuration = Configuration;
        }

        public void setAuth()
        {
            UserAccess user = Authentication.TryUserLogin(HttpContext);
           ViewBag.GenericModel = new GenericModel() { AuthenticationURL_Login = globals.AuthenticationURL_Login, AuthenticationURL_Logout = globals.AuthenticationURL_Logout};
            ViewData["authURL"] = globals.AuthenticationURL_Login;
        }

        public IActionResult Index()
        {
            setAuth();
            return View();
        }

        public IActionResult contact()
        {
            setAuth();
            return View();
        }

        public IActionResult placeshome()
        {
            setAuth();
            return View();
        }

        public IActionResult realquery()
        {
            setAuth();
            return View();
        }

        public IActionResult sql_help()
        {
            setAuth();
            return View();
        }

        public IActionResult intro()
        {
            setAuth();
            return View();
        }

        public IActionResult SiteSearch()
        {
            setAuth();
            return View();
        }

        public IActionResult Sitemap()
        {
            setAuth();
            return View();
        }

        public IActionResult Styles()
        {
            setAuth();
            return View();
        }

        public IActionResult Search()
        {
            setAuth();
            ViewData["Message"] = "Your site search page.";
            return View();
        }
    }
}