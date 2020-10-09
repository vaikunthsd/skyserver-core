using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkyServerCore.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Web;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SkyserverCore.Models;
using Microsoft.Extensions.Configuration;
using SkyserverCore.Common;



namespace SkyserverCore.Common
{

    public class Authentication
    {
        static Globals globals = new Globals();
        public static UserAccess Authenticate(string token)
        {
            using (var client = new HttpClient() { BaseAddress = new Uri(globals.AuthenticationURL) })
            {
                try
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, "keystone/v3/tokens/" + token);

                    var response = client.SendAsync(request).Result.EnsureSuccessStatusCode();

                    JObject json = JObject.Parse(response.Content.ReadAsStringAsync().Result);

                    UserAccess userAccess = new UserAccess(json);

                    return userAccess;
                }
                catch
                {
                    throw new Exception("Could not authenticate token with Authentication provider");
                }
            }
        }

        public static bool IsValidToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;

            try
            {
                using (var client = new HttpClient() { BaseAddress = new Uri(globals.AuthenticationURL) })
                {
                    var request = new HttpRequestMessage(HttpMethod.Head, "keystone/v3/tokens/" + token);
                    var response = client.SendAsync(request).Result;
                    return response.IsSuccessStatusCode;
                }
            }
            catch
            {
                return false;
            }
        }


        public static UserAccess TryUserLogin(HttpContext httpContext)//HttpRequest httpRequest, HttpResponse httpResponse, HttpContext httpContext
        {
            //HttpRequest httpRequest = HttpRequest;

            String token = null;
            try
            {

                token = httpContext.Request.Query["token"].ToString();
                if (token != null && token != "")
                {
                    try
                    {
                        UserAccess userAccess = Authenticate(token);
                        String userid = userAccess.User.Name;
                        httpContext.Session.SetString("USERID", userid);
                        httpContext.Session.SetString("KEYSTONE", token);
                        httpContext.Session.SetString("IsLogedIn", "true");
                        httpContext.Response.Cookies.Delete("Keystone");
                        httpContext.Response.Cookies.Append("Keystone", "token=" + token);
                        return userAccess;
                    }
                    catch (Exception e)
                    {
                        httpContext.Response.Cookies.Delete("Keystone");
                        httpContext.Session.SetString("USERID", "");
                        httpContext.Session.SetString("KEYSTONE", "");
                        httpContext.Session.SetString("IsLogedIn", "false");
                        return null;
                    }
                }
                else
                {

                    token = httpContext.Request.Cookies["Keystone"];
                    if (token != null && token !=  "")
                    {
                        token = token.Replace("token=", "");

                        try
                        {
                            UserAccess userAccess = Authenticate(token);
                            String userid = userAccess.User.Name;
                            //Boolean isValidUser = true;
                            httpContext.Session.SetString("USERID", userid);
                            httpContext.Session.SetString("KEYSTONE", token);
                            httpContext.Session.SetString("IsLogedIn", "true");
                            httpContext.Response.Cookies.Delete("Keystone");
                            httpContext.Response.Cookies.Append("Keystone", "token=" + token);
                            return userAccess;
                        }
                        catch (Exception e)
                        {
                            httpContext.Response.Cookies.Delete("Keystone");
                            httpContext.Session.SetString("USERID", "");
                            httpContext.Session.SetString("KEYSTONE", "");
                            httpContext.Session.SetString("IsLogedIn", "false");
                            return null;
                        }

                    }
                    else// when there is no token in request and no stored cookie: means user is not logged-in.
                    {
                        if (httpContext.Session.GetString("USERID") != null)
                        {
                            httpContext.Session.SetString("USERID", "");
                            httpContext.Session.SetString("KEYSTONE", "");
                            httpContext.Response.Cookies.Delete("Keystone");
                        }
                        httpContext.Session.SetString("IsLogedIn", "false");
                        //isValidUser = false;
                        return null;
                    }
                }
            }
            /*
                            catch (UnauthorizedAccessException ex)
                            {
                                httpResponse.Redirect(ConfigurationManager.AppSettings["Keystone.Portal"] + "?message=" + Uri.EscapeDataString(ex.Message));
                            }
            */
            catch (Exception ex)
            {
                throw new Exception("Authentication error: " + ex.Message, ex);
            }
        }


        public static void TryUserLogout(HttpContext httpContext)//HttpRequest httpRequest, HttpResponse httpResponse, HttpContext httpContext
        {
            httpContext.Session.Clear();//note: this does not remove session cookie

            //removing session cookie:
            String token = httpContext.Request.Cookies["Keystone"];
            if(token  != null)
            {
                //httpContext.Response.Cookies.Append("Keystone", "", new CookieOptions() { Expires = DateTime.Now.AddDays(-1) });
                httpContext.Response.Cookies.Delete("Keystone");
            }
        }



    }


    public class UserAccess
    {

        public User User = new User();
        public UserAccess(JObject json)
        {
            string id = (string)json["token"]["user"]["id"];
            string name = (string)json["token"]["user"]["name"];

            User.setId(id);
            User.setName(name);
        }
    }


    public class User
    {
        public string Id = null;
        public string Name = null;

        public User()
        {

        }
        public User(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public void setId(string id)
        {
            this.Id = id;
        }
        public void setName(string name)
        {
            this.Name = name;
        }

        public string getId()
        {
            return this.Id;
        }

        public string getName()
        {
            return this.Name;
        }



    }

}




