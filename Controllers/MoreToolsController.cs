using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using SkyserverCore.Models;
using SkyServerCore.Common;

using Microsoft.Extensions.Configuration;
using System.Net.Http;
using SkyserverCore.Common;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Text;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net;
using System.Runtime.Serialization.Formatters.Binary;
using System.Data;

namespace SkyserverCore.Controllers
{
    public class MoreToolsController : Controller
    {
        Globals globals = new Globals();
        private static readonly HttpClient client = new HttpClient();

        private IConfiguration _configuration;
        private readonly ITreeviewControl _treeviewControl;
        private readonly string TreeViewDataKey = "TreeViewData";
        private readonly string TreeViewOpenNodes = "TreeViewOpenNodes";

        public MoreToolsController(IConfiguration Configuration, ITreeviewControl treeViewControl)
        {
            _configuration = Configuration;
            _treeviewControl = treeViewControl;
        }
        public void setAuth()
        {
            UserAccess user = Authentication.TryUserLogin(HttpContext);
            ViewBag.GenericModel = new GenericModel() { AuthenticationURL_Login = globals.AuthenticationURL_Login, AuthenticationURL_Logout = globals.AuthenticationURL_Logout };
            ViewData["authURL"] = globals.AuthenticationURL_Login;
        }

        public IActionResult Index()
        {
            setAuth();
            return View();
        }
        public IActionResult UserHistory()
        {
            //  string Parameters = "TaskName=Skyserver.UserHistory&format=dataset&DoShowAllHistory=" + globals.doShowAllHistory.ToString() + "&limit=" + globals.topRowsDefault.ToString();
            // string requestURI = globals.UserHistoryWS;

            setAuth();

            ViewData["authURL"] = globals.AuthenticationURL_Login;
            ViewData["userHistoryUrl"] = globals.UserHistoryWS;
            ViewData["doShowAllHistory"] = globals.doShowAllHistory;
            ViewData["topRowsDefault"] = globals.topRowsDefault;

            return PartialView("UserHistory");
        }
        public IActionResult scrollhome()
        {
            setAuth();
            return PartialView("scrollhome");
        }
        public async Task<IActionResult> browser()
        {
            setAuth();

            var treeViewData = await _treeviewControl.GetSchemaBrowserList();
            ViewData[TreeViewDataKey] = JsonConvert.SerializeObject(treeViewData);
            HttpContext.Session.SetString(TreeViewDataKey, JsonConvert.SerializeObject(treeViewData));

            return PartialView("browser");
        }
        public IActionResult getimghome()
        {
            setAuth();
            return PartialView("getimghome");
        }
        public IActionResult fields()
        {
            setAuth();
            return PartialView("fields");
        }
        public IActionResult spectra()
        {
            setAuth();
            return PartialView("spectra");
        }
        public IActionResult plate()
        {
            setAuth();

            var plateModel = new PlateModel();

            // TODO: get options from API
            plateModel.plateSurveyOptions.apogeeOptions.AddRange(
                new SelectListItem[] {
                    new SelectListItem("10001/57372", "apogee.apo25m.s.r12.10001.57372"),
                    new SelectListItem("10001/57373", "apogee.apo25m.s.r12.10001.57373"),
                    new SelectListItem("fake data", "apogee.apo25m.s.r12.10001.57372")
                }
            );

            return PartialView("plate", plateModel);
        }

        [HttpPost]
        public async Task<JsonResult> GetPlate(PlateModel plateModel)
        {
            var surveySelected = plateModel.surveySelected;
            string queryString = "";

            if (surveySelected == "apogee")
            {
                //writePlateAPOGEE();
                queryString = "?plateIdApogee=" + plateModel.apogeeSelected + "&query=PlateAPOGEE&TaskName=Skyserver.GetImg.PlateAPOGEE&format=dataset";
            }
            else if (true)
            {
                queryString = "?plateIdApogee=" + "apogee.apo25m.s.r12.10001.57373" + "&query=PlateAPOGEE&TaskName=Skyserver.GetImg.PlateAPOGEE&format=dataset";
            }
            else
            {
                //writePlate();
            }

            Globals globals = new Globals();
            DataSet ds = new DataSet();

            // TODO: cant load .net4 datase
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetStreamAsync(globals.ExploreWS + queryString))
            //    {
            //        System.Runtime.Serialization.Formatters.Binary.BinaryFormatter fmt = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
            //        ds = (System.Data.DataSet)fmt.Deserialize(response);
            //    }
            //}

            // TODO: cant load .net4 dataset

            //System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)WebRequest.Create(globals.ExploreWS + Uri.EscapeUriString(queryString));
            //WebResponse resp = req.GetResponse();
            //BinaryFormatter fmt = new BinaryFormatter();
            //ds = (DataSet)fmt.Deserialize(resp.GetResponseStream());


            return Json("Plate information will be shown here");
        }

        #region Treeview methods

