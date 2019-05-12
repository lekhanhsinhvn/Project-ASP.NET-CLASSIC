using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client
{
    public interface IFileHandler
    {
        void ImageSave(string base64String, string name);
        void ImageRemove(string name);
    }
}
