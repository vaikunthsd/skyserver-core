using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class IQSModel
    {
        public string searchTool { get; set; }
        public string TaskName { get; set; }
        public string ReturnHtml { get; set; }
        public string raMin { get; set; }
        public string decMin { get; set; }
        public string raMax { get; set; }
        public string decMax { get; set; }
        public string ra { get; set; }
        public string dec { get; set; }
        public string radius { get; set; }
        public string proximityradius { get; set; }
        public string radecTextarea { get; set; }
        public IFormFile radecFilename { get; set; }
        public string uMin { get; set; }
        public string gMin { get; set; }
        public string rMin { get; set; }
        public string iMin { get; set; }
        public string zMin { get; set; }
        public string uMax { get; set; }
        public string gMax { get; set; }
        public string rMax { get; set; }
        public string iMax { get; set; }
        public string zMax { get; set; }
        public string ugMin { get; set; }
        public string grMin { get; set; }
        public string riMin { get; set; }
        public string izMin { get; set; }
        public string ugMax { get; set; }
        public string grMax { get; set; }
        public string riMax { get; set; }
        public string izMax { get; set; }
        public string minQA { get; set; }
        public format format { get; set; }
        public positionType positionType { get; set; }
        public searchNearBy searchNearBy { get; set; }
        public magType magType { get; set; }
        public objType objType { get; set; }
        public returnValue returnValue { get; set; }
        public string limit { get; set; }
        public string TableName { get; set; }
        public List<SelectListItem> imgparams { get; set; }
        public List<SelectListItem> specparams { get; set; }
        public List<SelectListItem> flagsOnList { get; set; }
        public List<SelectListItem> flagsOffList { get; set; }
    }
        public enum positionType
        {
            rectangular,
            cone,
            proximity,
            none,
            conelb,

        }
        public enum searchNearBy
        {
            nearest,
            nearby
        }
        public enum magType
        {
            model,
            petro,
            psf
        }
        public enum objType
        {
            doGalaxy,
            doSky,
            doStar,
            doUnknown
        }
        public enum returnValue
        {
            addQA
        }
}

