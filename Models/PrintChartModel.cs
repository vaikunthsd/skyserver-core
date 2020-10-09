using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public class PrintChartModel
    {
        public double ra { get; set; }
        public double dec { get; set; }
        public double qscale { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public string opt { get; set; }
        public int def { get; set; }
        public string s { get; set; }
        public string dots { get; set; }
        public int newWidth { get; set; }
        public int newHeight { get; set; }
        public double newscale { get; set; }
        public double arcminwidth { get; set; }
        public double arcminheight { get; set; }
    }
}
