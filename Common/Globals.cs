using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.Extensions.Configuration;


namespace SkyServerCore.Common
{
    public class Globals
    {
        public const string PROPERTY_NAME = "SkyServer.Globals";
        public static IConfiguration Configuration { get; set; }

        private int releaseNumber;
        private string connectionString;
        //private string dbType;
        private string database;
        private string wsBaseUrl;
        private string wsSpechome;
        private string wsFilterhome;
        private double eqSearchRadius;
        private string access;
        private string dasUrlBase;
        private double visualRA;
        private double visualDec;
        private double visualScale;
        private long exploreDefault;
        private string sdssUrlBase;
        private string siteName;
        private string siteIcon;
        private string logURL;
        private string casJobs;
        private int defaultSpRerun;
        private int skyVersion;
        private string epoHelp;
        private string helpdesk;
        private string smtp;
        private string solarConnectionString;

        private string nDegrees;
        private string nObj;
        private string nStar;
        private string nGalaxy; //count from view galaxy
        private string nQuasar; //spectroscopic
        private string nSpec;
        private string nStarSpec;
        private string nStarNoSpec;
        private string nAsteroids; //unchanged for a while

        private double crossidRadius;
        private int defTimeout;		  // default timeout
        private int qaTimeout;		  // SkyQA.aspx (sdssQA) timeout
        private int sqlTimeout;		  // SQL search page timeout
        private int crossidTimeout;	  // crossid pages timeout
        private int formTimeout;		  // form query (IQS/SQS) timeout
        private int chartTimeout;	  // cutout service (finding chart etc.) timeout
        private int emacsTimeout;	  // special emacs timeout for RHL etc.
        private int rowLimit;		  // row limit on query results
        private int emacsRowLimit;	  // special row limit for RHL etc.
        private int queriesPerMinute;	  // number of queries per minute allowed from a given IP

        private string urlSolarSystemProj;
        private string urlProjRegister;

        private string apogeeSpectrumLink;
        private string apogeeFitsLink;
        private int timeoutSkyserverWS;

       

        /// <summary>
        /// 
        /// </summary>
        private string skyserverRESTservice;
        private string casjobsRESTapi;
        private string contentDataset;
        private string mangaUrlBase;

        private string ipHeaderName;
        private string refererHeaderName;

        private Boolean saveResponseToFile;
        private Boolean DoShowAllHistory;
        private int TopRowsDefault;
        private string authenticationUrl;
        private string authenticationUrl_Login="";
        private string authenticationUrl_Logout;

        private string skyQueryUrl;

        public string username
        {
            get;
            set;
        }

        public string CasjobsRESTapi {
            get {
                return casjobsRESTapi;
            }
        }
        public string SkyserverRESTservice {
            get { return skyserverRESTservice; }
        }

        public string AuthenticationURL
        {
            get { return authenticationUrl; }
        }
        public string AuthenticationURL_Login
        {
            get { return authenticationUrl_Login; }
        }
        public string AuthenticationURL_Logout
        {
            get { return authenticationUrl_Logout; }
        }

        public string SQLSearchWS
        {
            get { return skyserverRESTservice + "SearchTools/SqlSearch"; }
        }
        public string DatabaseSearchWS
        {
            get { return skyserverRESTservice + "SearchTools/DatabaseSearch"; }
        }

        public string RectangularSearchWS
        {
            get { return skyserverRESTservice + "SearchTools/RectangularSearch"; }
        }

        public string CrossIdWS
        {
            get { return skyserverRESTservice + "SearchTools/CrossIdSearch"; }
        }

        public string ExploreWS
        {
            get { return skyserverRESTservice + "SearchTools/ObjectSearch"; }
        }

        public string UserHistoryWS
        {
            get { return skyserverRESTservice + "SearchTools/UserHistory"; }
        }

        public string ConeWS
        {
            get { return skyserverRESTservice + "ConeSearch/ConeSearchService"; }
        }

