using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class UserHistoryModel
    {
        public string datetimepicker1 { get; set; }
        public string datetimepicker2 { get; set; }
        public string NewDateSubmmitingSection { get; set; }
        public string settable { get; set; }
        public string searchtool3 { get; set; }
        public List<SelectListItem> ContentPlaceHolder1_ToolsContent_ToolsListBox { get; set; }
        public string ContentPlaceHolder1_ToolsContent_SearchParameters { get; set; }
        public string ContentPlaceHolder1_ToolsContent_RowsPerPageButton { get; set; }
        public string ContentPlaceHolder1_ToolsContent_GoToPageButton { get; set; }
        public string authURL { get; set; }
    }
}
