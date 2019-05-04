using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Server.API.Repositories
{
    interface ICategoryRepository
    {
        Task<Category> GetCategory(int CategoryId, CancellationToken cancellationToken);

        Task<List<Category>> GetCategorys(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<int> GetTotalCountCategory(CancellationToken cancellationToken);

        Task<Category> UpdateCategory(Category Category, CancellationToken cancellationToken);

        Task<Category> DeleteCategory(int CategoryId, CancellationToken cancellationToken);

        Task<Category> CreateCategory(Category Category, CancellationToken cancellationToken);
    }
}
