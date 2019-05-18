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
        private readonly ServerContext _db = new ServerContext();
        public CategoryRepository()
        {
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
            Category found = _db.Categories.FirstOrDefault(x => x.CategoryId == CategoryId);
            if (found == null)
            {
                throw new Exception("Role doesn't exist.");
            }
            return Task.FromResult(found);
        }

        public Task<List<Category>> GetCategorys(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            
            List<Category> categories = _db.Categories.ToList();
            categories = FilterCategories(categories, search);
            categories = SortCategories(categories, sort, asc);
            categories = categories.Skip(pageNum * maxPerPage).ToList();
            categories = categories.Take(maxPerPage).ToList();
            if (!_db.Categories.Any())
            {
                throw new Exception("No Results.");
            }
            return Task.FromResult(categories);
        }

        public Task<int> GetTotalCountCategory(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Categories.Count());
        }

        public Task<Category> UpdateCategory(Category category, CancellationToken cancellationToken)
        {
            Category found = _db.Categories.SingleOrDefault(i => i.CategoryId == category.CategoryId);
            if (found == null)
            {
                throw new Exception("Category doesn't exist.");
            }
            found.Description = string.IsNullOrWhiteSpace(category.Description) ? found.Description : category.Description;
            found.Products = category.Products;
            found.ModifiedDate = DateTime.Now;
            _db.SaveChanges();
            return Task.FromResult(_db.Categories.SingleOrDefault(i => i.CategoryId == category.CategoryId));
        }

        private List<Category> SortCategories(List<Category> categories, string sort, bool asc)
        {
            if (asc)
            {
                switch (sort)
                {
                    case "CategoryId":
                        categories.Sort((x, y) => x.CategoryId.Value.CompareTo(y.CategoryId));
                        break;
                    default:
                        categories.Sort((x, y) => x.Name.CompareTo(y.Name));
                        break;
                    case "CreatedDate":
                        categories.Sort((x, y) => x.CreatedDate.Value.CompareTo(y.CreatedDate));
                        break;
                    case "ModifiedDate":
                        categories.Sort((x, y) => x.ModifiedDate.Value.CompareTo(y.ModifiedDate));
                        break;
                }

            }
            else
            {
                switch (sort)
                {
                    case "CategoryId":
                        categories.Sort((x, y) => y.CategoryId.Value.CompareTo(x.CategoryId));
                        break;
                    default:
                        categories.Sort((x, y) => y.Name.CompareTo(x.Name));
                        break;
                    case "CreatedDate":
                        categories.Sort((x, y) => y.CreatedDate.Value.CompareTo(x.CreatedDate));
                        break;
                    case "ModifiedDate":
                        categories.Sort((x, y) => y.ModifiedDate.Value.CompareTo(x.ModifiedDate));
                        break;
                }
            }
            return categories;
        }

        private List<Category> FilterCategories(List<Category> categories, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                return categories.Where(u => u.CategoryId.ToString().Contains(search) ||
                                u.Name.Contains(search) ||
                                u.Description.Contains(search) ||
                                u.CreatedDate.ToString().Contains(search) ||
                                u.ModifiedDate.ToString().Contains(search)).ToList();
            }
            return categories;
        }
    }
}