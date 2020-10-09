using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class SQLModel
    {
        public string cmd { get; set; }
        public format format { get; set; }
        public string TaskName { get; set; }
        public string ReturnHtml { get; set; }
        public string TableName { get; set; }
        public string syntax { get; set; }
        public string searchTool { get; set; }
        public string queryResults { get; set; }

    }
    public enum format
    {
        HTML,
        XML,
        CSV,
        JSON,
        VOTable,
        FITS,
        MyDB
    }
}
