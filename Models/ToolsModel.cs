using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class ToolsModel
    {
        public class ToolsInfo
        {
            public string name { get; set; }

            public string url { get; set; }

            public string tooltip { get; set; }

            public string description { get; set; }

            public bool quicktool { get; set; }
        }

        public Dictionary<string, ToolsInfo> MenuItem { get; set; }
    }
}
