using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class RadialModel
    {
        public string ra { get; set; }
        public string dec { get; set; }
        public string radius { get; set; }
        public string searchTool { get; set; }
        public string TaskName { get; set; }
        public string ReturnHtml { get; set; }
        public whichphotometry whichphotometry { get; set; }
        public coordtype coordtype { get; set; }
        public format format { get; set; }
        public string TableName { get; set; }
        public string limit { get; set; }
        public bool check_u { get; set; }
        public float min_u { get; set; }
        public float max_u { get; set; }
        public bool check_g { get; set; }
        public float min_g { get; set; }
        public float max_g { get; set; }
        public bool check_r { get; set; }
        public float min_r { get; set; }
        public float max_r { get; set; }
        public bool check_i { get; set; }
        public float min_i { get; set; }
        public float max_i { get; set; }
        public bool check_z { get; set; }
        public float min_z { get; set; }
        public float max_z { get; set; }
        public bool check_j { get; set; }
        public float min_j { get; set; }
        public float max_j { get; set; }
        public bool check_h { get; set; }
        public float min_h { get; set; }
        public float max_h { get; set; }
        public bool check_k { get; set; }
        public float min_k { get; set; }
        public float max_k { get; set; }
    }
    public enum whichphotometry
    {
        optical,
        infrared
    }
    public enum coordtype
    {
        equatorial,
        galactic
    }
}