        // Generation tree by client (browser jstree) query 
        public JsonResult GetNodesJsTree(string id)
        {
            GetPaths();

            var treeViewObject = JsonConvert.DeserializeObject(HttpContext.Session.GetString(TreeViewDataKey));
            var treeViewData = (List<TreeViewData>)treeViewObject;

            (from d in treeViewData join o in TreeViewPathProvider.Instance().openedNodes on d.id equals o select d).ToList().ForEach(x => x.opened = true);

            var result = new List<TreeViewContainer>();

            result = (from d in treeViewData
                      where d.parent == id
                      select (new TreeViewContainer()
                      {
                          text = d.text,
                          id = d.id,
                          parent = null,
                          state = new { d.opened },
                          opened = d.opened,
                          a_attr = new { href = "/" + d.id, }
                      }).AddChildrens(treeViewData, 0)).ToList();

            return Json(result);
        }
        private void GetPaths()
        {
            // getting string with opened nodes fron Session
            if (!HttpContext.Session.Keys.Contains(TreeViewOpenNodes))
            {
                HttpContext.Session.SetString(TreeViewOpenNodes, "");
            }
            // save string in TreeViewPathProvider, and making string array with id`s of opened nodes
            TreeViewPathProvider.Instance().OpenNodesString = HttpContext.Session.GetString(TreeViewOpenNodes);
        }
        private void SavePaths()
        {
            HttpContext.Session.SetString(TreeViewOpenNodes, TreeViewPathProvider.Instance().OpenNodesString);
        }
        public void CloseNode(string id)
        {
            // handle event of closing tree node
            TreeViewPathProvider.Instance().DelNode(id);
            SavePaths();
        }
        public void OpenNode(string id)
        {
            var treeViewData = JsonConvert.DeserializeObject<List<TreeViewData>>(HttpContext.Session.GetString(TreeViewDataKey));

            string parid = treeViewData.Where(d => d.id == id).Single().parent;
            TreeViewPathProvider.Instance().AddNode(parid, id);
            SavePaths();
        }

        [HttpPost]
        public async Task<IActionResult> Node(string parentId, string id)
        {
            var apiCalls = new SortedDictionary<CallType, ApiCall>();
            var htmlResponse = new StringBuilder();
            bool createFirstRowLink = false;

            apiCalls[CallType.table] = new ApiCall("html");

            if (parentId == "#")
            {
                createFirstRowLink = true;
                apiCalls[CallType.table].queryString = $"?query=shortTable";
                htmlResponse.Append($"<h2>{id}</h2>");

                switch (id)
                {
                    case "Tables":
                    default:
                        apiCalls[CallType.table].queryString += "&type=U";
                        break;
                    case "Views":
                        apiCalls[CallType.table].queryString += "&type=V";
                        break;
                    case "Functions":
                        apiCalls[CallType.table].queryString += "&type=F";
                        break;
                    case "Procedures":
                        apiCalls[CallType.table].queryString += "&type=P";
                        break;
                    case "Constants":
                        apiCalls[CallType.table].queryString += "&type=C";
                        break;
                    case "Indices":
                        apiCalls[CallType.table].queryString = $"?query=allindexes";
                        break;
                }
            }
            else
            {
                htmlResponse.Append($"<h2><font class='font-size-small'>{parentId}</font>{id}</h2>");

                switch (parentId)
                {
                    case "Tables":
                        //apiCalls[CallType.table].format = "json";
                        apiCalls[CallType.table].queryString = $"?query=columnsfortable&name={id}";
                        break;
                    case "Views":
                        apiCalls[CallType.info1] = new ApiCall("json", $"?query=parent&name={id}");
                        apiCalls[CallType.info2] = new ApiCall("json", $"?query=description&name={id}");
                        apiCalls[CallType.table].queryString = $"?query=description&name={id}";
                        break;
                    case "Functions":
                        apiCalls[CallType.info1] = new ApiCall("json", $"?query=functionparameters&name={id}");
                        apiCalls[CallType.table].queryString = $"?query=function&name={id}";
                        break;
                    case "Procedures":
                        apiCalls[CallType.info1] = new ApiCall("json", $"?query=procedureparameters&name={id}");
                        apiCalls[CallType.table].queryString = $"?query=function&name={id}";
                        break;
                    case "Constants":
                        if (id == "DataConstants")
                            apiCalls[CallType.table].queryString = $"?query=constantsFields";
                        else
                        {
                            // TODO: add constant api call
                            htmlResponse.Clear();
                            apiCalls[CallType.table].queryString = $"?query=shortTable&type=C";
                        }
                        break;
                    case "Indices":
                        htmlResponse.Clear().Append($"<h2><font class='font-size-small'>Indices for table</font>{id}</h2>");
                        apiCalls[CallType.table].queryString = $"?query=indices&name={id}";
                        break;
                    default:
                        apiCalls[CallType.table].queryString = $"?query=dbcomponents";
                        break;
                }
            }

            foreach (var apiCall in apiCalls)
            {
                var requestUri = new Uri(globals.WSMetadataUrl + apiCall.Value.queryString + $"&format={apiCall.Value.format}");

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(requestUri))
                    {
                        apiCall.Value.response = await response.Content.ReadAsStringAsync();
                    }
                }

