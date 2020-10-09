using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace SkyserverCore.Models
{
    public class PlateModel
    {
        public PlateSurveyOptions plateSurveyOptions;

        public string surveySelected;
        public string sdssiSelected;
        public string segueSelected;
        public string bossSelected;
        public string apogeeSelected;

        public PlateModel()
        {
            plateSurveyOptions = new PlateSurveyOptions();
        }
    }

    public class PlateSurveyOptions
    {
        public PlateSurveyOptions()
        {
            sdssiOptions = new List<SelectListItem>();
            segueOptions = new List<SelectListItem>();
            bossOptions = new List<SelectListItem>();
            apogeeOptions = new List<SelectListItem>();
        }

        public List<SelectListItem> sdssiOptions;
        public List<SelectListItem> segueOptions;
        public List<SelectListItem> bossOptions;
        public List<SelectListItem> apogeeOptions;
    }
}
