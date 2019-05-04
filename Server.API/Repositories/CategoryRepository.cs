using Server.DB;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public class CategoryRepository :ICategoryRepository
    {
        private readonly ServerContext _db;
        public CategoryRepository(ServerContext db)
        {
            _db = db;
        }

        public Task<Category> CreateCategory(Category category, CancellationToken cancellationToken)
        {
            if(_db.Categories.SingleOrDefault(i => i.Name == category.Name) != null)
            {
                throw new Exception("Already have that category");
            }
            category.CreatedDate = DateTime.Now;
            category.ModifiedDate = DateTime.Now;
            _db.Categories.Add(category);
            _db.SaveChanges();
            return Task.FromResult(category);
        }

        public Task<Category> DeleteCategory(int CategoryId, CancellationToken cancellationToken)
        {
            Category found = _db.Categories.FirstOrDefault(x => x.CategoryId == CategoryId);
            if (found != null)
            {
                _db.Categories.Remove(found);
                _db.SaveChanges();
            }
            return Task.FromResult(found);
        }

        public Task<Category> GetCategory(int CategoryId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<List<Category>> GetCategorys(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<int> GetTotalCountCategory(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Category> UpdateCategory(Category Category, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}