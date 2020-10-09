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
    public class SearchToolsController : Controller
    {
        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;

        public SearchToolsController(IConfiguration Configuration)
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
        [HttpGet]
        public IActionResult sql()
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
            return PartialView("sql", predefinedQuery);
        }
        [HttpPost]
        public IActionResult sql(SQLModel sql)
        {
            setAuth();
            ResponseREST rs = new ResponseREST();
            rs.ProcessRequestREST(Request, Response);
            sql.queryResults = "<h4>Results</h4>" + rs.getResult();
            return PartialView("sql", sql);
        }

        public IActionResult ezsearch()
        {
            setAuth();
            return PartialView("ezsearch");
        }
        [HttpGet]
        public IActionResult rect()
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
            return PartialView("rect", predefinedValues);
        }
        [HttpPost]
        public ContentResult rect(RectModel rectangularSearch)
        {
            setAuth();
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
        public IActionResult radial()
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
            return PartialView("radial", predefinedValues);
        }
        [HttpPost]
        public ContentResult radial(RadialModel radialSearch)
        {
            setAuth();
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
        public IActionResult IQS()
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
            return PartialView("IQS", predefinedValues);
        }
        [HttpPost]
        public ContentResult IQS(IQSModel IQS)
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
        public IActionResult SQS()
        {
            setAuth();
            SQSModel predefinedValues = new SQSModel();
            predefinedValues.limit = "50";
            predefinedValues.raMin = "10";
            predefinedValues.raMax = "10.2";
            predefinedValues.ra = "10";
            predefinedValues.decMin = "0.20";
            predefinedValues.decMax = "0.22";
            predefinedValues.dec = "0.2";
            predefinedValues.radius = "5.0";
            predefinedValues.radiusDefault = "1.0";
            predefinedValues.radecTextarea = "ra,dec,sep \n 256.443154,58.0255,1.0 \n 29.94136,0.08930,1.0";
            ViewData["WSMetadataUrl"] = globals.WSMetadataUrl;
            return PartialView("SQS", predefinedValues);
        }
        [HttpPost]
        public ContentResult SQS(SQSModel SQS)
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
        public IActionResult IRQS()
        {
            setAuth();
            IRQS predefinedValues = new IRQS();
            predefinedValues.ra = "197.61445";
            predefinedValues.dec = "18.43816";
            predefinedValues.radius = "5.0";
            predefinedValues.Lcenter = "330.6607";
            predefinedValues.Bcenter = "80.2696";
            predefinedValues.lbRadius = "5.0";
            predefinedValues.limit = "50";
            return PartialView("IRQS", predefinedValues);
        }
        [HttpPost]
        public ContentResult IRQS(IRQS IRQS)
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