using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class IRQS
    {
        public string searchTool { get; set; }
        public string TaskName { get; set; }
        public string ReturnHtml { get; set; }
        public string limit { get; set; }
        public format format { get; set; }
        public string TableName { get; set; }
        public List<SelectListItem> irspecparams { get; set; }
        public positionType positionType { get; set; }
        public string ra { get; set; }
        public string dec { get; set; }
        public string radius { get; set; }
        public string Lcenter { get; set; }
        public string Bcenter { get; set; }
        public string lbRadius { get; set; }
        public string jMin { get; set; }
        public string hMin{ get; set; }
        public string kMin { get; set; }
        public string jMax { get; set; }
        public string hMax { get; set; }
        public string kMax { get; set; }
        public string jhMin { get; set; }
        public string hkMin { get; set; }
        public string jhMax { get; set; }
        public string hkMax { get; set; }
        public string snrMin { get; set; }
        public string vhelioMin { get; set; }
        public string scatterMin { get; set; }
        public string snrMax { get; set; }
        public string vhelioMax { get; set; }
        public string scatterMax { get; set; }
        public string tempMin { get; set; }
        public string loggMin { get; set; }
        public string fehMin { get; set; }
        public string afeMin { get; set; }
        public string tempMax { get; set; }
        public string loggMax { get; set; }
        public string fehMax { get; set; }
        public string afeMax { get; set; }
        public List<SelectListItem> irTargetFlagsOnList { get; set; }
        public List<SelectListItem> irTargetFlagsOffList { get; set; }
        public List<SelectListItem> irTargetFlags2OnList { get; set; }
        public List<SelectListItem> irTargetFlags2OffList { get; set; }
    }
}
