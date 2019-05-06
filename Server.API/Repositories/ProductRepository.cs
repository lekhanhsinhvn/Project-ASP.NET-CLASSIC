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
    public class ProductRepository : IProductRepository
    {
        private readonly ServerContext _db;
        public ProductRepository(ServerContext db)
        {
            _db = db;
        }

        public Task<Product> CreateProduct(Product product, CancellationToken cancellationToken)
        {
            if (_db.Products.SingleOrDefault(i => i.Name == product.Name) != null)
            {
                throw new Exception("Already have that product");
            }
            product.CreatedDate = DateTime.Now;
            product.ModifiedDate = DateTime.Now;
            _db.Products.Add(product);
            _db.SaveChanges();
            return Task.FromResult(product);
        }

        public Task<Product> DeleteProduct(int ProductId, CancellationToken cancellationToken)
        {
            Product found = _db.Products.FirstOrDefault(x => x.ProductId == ProductId);
            if (found != null)
            {
                _db.Products.Remove(found);
                _db.SaveChanges();
            }
            return Task.FromResult(found);
        }

        public Task<Product> GetProduct(int ProductId, CancellationToken cancellationToken)
        {
            Product found = _db.Products.FirstOrDefault(x => x.ProductId == ProductId);
            if (found == null)
            {
                throw new Exception("Product doesn't exist.");
            }
            return Task.FromResult(found);
        }

        public Task<List<Product>> GetProducts(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            if (!_db.Products.Any())
            {
                throw new Exception("No Results.");
            }
            List<Product> products = _db.Products.ToList();
            products = FilterProducts(products, search);
            products = SortProducts(products, sort, asc);
            products.Skip(pageNum * maxPerPage);
            products.Take(maxPerPage);

            return Task.FromResult(products);
        }

        public Task<int> GetTotalCountProduct(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Products.Count());
        }

        public Task<Product> UpdateProduct(Product product, CancellationToken cancellationToken)
        {
            var found = _db.Products.SingleOrDefault(i => i.ProductId == product.ProductId);
            if (found != null)
            {
                throw new Exception("Role doesn't exist.");
            }
            found.Description = string.IsNullOrWhiteSpace(product.Description) ? found.Description : product.Name;
            found.Image = string.IsNullOrWhiteSpace(product.Image) ? found.Image : product.Name;
            found.Price = product.Price == null ? found.Price : product.Price;
            found.Quantity = product.Quantity == null ? found.Quantity : product.Quantity;
            found.Categories = product.Categories;
            found.ModifiedDate = DateTime.Now;
            _db.SaveChanges();
            return Task.FromResult(_db.Products.SingleOrDefault(i => i.ProductId == product.ProductId));
        }

        private List<Product> SortProducts(List<Product> products, string sort, bool asc)
        {
            if (asc)
            {
                switch (sort)
                {
                    case "ProductId":
                        products.Sort((x, y) => x.ProductId.Value.CompareTo(y.ProductId));
                        break;
                    default:
                        products.Sort((x, y) => x.Name.CompareTo(y.Name));
                        break;
                    case "Description":
                        products.Sort((x, y) => x.Description.CompareTo(y.Description));
                        break;
                    case "Price":
                        products.Sort((x, y) => x.Price.Value.CompareTo(y.Price));
                        break;
                    case "Quantity":
                        products.Sort((x, y) => x.Quantity.Value.CompareTo(y.Quantity));
                        break;
                    case "CreatedDate":
                        products.Sort((x, y) => x.CreatedDate.Value.CompareTo(y.CreatedDate));
                        break;
                    case "ModifiedDate":
                        products.Sort((x, y) => x.ModifiedDate.Value.CompareTo(y.ModifiedDate));
                        break;
                }

            }
            else
            {
                switch (sort)
                {
                    case "ProductId":
                        products.Sort((x, y) => y.ProductId.Value.CompareTo(x.ProductId));
                        break;
                    default :
                        products.Sort((x, y) => y.Name.CompareTo(x.Name));
                        break;
                    case "Description":
                        products.Sort((x, y) => y.Description.CompareTo(x.Description));
                        break;
                    case "Price":
                        products.Sort((x, y) => y.Price.Value.CompareTo(x.Price));
                        break;
                    case "Quantity":
                        products.Sort((x, y) => y.Quantity.Value.CompareTo(x.Quantity));
                        break;
                    case "CreatedDate":
                        products.Sort((x, y) => y.CreatedDate.Value.CompareTo(x.CreatedDate));
                        break;
                    case "ModifiedDate":
                        products.Sort((x, y) => y.ModifiedDate.Value.CompareTo(x.ModifiedDate));
                        break;
                }
            }
            return products;
        }

        private List<Product> FilterProducts(List<Product> products, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                products.Where(u => u.ProductId.ToString().Contains(search) ||
                                u.Name.Contains(search) ||
                                u.Description.Contains(search) ||
                                u.Price.ToString().Contains(search) ||
                                u.Quantity.ToString().Contains(search) ||
                                u.CreatedDate.ToString().Contains(search)||
                                u.ModifiedDate.ToString().Contains(search));
            }
            return products;
        }
    }
}