        public string RadialSearchWS
        {
            get { return skyserverRESTservice + "SearchTools/RadialSearch"; }
        }
        /// <summary>
        /// These are Imaging Search Tool services
        /// </summary>
        public string ConeImaging
        {
            get { return skyserverRESTservice + "ImagingQuery/Cone"; }
        }
        public string RectangularImaging
        {
            get { return skyserverRESTservice + "ImagingQuery/Rectangular"; }
        }
        public string NoPositionImaging
        {
            get { return skyserverRESTservice + "ImagingQuery/NoPosition"; }
        }
        public string ProximityImaging
        {
            get { return skyserverRESTservice + "ImagingQuery/Proximity"; }
        }
        /// <summary>
        /// These are IRSpectraQuery Search Tool services
        /// </summary>
        public string ConeIRWS 
        {
            get { return skyserverRESTservice + "IRSpectraQuery/ConeIR"; }
        }
        public string GalacticIRWS
        {
            get { return skyserverRESTservice + "IRSpectraQuery/GalacticIR"; }
        }
        public string NoPositionIRWS 
        {
            get { return skyserverRESTservice + "IRSpectraQuery/NoPositionIR"; }
        }
        /// <summary>
        /// These are SpectroQuery Search Tool services
        /// </summary>
        public string ConeSpectroWS
        {
            get { return skyserverRESTservice + "SpectroQuery/ConeSpectro"; }
        }
        public string RectangularSpectroWS
        {
            get { return skyserverRESTservice + "SpectroQuery/RectangularSpectro"; }
        }
        public string NoPositionSpectroWS
        {
            get { return skyserverRESTservice + "SpectroQuery/NoPositionSpectro"; }
        }
        public string ProximitySpectroWS
        {
            get { return skyserverRESTservice + "SpectroQuery/ProximitySpectro"; }
        }

        /// SDSS Fields        
        public string FieldsArray
        {
            get { return skyserverRESTservice + "SDSSFields/FieldArray"; }
        }

        public string FieldArrayRect
        {
            get { return skyserverRESTservice + "SDSSFields/FieldArrayRect"; }
        }

        public string ListOfFields
        {
            get { return skyserverRESTservice + "SDSSFields/ListOfFields"; }
        }

        public string UrlOfFields
        {
            get { return skyserverRESTservice + "SDSSFields/UrlOfFields"; }
        }

        ///SIAP

        public string getSIAP
        {
            get { return skyserverRESTservice + "SIAP/getSIAP"; }
        }

        public string getSIAPInfo
        {
            get { return skyserverRESTservice + "SIAP/getSIAPInfo"; }
        }

        public string getAllSIAPInfo
        {
            get { return skyserverRESTservice + "SIAP/getAllSIAPInfo"; }
        }


        /****/

        public string SolarConnectionString
        {
            get { return solarConnectionString; }
        }

        public string UrlProjRegister
        {
            get { return urlProjRegister; }
        }

        public string UrlSolarSystemProj
        {
            get { return urlSolarSystemProj; }
        }

        public string WSSpecHome
        {
            get { return wsSpechome; }
        }

        public string WSFilterHome
        {
            get { return wsFilterhome; }
        }

        public double CrossidRadius
        {
            get { return crossidRadius; } 
        }

        public int DefTimeout
        {
            get { return defTimeout; }
        }

        public int QaTimeout
        {
            get { return qaTimeout; }
        }

        public int SqlTimeout
        {
            get { return sqlTimeout; }
        }

        public int CrossidTimeout
        {
            get { return crossidTimeout; }
        }

        public int FormTimeout
        {
            get { return formTimeout; }
        }

        public int ChartTimeout
        {
            get { return chartTimeout; }
        }

        public int EmacsTimeout
        {
            get { return emacsTimeout; }
        }

        public int EmacsRowLimit
        {
            get { return emacsRowLimit; }
        }

        public int QueriesPerMinute
        {
            get { return queriesPerMinute; }
        }

        public string NDegrees
        {
            get { return nDegrees; }
        }

