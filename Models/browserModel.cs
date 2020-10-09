using System;

namespace SkyserverCore.Models
{
    public class FunctionProcedureTable
    {
        public string TableName { get; set; }
        public Parameters[] Rows { get; set; }
    }

    public class Parameters
    {
        public string name { get; set; }
        public string description { get; set; }
        public string text { get; set; }
        public int rank { get; set; }
        public string name1 { get; set; }
        public string type { get; set; }
        public int length { get; set; }
        public string inout { get; set; }
        public int pnum { get; set; }
    }

    public class ViewTable
    {
        public string TableName { get; set; }
        public ViewDescription[] Rows { get; set; }
    }

    public class ViewDescription
    {
        public string description { get; set; }
        public string parent { get; set; }
    }

}