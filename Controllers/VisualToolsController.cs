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
    public class VisualToolsController : Controller
    {
        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;

        public VisualToolsController(IConfiguration Configuration)
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

        [HttpGet]
        public IActionResult navi()
        {
            setAuth();
            ViewData["jpegUrl"] = globals.WSGetJpegUrl;
            ViewData["WSGetImage64"] = globals.WSGetImage64;
            ViewData["WSMetadataUrl"] = globals.WSMetadataUrl;
            ViewData["specImgUrl"] = globals.WSSpecImgUrl;
            ViewData["ra"] = globals.VisualRA;
            ViewData["dec"] = globals.VisualDec;
            ViewData["scale"] = globals.VisualScale;
            ViewData["name"] = "navi";
            return PartialView("navi");
        }

        [HttpGet]
        public IActionResult chartinfo()
        {
            setAuth();
            ViewData["name"] = "chartinfo";
            ViewData["jpegUrl"] = globals.WSGetJpegUrl;
            ViewData["WSGetImage64"] = globals.WSGetImage64;
            ViewData["WSMetadataUrl"] = globals.WSMetadataUrl;
            ViewData["specImgUrl"] = globals.WSSpecImgUrl;
            ViewData["ra"] = globals.VisualRA;
            ViewData["dec"] = globals.VisualDec;
            ViewData["scale"] = globals.VisualScale;
            ViewData["name"] = "navi";
            return PartialView("chartinfo");
        }

        public PartialViewResult PrintChart(string ra, string dec, string scale, string width, string height, string opt)
        {
            Utilities util = new Utilities();
            float raInt = 0;
            float decInt = 0;
            float newscale = 0;
            float arcminwidth = 0;
            float arcminheight = 0;
            try
            {
                raInt = float.Parse(ra);
            }
            catch (FormatException)
            {
                Console.WriteLine($"Unable to parse '{ra}'");
            }
            try
            {
                decInt = float.Parse(dec);
            }
            catch (FormatException)
            {
                Console.WriteLine($"Unable to parse '{dec}'");
            }
            try
            {
                newscale = float.Parse(scale);
            }
            catch (FormatException)
            {
                Console.WriteLine($"Unable to parse '{newscale}'");
            }
            try
            {
                arcminwidth = float.Parse(width);
            }
            catch (FormatException)
            {
                Console.WriteLine($"Unable to parse '{arcminwidth}'");
            }
            try
            {
                arcminheight = float.Parse(height);
            }
            catch (FormatException)
            {
                Console.WriteLine($"Unable to parse '{arcminheight}'");
            }
            ViewData["dataReleaseNumber"] = globals.ReleaseNumber;
            ViewData["imageJpegUrl"] = globals.WSGetJpegUrl;
            ViewData["ra"] = util.hmsN(raInt).ToString();
            ViewData["dec"] = util.dmsN(decInt).ToString();
            ViewData["scale"] = util.fmt(newscale, 6, 3).ToString();
            ViewData["width"] = util.fmt(arcminwidth, 6, 2).ToString();
            ViewData["height"] = util.fmt(arcminheight, 6, 2).ToString();
            ViewData["opt"] = opt;
            setAuth();
            return PartialView("PrintChart");
        }

        public IActionResult quickobj()
        {
            setAuth();
            ViewData["name"] = "quickobj";
            return PartialView("quickobj");
        }

        public IActionResult obj(string specImgSrc)
        {
            setAuth();
            ViewData["name"] = "obj";
            return PartialView("obj");
        }

        public IActionResult list()
        {
            setAuth();
            listModel model = new listModel() { jpegUrl = globals.WSGetJpegUrl };
            model.paste =
              "name           ra        dec  \n"
            + "274-51913-230  159.815  -0.655\n"
            + "275-51910-275  161.051   0.152\n"
            + "275-51910-525  161.739   0.893\n"
            + "276-51909-19   164.090  -0.889\n"
            + "278-51900-39   168.470   0.004\n"

            + "278-51900-112  168.092  -0.255\n"
            + "278-51900-225  167.091  -0.216\n"
            + "278-51900-430  167.114   0.249\n"
            + "279-51984-456  168.956   0.860\n"
            + "279-51984-520  169.472  -0.007\n"

            + "281-51614-230 171.109  -0.427\n"
            + "282-51658-167 173.898  -0.585\n"
            + "285-51930-309 178.908  -0.771\n"
            + "286-51999-359 180.271   0.114\n"
            + "288-52000-173 184.837  -0.242\n"

            + "349-51699-582 255.537  64.206\n"
            + "353-51703-328 255.737  60.563\n"
            + "353-51703-365 256.157  60.585\n"
            + "355-51788-167 258.984  57.238\n"
            + "355-51788-563 260.121  58.797\n"

            + "358-51818-349 260.930  57.007\n"
            + "387-51791-72    0.744  0.142\n"
            + "389-51795-481   3.874  0.640\n"
            + "390-51900-196   5.183 -0.440\n"
            + "390-51900-464   5.432  0.296";

            return PartialView("list", model);
        }

        [HttpGet]
        public PartialViewResult ShowNearest()
        {
            setAuth();
            ViewData["jpegUrl"] = globals.WSGetJpegUrl;
            return PartialView("ShowNearest");
        }

    }
}