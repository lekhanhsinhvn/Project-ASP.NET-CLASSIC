using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Client
{
    public class FileHandler : IFileHandler
    {
        public void ImageSave(string base64String, string name)
        {
            var match = Regex.Match(base64String, @"data:(?<type>.+?);base64,(?<data>.+)");
            var base64Data = match.Groups["data"].Value;
            var contentType = match.Groups["type"].Value;
            var binData = Convert.FromBase64String(base64Data);

            string projectPath = new DirectoryInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/")).Parent.FullName;
            string path = projectPath+"/Client/public/images/";
            using ( var img = new FileStream(Path.Combine(path, name), FileMode.Create))
            {
                img.Write(binData, 0, binData.Length);
                img.Flush();
            }
        }
        public void ImageRemove(string name)
        {
            string projectPath = new DirectoryInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/")).Parent.FullName;
            string path = projectPath + "/Client/public/images/";
            File.Delete(Path.Combine(path, name));
        }
    }
}