        public string NObj
        { 
            get { return nObj; } 
        }

        public string NStar
        {
            get { return nStar; }
        }

        public string NGalaxy
        {
            get { return nGalaxy; }
        }

        public string NQuasar
        {
            get { return nQuasar; }
        }

        public string NSpec
        {
            get { return nSpec; }
        }

        public string NStarSpec
        {
            get { return nStarSpec; }
        }

        public string NStarNoSpec
        {
            get { return nStarNoSpec; }
        }

        public string NAsteroids
        {
            get { return nAsteroids; }
        }

        public string EpoHelp
        {
            get { return epoHelp; }
        }

        /*
        public string DbType
        {
            get { return "BEST"; }
        }
        */

        public string CasJobs
        {
            get { return casJobs; }
        }
        public string ContactUrl
        {
            get { return "http://skyserver.sdss.org/contact/?release=" + Release + "&helpdesk=" + helpdesk + "&smtp=" + smtp + "&epoHelp=" + epoHelp + "&subject=SkyServer+" + Release + "+issue:+"; }
        }
        public string LogUrl
        {
            get { return logURL; }
        }
        public string SiteName
        {
            get { return siteName; }
        }
        public string SiteIcon
        {
            get { return siteIcon; }
        }
        public string SdssUrlBase
        {
            get { return sdssUrlBase; }
        }

        public int ReleaseNumber
        {
            get { return releaseNumber; }
        }

        public string Release
        {
            get { return "DR" + releaseNumber; }
        }
       
        /*
        public string DBType
        {
            get { return dbType; }
        }
        */

        public string Database
        {
            get { return database; }
            //get { return DBType + Release; }
            //get { return "BESTTEST"; }
        }

        public string ConnectionString
        {
            get { return connectionString + "Initial Catalog=" + Database + ";"; }
        }

        public string WSBaseUrl
        {
            get { return wsBaseUrl + Release + "/"; }
        }

        public string WSGetJpegUrl
        {
            get { return skyserverRESTservice + "ImgCutout/getjpeg"; }
        }

        public string WSMetadataUrl
        {
            get { return skyserverRESTservice + "SearchTools/MetadataSearch"; }
        }

        public string WSSpecIdUrl
        {
            //TODO UPDATE WITH REAL
            get { return "http://test.preprod.skyserver.sdss.org/dr16/SkyServerWS/SearchTools/MetadataSearch?query=nearestspecobjid&objid="; }
        }

        public string WSSpecImgUrl
        {
            //TODO UPDATE WITH REAL
            get { return "http://skyserver.sdss.org/dr16/SkyServerWS/SearchTools/ObjectSearch?spec="; }
        }


        public string WSGetImage64
        {
            get { return skyserverRESTservice + "ImgCutout/getImage64"; }
        }

        public string WSGetCodecUrl
        {
            get { return skyserverRESTservice + "ImgCutout/getJpegCodec"; }
        }

        public double EqSearchRadius
        {
            get { return eqSearchRadius; }
        }

        public string Access
        {
            get { return access; }
        }

        public string DasUrlBase
        {
            get { return dasUrlBase; }
        }

        public string DasUrl
        {
            get { return DasUrlBase; }
        }

        public double VisualRA
        {
            get { return visualRA; }
        }

        public double VisualDec
        {
            get { return visualDec; }
        }

        public double VisualScale
        {
            get { return visualScale; }
        }

        public long ExploreDefault
        {
            get { return exploreDefault; }
        }

        public int RowLimit
        {
            get { return rowLimit; }
        }

        public string SdssUrl
        {
            get { return SdssUrlBase + "dr" + ReleaseNumber + "/"; }
        }

        public int DefaultSpRerun
        {
            get { return defaultSpRerun; }
        }

        public int SkyVersion
        {
            get { return skyVersion; }
        }

        public string ApogeeSpectrumLink
        {
            get { return apogeeSpectrumLink; }
        }

        public string ApogeeFitsLink
        {
            get { return apogeeFitsLink; }
        }

