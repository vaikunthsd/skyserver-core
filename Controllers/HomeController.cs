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
    public class HomeController : Controller
    {

        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;

        public HomeController(IConfiguration Configuration)
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
            ViewData["dataReleaseNumber"] = globals.ReleaseNumber;
            return View();
        }

        public IActionResult Generic()
        {
            setAuth();
            ViewData["Message"] = "Your application description page.";
            return View();
        }


        public IActionResult _DefaultBody()
        {
            return PartialView("_DefaultBody");
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult _Messages()
        {
            return PartialView("_Messages");
        }

        public IActionResult messagesAlerts()
        {
            return PartialView("messagesAlerts");
        }

        public IActionResult _Header()
        {
            return PartialView("_Header");
        }
        public IActionResult _SiteSearch()
        {
            return PartialView("_SiteSearch");
        }

        public IActionResult _Toolbar()
        {
            return PartialView("_Toolbar");
        }

        public IActionResult _Footer()
        {
            return PartialView("_Footer");
        }

        public IActionResult _Toolgrid()
        {
            return PartialView("_Toolgrid");
        }

        public IActionResult _MainNav()
        {
            return PartialView("_MainNav");
        }

        public IActionResult SQLSearchTool()
        {
            setAuth();
            SQLModel predefinedQuery = new SQLModel();
            predefinedQuery.cmd = "-- This query does a table JOIN between the imaging (PhotoObj) and spectra\n";
            predefinedQuery.cmd += "--(SpecObj) tables and includes the necessary columns in the SELECT to upload\n";
            predefinedQuery.cmd += "--the results to the SAS(Science Archive Server) for FITS file retrieval.\n";
            predefinedQuery.cmd += "SELECT TOP 10\n";
            predefinedQuery.cmd += "p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z,\n";
            predefinedQuery.cmd += "p.run, p.rerun, p.camcol, p.field,\n";
            predefinedQuery.cmd += "s.specobjid, s.class, s.z as redshift,\n";
            predefinedQuery.cmd += "s.plate, s.mjd, s.fiberid\n";
            predefinedQuery.cmd += "FROM PhotoObj AS p\n";
            predefinedQuery.cmd += "JOIN SpecObj AS s ON s.bestobjid = p.objid\n";
            predefinedQuery.cmd += "WHERE \n";
            predefinedQuery.cmd += "  p.u BETWEEN 0 AND 19.6\n";
            predefinedQuery.cmd += "  AND g BETWEEN 0 AND 20";
            return PartialView("SQLSearchTool", predefinedQuery);
        }
        [HttpPost]
        public ContentResult SQLSearchTool(SQLModel sql)
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


        public IActionResult RadialSearchTool()
        {
            setAuth();
            RadialModel predefinedValues = new RadialModel();
            predefinedValues.ra = "258.25";
            predefinedValues.dec = "64.05";
            predefinedValues.radius = "3";
            predefinedValues.max_u = 20;
            predefinedValues.max_g = 20;
            predefinedValues.max_r = 20;
            predefinedValues.max_i = 20;
            predefinedValues.max_z = 20;
            predefinedValues.max_j = 20;
            predefinedValues.max_h = 20;
            predefinedValues.max_k = 20;
            predefinedValues.limit = "10";
            return PartialView("RadialSearchTool", predefinedValues);
        }
        [HttpPost]
        public ContentResult RadialSearchTool(RadialModel radialSearch)
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
        public IActionResult RectangularSearchTool()
        {
            setAuth();
            RectModel predefinedValues = new RectModel();
            predefinedValues.min_ra = "258.2";
            predefinedValues.max_ra = "258.3";
            predefinedValues.min_dec = "64";
            predefinedValues.max_dec = "64.1";
            predefinedValues.max_u = 20;
            predefinedValues.max_g = 20;
            predefinedValues.max_r = 20;
            predefinedValues.max_i = 20;
            predefinedValues.max_z = 20;
            predefinedValues.max_j = 20;
            predefinedValues.max_h = 20;
            predefinedValues.max_k = 20;
            predefinedValues.limit = "10";
            return PartialView("RectangularSearchTool", predefinedValues);
        }
        [HttpPost]
        public ContentResult RectangularSearchTool(RectModel rectangularSearch)
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

        public IActionResult EZSearch()
        {
            setAuth();
            return PartialView("EZSearch");
        }
        public IActionResult SearchFormTool()
        {
            setAuth();
            return PartialView("SearchFormTool");
        }
        public IActionResult ImagingQuerySearchTool()
        {
            setAuth();
            IQSModel predefinedValues = new IQSModel();
            predefinedValues.radecTextarea = "ra,dec,sep \n 256.443154,58.0255,1.0 \n 29.94136,0.08930,1.0";
            predefinedValues.raMin = "10";
            predefinedValues.decMin = "0.20";
            predefinedValues.raMax = "10.2";
            predefinedValues.decMax = "0.22";
            predefinedValues.ra = "10";
            predefinedValues.dec = "0.2";
            predefinedValues.radius = "5.0";
            predefinedValues.proximityradius = "1.0";
            predefinedValues.limit = "50";
            return PartialView("ImagingQuerySearchTool", predefinedValues);
        }
        [HttpPost]
        public ContentResult ImagingQuerySearchTool(IQSModel IQS)
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
        public IActionResult SpectroQuerySearchTool()
        {
            setAuth();
            SQSModel model = new SQSModel();
            model.radecTextarea = "ra,dec,sep \n 256.443154,58.0255,1.0 \n 29.94136,0.08930,1.0";
            model.raMin = "10";
            model.decMin = "0.20";
            model.raMax = "10.2";
            model.decMax = "0.22";
            model.ra = "10";
            model.dec = "0.2";
            model.radius = "5.0";
            model.proximityradius = "1.0";
            model.limit = "50";
            return PartialView("SpectroQuerySearchTool", model);
        }
        [HttpPost]
        public ContentResult SpectroQuerySearchTool(SQSModel SQS)
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
        public IActionResult InfraredSpectroSearchTool()
        {
            setAuth();
            IRQS model = new IRQS();
            model.limit = "50";
            model.ra = "197.61445";
            model.dec = "18.43816";
            model.radius = "5.0";
            model.Lcenter = "330.6607";
            model.Bcenter = "80.2696";
            model.lbRadius = "5.0";
            return PartialView("InfraredSpectroSearchTool", model);
        }
        [HttpPost]
        public ContentResult InfraredSpectroSearchTool(IRQS ISQ)
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
        public IActionResult UserHistoryPage()
        {
            //  string Parameters = "TaskName=Skyserver.UserHistory&format=dataset&DoShowAllHistory=" + globals.doShowAllHistory.ToString() + "&limit=" + globals.topRowsDefault.ToString();
            // string requestURI = globals.UserHistoryWS;
            setAuth();
            ViewData["authURL"] = globals.AuthenticationURL_Login;
            ViewData["userHistoryUrl"] = globals.UserHistoryWS;
            ViewData["doShowAllHistory"] = globals.doShowAllHistory;
            ViewData["topRowsDefault"] = globals.topRowsDefault;

            return PartialView("UserHistoryPage");
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
            ViewData["scale"] = util.fmt(newscale,6,3).ToString();
            ViewData["width"] = util.fmt(arcminwidth,6,2).ToString();
            ViewData["height"] = util.fmt(arcminheight,6,2).ToString();
            ViewData["opt"] = opt;
            setAuth();
            return PartialView("PrintChart");
        }
        
        public PartialViewResult PrintList(string qscale, string page, string opt, string paste)
        {
            ViewData["dataReleaseNumber"] = globals.ReleaseNumber;
            return PartialView("PrintList");
        }        
    }
}