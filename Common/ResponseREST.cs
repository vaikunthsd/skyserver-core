using Microsoft.AspNetCore.Http;
using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkyServerCore.Common;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.IO;
using Microsoft.AspNetCore.Http.Extensions;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace SkyserverCore.Common
{

    public class ResponseREST
    {
        HttpResponse httpResponse;
        ICookieManager cookie;
        string token = "";
        string requestUrl = "";
        String requestString = "";
        String responseString = "";
        String contentType = "";

        public static string searchTool = "";
        String WSrequestUri = "";
        String ClientIpHeaderName = "";
        String ReferrerHeaderName = "";
        Globals globals = new Globals();
        // key is Keystone
        String key = "";
        HttpContext httpContext;
        bool saveResponseToFile;

        public ResponseREST()
        {
            WSrequestUri = globals.DatabaseSearchWS;
            this.saveResponseToFile = globals.SaveResponseToFile;
        }

        public ResponseREST(string WSrequestUri)
        {
            this.WSrequestUri = WSrequestUri;
            this.saveResponseToFile = globals.SaveResponseToFile;
        }

        public ResponseREST(HttpResponse Response)
        {
            this.httpResponse = Response;
            this.saveResponseToFile = globals.SaveResponseToFile;
        }

        /// <summary>
        /// This method is used to pass all the requests and run rest web service
        /// </summary>
        public void ProcessRequestREST(HttpRequest Request, HttpResponse Response)
        {
            WSrequestUri = this.globals.DatabaseSearchWS;

            httpResponse = Response;
            this.token = Request.Cookies["Keystone"];

            IFormCollection inputForm = Request.Form;
            String requestString = "";
            if (inputForm.Count > 0)
            {
                foreach (string key in inputForm.Keys)
                {
                    requestString += key + "=" + Uri.EscapeDataString(inputForm[key]) + "&";
                }
                requestString = requestString.TrimEnd('&');
            }
            else
            {
                //inputForm = (IFormCollection)Request.QueryString;
            }
            System.Diagnostics.Debug.Write(requestString);
            searchTool = inputForm["searchtool"];

            bool temp = false;
            string radecText = "";

            switch (searchTool)
            {
                case "UserHistory": requestUrl = globals.UserHistoryWS; break;
                case "SearchForm": requestUrl = globals.SQLSearchWS; break;
                case "SQL": requestUrl = globals.SQLSearchWS; break;
                case "Radial": requestUrl = globals.RadialSearchWS; break;
                case "Rectangular": requestUrl = globals.RectangularSearchWS; break;
                case "CrossID":
                    temp = true; requestUrl = globals.CrossIdWS; break;
                case "Imaging":
                    switch (inputForm["positionType"])
                    {
                        case "cone": requestUrl = globals.ConeImaging; break;
                        case "rectangular": requestUrl = globals.RectangularImaging; break;
                        case "none": requestUrl = globals.NoPositionImaging; break;
                        case "proximity": temp = true; requestUrl = globals.ProximityImaging; break;
                        default: throw new Exception("No proper positionType selected.");
                    }
                    break;
                case "Spectro":
                    switch (inputForm["positionType"])
                    {
                        case "cone": requestUrl = globals.ConeSpectroWS; break;
                        case "rectangular": requestUrl = globals.RectangularSpectroWS; break;
                        case "none": requestUrl = globals.NoPositionSpectroWS; break;
                        case "proximity": temp = true; requestUrl = globals.ProximitySpectroWS; break;
                        default: throw new Exception("No proper positionType selected.");
                    }
                    break;
                case "IRSpectra":
                    switch (inputForm["positionType"])
                    {
                        case "cone": requestUrl = globals.ConeIRWS; break;
                        case "conelb": requestUrl = globals.GalacticIRWS; break;
                        case "none": requestUrl = globals.NoPositionIRWS; break;
                        //case "proximity": temp = true; requestUrl = globals.ProximitySpectroWS; break;
                        default: throw new Exception("No proper positionType selected.");
                    }
                    break;
                default: throw new Exception("Select proper tool");

            }

            if (temp)
            {

                bool HasFile = false;
                bool HasTextList = false;
                if (Request.Form.Files.Count > 0 && Request.Form.Files[0].Length > 0)
                {
                    radecText = (new StreamReader(Request.Form.Files[0].OpenReadStream())).ReadToEnd();
                    HasFile = true;
                }
                else
                {
                    try
                    {
                        if (searchTool == "CrossID")
                            radecText = inputForm["paste"];
                        if (inputForm["positionType"] == "proximity")
                            radecText = inputForm["radecTextArea"];

                        if (radecText.Length > 0)
                        {
                            HasTextList = true;
                            //throw new ApplicationException("ERROR: No (RA,DEC) list specified for CrossID tool.");
                        }
                    }
                    catch
                    {
                        throw new ApplicationException("Not able to parse file or list.");
                        //httpResponse.Write(getErrorMessageHTMLresult("Not able to parse file or list."));
                        //httpResponse.End();
                        //return;
                    }
                }
                if (!HasTextList && !HasFile)
                {
                    throw new ApplicationException("Not able to read input file or list.");
                    //httpResponse.Write(getErrorMessageHTMLresult("Not able to read input file or list."));
                    //httpResponse.End();
                    //return;
                }
            }
            runQuery(requestUrl, requestString, radecText, inputForm["format"], Request, Response);


        }

        /// <summary>
        /// Runs the query.
        /// </summary>
        /// <param name="serviceUrl">The service URL.</param>
        /// <param name="requestString">The request string.</param>
        /// <param name="uploaded">The uploaded.</param>
        /// <param name="returnType">Type of the return.</param>
        public void runQuery(String serviceUrl, String requestString, string uploaded, string returnType, HttpRequest Request, HttpResponse Response)
        {

            ClientIpHeaderName = globals.IpHeaderName;
            ReferrerHeaderName = globals.RefererHeaderName;

            /// Once the authenticated skyserver is ready, we can update the code to retrieve token          
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(serviceUrl);
            client.Timeout = new TimeSpan(0, 0, 0, globals.TimeoutSkyserverWS);// default is 100000ms
            string requestUri = client.BaseAddress + "?" + requestString;

            string queryResult = "";
            byte[] queryResultByte = null;
            HttpResponseMessage respMessage = null;
            StringContent content = null;

            if (uploaded == null || uploaded.Equals(""))
                content = new StringContent("");
            else
                content = new StringContent(uploaded);

            client.DefaultRequestHeaders.Add(ClientIpHeaderName, GetClientIP(Request));
            client.DefaultRequestHeaders.Referrer = new Uri(Request.Headers["Referer"].ToString() != null ? Request.Headers["Referer"].ToString() : Request.GetDisplayUrl());
            string trimmedToken = "";
            if (!(token == null || token == String.Empty))
                if (token.StartsWith("token="))
                {
                    trimmedToken = token.Replace("token=", "");
                }
                else
                {
                    trimmedToken = token;
                }
            content.Headers.Add("X-Auth-Token", trimmedToken);

            /*
                        if (!HttpContext.Current.Request.Cookies.AllKeys.Contains("ASP.NET_SessionId"))
                        {
                            try
                            {
                                HttpContext.Current.Request.Cookies.Add(new HttpCookie("ASP.NET_SessionId", System.Web.HttpContext.Current.Session.SessionID));
                            }
                            catch { };
                        }
            */

            //posting the request and getting the result back.
            respMessage = client.PostAsync(requestUri, content).Result;


            if (respMessage.IsSuccessStatusCode)
                if (returnType == "fits")
                    queryResultByte = respMessage.Content.ReadAsByteArrayAsync().Result;
                else
                    queryResult = respMessage.Content.ReadAsStringAsync().Result;
            else
            {
                string ErrorMessage = respMessage.Content.ReadAsStringAsync().Result;
                queryResult = getErrorMessageHTMLresult(ErrorMessage);
                returnType = "html";
                //throw new ApplicationException("Query did not return results successfully, check input and try again later.");
            }

            setContentType(returnType);
            if (returnType == "fits" || returnType == "dataset")
            {
                //httpResponse.BinaryWrite(queryResultByte);
            }
            else
            {
                //httpResponse.Output.Write(queryResult);
                responseString = queryResult;
                getResult();
            }
            //httpResponse.End();

        }

        public string getResult()
        {
            return responseString;
        }
        public string getContentType()
        {
            return contentType;
        }

        string FileName = "Skyserver_" + searchTool + DateTime.UtcNow;
        public void setContentType(string format)
        {
            format = format.ToLower();
            switch (format)
            {
                case "csv":
                    httpResponse.ContentType = "text/plain";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".csv\"";
                    break;
                case "xml":
                    httpResponse.ContentType = "application/xml";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".xml\"";
                    break;
                case "votable":
                    httpResponse.ContentType = "application/x-votable+xml";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".votable.xml\"";
                    break;
                case "json":
                    httpResponse.ContentType = "application/json";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".json\"";
                    break;
                case "fits":
                    httpResponse.ContentType = "application/octet-stream";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".fits\"";
                    break;
                case "mydb":
                case "html":
                    httpResponse.ContentType = "text/html";
                    break;
                default:
                    httpResponse.ContentType = "text/plain";
                    if (saveResponseToFile)
                        httpResponse.Headers["Content-Disposition"] = "attachment;filename=\"" + FileName + ".txt\"";
                    break;
            }
            contentType = httpResponse.ContentType;
            //return format;
        }


        public string getErrorMessageHTMLresult(string ErrorMessage)
        {
            string message = "";
            string message2 = "";

            try
            {
                JObject jarr = JObject.Parse(ErrorMessage);
                foreach (KeyValuePair<String, JToken> property in jarr)
                {
                    string propertyName = property.Key.ToString();
                    if (propertyName == "Error Message" || propertyName == "Message")
                    {
                        message = property.Value.ToString();
                        break;
                    }
                }
                if (message == "")
                {
                    message = "Query did not return results successfully, check the input and try again.";

                    string errmessage = ErrorMessage.ToLower();
                    if (errmessage.Contains("<html"))
                    {
                        message2 = errmessage;
                        message += "<br>MORE INFO FROM RESPONSE:<br><br>";
                    }
                    else { message += "<br>MORE DETAILED INFO FROM RESPONSE:<br><br>" + ErrorMessage; }
                }

            }
            catch { message = ErrorMessage; }


            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("<html><head>\n");
            sb.AppendFormat("<title>Skyserver Error</title>\n");
            sb.AppendFormat("</head><body bgcolor=white>\n");
            sb.AppendFormat("<p>An error occured</p>");
            //sb.AppendFormat("<p><font color=red><br>" + message + "</font></p>");
            sb.AppendFormat("<p><font color=red><br> {0} </font></p>", message);
            sb.AppendFormat("</BODY></HTML>\n");
            sb.AppendFormat(message2);
            return sb.ToString();
        }


        public string GetClientIP(HttpRequest request)
        {
            //httpContext = new 
            string clientIP = "";
            try
            {

                //if (!string.IsNullOrEmpty(httpContext.Request.Headers["HTTP_X_FORWARDED_FOR"]))
                if (!string.IsNullOrEmpty(request.Headers["HTTP_X_FORWARDED_FOR"]))
                {
                    //clientIP = httpContext.Request.Headers["HTTP_X_FORWARDED_FOR"];
                    clientIP = request.Headers["HTTP_X_FORWARDED_FOR"];
                    string[] addresses = new string[] { };
                    try
                    {
                        addresses = clientIP.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    }
                    catch { }
                    if (addresses.Length > 0)
                        clientIP = addresses[0];
                }
                if (string.IsNullOrEmpty(clientIP))
                {
                    //if (!string.IsNullOrEmpty(httpContext.Connection.RemoteIpAddress.ToString()))
                    if (!string.IsNullOrEmpty(request.HttpContext.Connection.RemoteIpAddress.ToString()))
                    {
                        clientIP = request.HttpContext.Connection.RemoteIpAddress.ToString();
                    }
                    else
                    {
                        clientIP = request.HttpContext.Request.Headers["REMOTE_ADDR"];
                    }
                }
            }
            catch { }
            if (clientIP == "")
                clientIP = "unknown";
            return clientIP;
        }
    }
}