        public int TimeoutSkyserverWS
        {
            get { return timeoutSkyserverWS; }
        }

        public string ContentDataset
        {
            get { return contentDataset; }
        }

        public string MangaUrlBase
        {
            get { return mangaUrlBase; }
        }
        

        public string RefererHeaderName
        {
            get { return refererHeaderName; }
        }

        public string IpHeaderName
        {
            get { return ipHeaderName; }
        }

        public Boolean SaveResponseToFile
        {
            get { return saveResponseToFile; }
        }
        public Boolean doShowAllHistory
        {
            get { return DoShowAllHistory; }
        }
        public int topRowsDefault
        {
            get { return TopRowsDefault;  }
        }

        public String SkyQueryUrl
        {
            get { return skyQueryUrl; }
        }

        public Globals()
        {


            var builder = new ConfigurationBuilder()
                            .SetBasePath(Directory.GetCurrentDirectory())
                            .AddJsonFile("appsettings.json");
            Configuration = builder.Build();

            // Holds links to Data Releases for the header



            //var Configuration.GetSection("AppConfiguration") = System.Web.Configuration.WebConfigurationManager.Configuration.GetSection("AppConfiguration");

            this.authenticationUrl = Configuration.GetSection("AppConfiguration")["authenticationUrl"].EndsWith("/") ? Configuration.GetSection("AppConfiguration")["authenticationUrl"] : Configuration.GetSection("AppConfiguration")["authenticationUrl"] + "/";
            this.authenticationUrl_Login = Configuration.GetSection("AppConfiguration")["authenticationUrl.Login"].EndsWith("/") ? Configuration.GetSection("AppConfiguration")["authenticationUrl.Login"].TrimEnd('/') : Configuration.GetSection("AppConfiguration")["authenticationUrl.Login"];
            this.authenticationUrl_Logout = Configuration.GetSection("AppConfiguration")["authenticationUrl.Logout"].EndsWith("/") ? Configuration.GetSection("AppConfiguration")["authenticationUrl.Logout"].TrimEnd('/') : Configuration.GetSection("AppConfiguration")["authenticationUrl.Logout"];

            this.skyQueryUrl = Configuration.GetSection("AppConfiguration")["skyqueryUrl"].EndsWith("/") ? Configuration.GetSection("AppConfiguration")["skyqueryUrl"] : Configuration.GetSection("AppConfiguration")["skyqueryUrl"] + "/";

            this.contentDataset = "application/x-dataset";// – serialized .NET DataSet

            this.releaseNumber = int.Parse(Configuration["AppConfiguration:dataReleaseNumber"]);
            //this.dbType = Configuration.GetSection("AppConfiguration")["dbType"];
            this.connectionString = Configuration.GetSection("AppConfiguration")["connectionString"];
            this.wsBaseUrl = Configuration.GetSection("AppConfiguration")["wsBaseUrl"];
            this.eqSearchRadius = double.Parse(Configuration.GetSection("AppConfiguration")["eqSearchRadius"]);
            this.access = Configuration.GetSection("AppConfiguration")["access"];
            this.dasUrlBase = Configuration.GetSection("AppConfiguration")["dasUrlBase"];
            this.visualRA = double.Parse(Configuration.GetSection("AppConfiguration")["visualRA"]);
            this.visualDec = double.Parse(Configuration.GetSection("AppConfiguration")["visualDec"]);
            this.visualScale = double.Parse(Configuration.GetSection("AppConfiguration")["visualScale"]);
            this.exploreDefault = long.Parse(Configuration.GetSection("AppConfiguration")["exploreDefault"]);
            this.sdssUrlBase = Configuration.GetSection("AppConfiguration")["sdssUrlBase"];
            this.siteName = Configuration.GetSection("AppConfiguration")["siteName"];
            this.siteIcon = Configuration.GetSection("AppConfiguration")["siteIcon"];
            this.logURL = Configuration.GetSection("AppConfiguration")["logURL"];
            this.casJobs = Configuration.GetSection("AppConfiguration")["casJobs"];
            this.defaultSpRerun = int.Parse(Configuration.GetSection("AppConfiguration")["defaultSpRerun"]);
            this.skyVersion = int.Parse(Configuration.GetSection("AppConfiguration")["skyVersion"]);
            this.epoHelp = Configuration.GetSection("AppConfiguration")["epoHelp"];
            this.wsSpechome = Configuration.GetSection("AppConfiguration")["wsSpechome"];
            this.wsFilterhome = Configuration.GetSection("AppConfiguration")["wsFilterhome"];
            this.urlSolarSystemProj = Configuration.GetSection("AppConfiguration")["urlSolarSystemProj"];
            this.urlProjRegister = Configuration.GetSection("AppConfiguration")["urlProjRegister"];
            this.apogeeSpectrumLink = Configuration.GetSection("AppConfiguration")["apogeeSpectrumLink"];
            this.apogeeFitsLink = Configuration.GetSection("AppConfiguration")["apogeeFitsLink"];
            this.helpdesk = Configuration.GetSection("AppConfiguration")["helpdesk"];
            this.smtp = Configuration.GetSection("AppConfiguration")["smtp"];
            this.database = Configuration.GetSection("AppConfiguration")["database"];

            this.defTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["defTimeout"] ?? "600");
            this.qaTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["qaTimeout"] ?? "3600");
            this.sqlTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["sqlTimeout"] ?? "600");
            this.crossidTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["crossidTimeout"] ?? "1800");
            this.crossidRadius = double.Parse(Configuration.GetSection("AppConfiguration")["crossidRadius"] ?? "3.0");
            this.formTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["formTimeout"] ?? "600");
            this.chartTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["chartTimeout"] ?? "600");
            this.emacsTimeout = int.Parse(Configuration.GetSection("AppConfiguration")["emacsTimeout"] ?? "600");
            this.rowLimit = int.Parse(Configuration.GetSection("AppConfiguration")["rowLimit"] ?? "500000");
            this.emacsRowLimit = int.Parse(Configuration.GetSection("AppConfiguration")["emacsRowLimit"] ?? "500000");
            this.queriesPerMinute = int.Parse(Configuration.GetSection("AppConfiguration")["queriesPerMinute"] ?? "60");
            this.timeoutSkyserverWS = int.Parse(Configuration.GetSection("AppConfiguration")["TimeoutSkyserverWS"] ?? "100000");// time in milliseconds
            this.skyserverRESTservice = Configuration.GetSection("AppConfiguration")["restwebservice"];
            this.casjobsRESTapi = Configuration.GetSection("AppConfiguration")["casjobsRESTapi"];
            this.mangaUrlBase = Configuration.GetSection("AppConfiguration")["mangaUrlBase"];

            this.refererHeaderName = Configuration.GetSection("AppConfiguration")["RefererHeaderName"];
            this.ipHeaderName = Configuration.GetSection("AppConfiguration")["ipHeaderName"];
            this.saveResponseToFile = Boolean.Parse(Configuration.GetSection("AppConfiguration")["SaveResponseToFile"]);
            this.DoShowAllHistory = Boolean.Parse(Configuration.GetSection("AppConfiguration")["DoShowAllHistory"]);
            this.TopRowsDefault = Int32.Parse(Configuration.GetSection("AppConfiguration")["TopRowsDefault"]);


            if (releaseNumber == 8)
            {
                //DR7 values still in places
                nDegrees = "14555";
                nObj = "469 million";
                nStar = "261 million";
                nGalaxy = "208 million"; //count from view galaxy
                nQuasar = "130,300"; //spectroscopic
                nSpec = "1,843,200";
                nStarSpec = "600,967";
                nStarNoSpec = "260 million";
                nAsteroids = "200,000"; //unchanged for a while
            }
            else if (releaseNumber == 7)
            {
                nDegrees = "11663";
                nObj = "360 million";
                nStar = "180 million";
                nGalaxy = "175 million"; //count from view galaxy
                nQuasar = "121,363"; //class = 3 or 4
                nSpec = "1,640,960";
                nStarSpec = "464,301";
                nStarNoSpec = "179 million"; //count from view star
                nAsteroids = "200,000";
            }
            else if (releaseNumber == 6)
            {
                nDegrees = "8520";
                nObj = "300 million";
                nStar = "91 million";
                nGalaxy = "138 million";
                nQuasar = "104,140";
                nSpec = "1,163,520";
                nStarSpec = "154,925";
                nStarNoSpec = "90,617,060";
                nAsteroids = "200,000";
            }
            else if (releaseNumber == 5)
            {
                nDegrees = "8000";
                nObj = "220 million";
                nStar = "85 million";
                nGalaxy = "130 million";
                nQuasar = "60,000";
                nSpec = "750,000";
                nStarSpec = "63,000";
                nStarNoSpec = "84,937,000";
                nAsteroids = "200,000";
            }
            else if (releaseNumber == 4)
            {
                nDegrees = "6670";
                nObj = "180 million";
                nStar = "70 million";
                nGalaxy = "110 million";
                nQuasar = "60,000";
                nSpec = "600,000";
                nStarSpec = "52,000";
                nStarNoSpec = "69,948,000";
                nAsteroids = "200,000"; // update for new DR4 MOC
            }
            else if (releaseNumber == 3)
            {
                nDegrees = "5200";
                nObj = "140 million";
                nStar = "60 million";
                nGalaxy = "80 million";
                nQuasar = "50,000";
                nSpec = "500,000";
                nStarSpec = "42,000";
                nStarNoSpec = "59,958,000";
                nAsteroids = "200,000";
            }
            else if (releaseNumber == 2)
            {
                nDegrees = "3300";
                nObj = "90 million";
                nStar = "40 million";
                nGalaxy = "50 million";
                nQuasar = "35,000";
                nSpec = "300,000";
                nStarSpec = "30,000";
                nStarNoSpec = "39,970,000";
                nAsteroids = "130,000";
            }
            else if (releaseNumber == 1)
            {
                nDegrees = "2100";
                nObj = "70 million";
                nStar = "30 million";
                nGalaxy = "40 million";
                nQuasar = "18,000";
                nSpec = "150,000";
                nStarSpec = "17,000";
                nStarNoSpec = "29,983,000";
                nAsteroids = "60,000";
            }
            else
            {
                nDegrees = "2100";
                nObj = "14 million";
                nStar = "6 million";
                nGalaxy = "8 million";
                nQuasar = "4,500";
                nSpec = "50,000";
                nStarSpec = "4,000";
                nStarNoSpec = "5,996,000";
                nAsteroids = "10,000";
            }

            // All these settings are now in Web.config
            /*
            if (access == "public")
            {
                defTimeout = 600;
                qaTimeout = 3600;
                sqlTimeout = 600;
                crossidTimeout = 1800;
                crossidRadius = 3.0;
                formTimeout = 600;
                chartTimeout = 600;
                emacsTimeout = 600;
                rowLimit = 500000;
                emacsRowLimit = 500000;
                queriesPerMinute = 60;
            }
            else if (access == "collab")
            {
                defTimeout = 600;
                qaTimeout = 36000;
                sqlTimeout = 600;
                crossidTimeout = 3600;
                crossidRadius = 30.0;
                formTimeout = 3600;
                chartTimeout = 3600;
                emacsTimeout = 36000;
                rowLimit = 500000;
                emacsRowLimit = 50000000;
                queriesPerMinute = 60;
            }
            else
            {
                defTimeout = 600;
                qaTimeout = 18000;
                sqlTimeout = 600;
                crossidTimeout = 3600;
                crossidRadius = 3.0;
                formTimeout = 3600;
                chartTimeout = 3600;
                emacsTimeout = 3600;
                rowLimit = 500000;
                emacsRowLimit = 100000;
                queriesPerMinute = 60;
            }
            */
        }
    }
}