                if (apiCall.Value.format == "html")
                {
                    var doc = new HtmlDocument();

                    doc.LoadHtml(apiCall.Value.response);

                    foreach (var element in doc.DocumentNode.SelectNodes("//@bgcolor"))
                        element.Attributes.Remove(element.Attributes["bgcolor"]);

                    if (createFirstRowLink)
                    {
                        foreach (var tr in doc.DocumentNode.SelectNodes("//table/tr[position()>1]/td[1]") ?? new HtmlNodeCollection(null))
                        {
                            var anchor = tr.CloneNode("a", true);
                            anchor.Attributes.RemoveAll();
                            anchor.Attributes.Add("href", "#");
                            anchor.Attributes.Add("onclick", $"open_node('{tr.InnerText.Trim()}', '{id}')");

                            tr.ChildNodes.Clear();
                            tr.PrependChild(anchor);
                        }
                    }

                    htmlResponse.Append(doc.DocumentNode.OuterHtml);
                }
                else
                {
                    switch (parentId)
                    {
                        case "Functions":

                            var functionParametersJson = JsonConvert.DeserializeObject<List<FunctionProcedureTable>>(apiCall.Value.response);
                            var functionParameter = functionParametersJson.First().Rows.FirstOrDefault();

                            htmlResponse.Append($"<p class='schema-description'>{functionParameter?.description}</p>");
                            htmlResponse.Append($"<p class='schema-text'>{functionParameter?.text}</p>");

                            htmlResponse.Append("<h4>Input and output parameters</h4>");
                            break;
                        case "Procedures":

                            var procedureParametersJson = JsonConvert.DeserializeObject<List<FunctionProcedureTable>>(apiCall.Value.response);
                            var procedureParameter = procedureParametersJson.First().Rows.FirstOrDefault();

                            htmlResponse.Append($"<p class='schema-description'>{procedureParameter?.description}</p>");
                            htmlResponse.Append($"<p class='schema-text'>{procedureParameter?.text}</p>");

                            htmlResponse.Append("<h4>Input and output parameters</h4>");
                            break;
                        case "Views":

                            if (apiCall.Key == CallType.info1)
                            {
                                var viewJson = JsonConvert.DeserializeObject<List<ViewTable>>(apiCall.Value.response);
                                htmlResponse.Append($"<h3><font class='font-size-small'>Derived from</font>{viewJson.First().Rows.FirstOrDefault()?.parent}</h3>");
                            }
                            if (apiCall.Key == CallType.info2)
                            {
                                var viewJson = JsonConvert.DeserializeObject<List<ViewTable>>(apiCall.Value.response);

                                htmlResponse.Append($"<p class='schema-text'>{viewJson.First().Rows.FirstOrDefault()?.description}</p>");
                                htmlResponse.Append("<h4>Input and output parameters</h4>");
                            }

                            break;
                        case "Indices":
                            htmlResponse.Clear().Append($"<h2><font class='font-size-small'>Indices for table</font>{id}</h2>");
                            break;
                        default:
                            htmlResponse.Append(apiCall.Value.response);
                            break;
                    }
                }
            }

            return Json(htmlResponse.ToString());
        }

        class ApiCall
        {
            public ApiCall() { }
            public ApiCall(string _format)
            {
                format = _format;
            }
            public ApiCall(string _format, string _queryString)
            {
                format = _format;
                queryString = _queryString;
            }

            public string queryString { get; set; }
            public string response { get; set; }
            public string format { get; set; }
        }

        public enum CallType
        {
            info1 = 0,
            info2 = 1,
            table = 2
        }

        /// <summary>
        /// Handling string of Data of opened nodes
        /// </summary>
        public class TreeViewPathProvider
        {
            private string openNodesString = string.Empty;
            private Regex rg = new Regex(@"<{1}(?<node>[^/>]+)>{1}", RegexOptions.Compiled);
            public string[] openedNodes { get; set; }

            private static TreeViewPathProvider tvpp;
            private TreeViewPathProvider()
            { }
            public static TreeViewPathProvider Instance()
            {
                if (tvpp == null) tvpp = new TreeViewPathProvider();
                return tvpp;
            }

            public string OpenNodesString
            {
                get { return openNodesString; }
                set
                {
                    openNodesString = value;
                    // making array of id`s of opened nodes
                    openedNodes = (from m in rg.Matches(OpenNodesString) select m.Groups["node"].Value).ToArray();
                }
            }
            public TreeViewPathProvider AddNode(string parentId, string id)
            {
                // # -- virtual node of forest
                if (parentId == "#") // 
                {
                    OpenNodesString = $"<{id}></{id}>";
                }
                else
                {
                    // insert id of new jpening node
                    int start = OpenNodesString.IndexOf($"<{parentId}>") + $"<{parentId}>".Length;
                    OpenNodesString = OpenNodesString.Insert(start, $"<{id}></{id}>");
                }
                return this;
            }
            public TreeViewPathProvider DelNode(string id)
            {
                // Delen node with all him content
                Regex rgr = new Regex($@"<{id}>.*</{id}>");
                OpenNodesString = rgr.Replace(OpenNodesString, "");
                return this;
            }
        }

        #endregion

    }
}