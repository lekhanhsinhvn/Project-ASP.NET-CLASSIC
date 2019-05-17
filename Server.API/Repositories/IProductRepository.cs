using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Server.API.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GetProduct(int ProductId, CancellationToken cancellationToken);

        Task<List<Product>> GetProducts(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<int> GetTotalCountProduct(CancellationToken cancellationToken);

        Task<Product> UpdateProduct(Product product, string base64String, CancellationToken cancellationToken);

        Task<Product> DeleteProduct(int ProductId, CancellationToken cancellationToken);

        Task<Product> CreateProduct(Product product, string base64String, CancellationToken cancellationToken);
    }
}
