using Newtonsoft.Json;
using SkyServerCore.Common;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SkyserverCore.Models
{
    public interface ITreeviewControl
    {
        Task<List<TreeViewData>> GetSchemaBrowserList();
    }

    public class SchemaTree
    {
        public string TableName;
        public List<SchemaNode> Rows;
    }
    public class SchemaNode
    {
        public string name;
    }

    public class TreeviewControl : ITreeviewControl
    {
        public TreeviewControl() { }

        private List<TreeViewData> convertJsonTree(List<SchemaTree> schemaTree)
        {
            List<TreeViewData> treeVIewList = new List<TreeViewData>();

            foreach (SchemaTree node in schemaTree)
            {
                treeVIewList.Add(new TreeViewData { id = node.TableName, text = node.TableName, parent = "#" });
                treeVIewList.AddRange(node.Rows.Select(x => new TreeViewData { id = $"{node.TableName}_{x.name}", text = x.name, parent = node.TableName }));
            }

            return treeVIewList;
        }

        public async Task<List<TreeViewData>> GetSchemaBrowserList()
        {
            Globals globals = new Globals();

            List<SchemaTree> schemaTree;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(globals.WSMetadataUrl + "?format=json&query=dbcomponents"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    schemaTree = JsonConvert.DeserializeObject<List<SchemaTree>>(apiResponse);
                }
            }

            return convertJsonTree(schemaTree);
        }
    }

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
                openedNodes = (from m in rg.Matches(OpenNodesString) select m.Groups["node"].Value).ToArray();
            }
        }
        public TreeViewPathProvider AddNode(string parentId, string id)
        {
            // # -- virtual node of forest
            if (parentId == "#")
            {
                OpenNodesString = $"<{id}></{id}>";
            }
            else
            {
                int start = OpenNodesString.IndexOf($"<{parentId}>") + $"<{parentId}>".Length;
                OpenNodesString = OpenNodesString.Insert(start, $"<{id}></{id}>");
            }
            return this;
        }
        public TreeViewPathProvider DelNode(string id)
        {
            Regex rgr = new Regex($@"<{id}>.*</{id}>");
            OpenNodesString = rgr.Replace(OpenNodesString, "");
            return this;
        }
    }
}
