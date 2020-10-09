using System.Collections.Generic;
using System.Linq;

namespace SkyserverCore.Models
{
    public class TreeViewData
    {
        public string id { get; set; }
        public string text { get; set; }
        public string parent { get; set; }
        public List<TreeViewData> children { get; set; }
        public bool opened { get; set; } = false;
    }

    public class TreeViewContainer
    {
        public string parent { get; set; }
        public string id { get; set; }
        public string text { get; set; }
        public object children { get; set; }
        public bool opened { get; set; } = false;
        public object a_attr { get; set; }
        public object state { get; set; }
        public TreeViewContainer AddChildrens(List<TreeViewData> srcdata, int level)
        {
            // recursive loading tree. Loads only 2 levels childs nodes (level < 2) 
            if (level == 2) children = true; // for first not loaded level set children = true for enable open symbol (">")
                                             // We don`t know if this level has childs nodes, but give the opportunity to check and download it
            if (level < 2)
            {
                level++;
                children = (from d in srcdata
                            where d.parent == id
                            select
                            (new TreeViewContainer()
                            {
                                text = d.text,
                                id = d.id,
                                parent = null,
                                state = new { d.opened },
                                opened = d.opened,
                                // TODO: user API url
                                a_attr = new { href = "/TODO", },
                            }).AddChildrens(srcdata, level));
            }
            return this;
        }
    }
}