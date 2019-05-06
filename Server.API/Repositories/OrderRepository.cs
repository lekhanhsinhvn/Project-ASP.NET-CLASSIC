using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Server.DB;
using Server.DB.Models;

namespace Server.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ServerContext _db;
        public OrderRepository(ServerContext db)
        {
            _db = db;
        }

        public Task<Order> CreateOrder(Order order, CancellationToken cancellationToken)
        {
            order.TotalCount = order.Products.Count;
            order.TotalPrice = 0;
            foreach(Product p in order.Products)
            {
                order.TotalPrice += p.Price;
            }
            order.CreatedDate = DateTime.Now;
            order.ModifiedDate = DateTime.Now;
            _db.Orders.Add(order);
            _db.SaveChanges();
            return Task.FromResult(order);
        }

        public Task<Order> DeleteOrder(int OrderId, CancellationToken cancellationToken)
        {
            Order found = _db.Orders.FirstOrDefault(x => x.OrderId == OrderId);
            if (found != null)
            {
                _db.Orders.Remove(found);
                _db.SaveChanges();
            }
            return Task.FromResult(found);
        }

        public Task<Order> GetOrder(int OrderId, CancellationToken cancellationToken)
        {
            Order found = _db.Orders.FirstOrDefault(x => x.OrderId == OrderId);
            if (found == null)
            {
                throw new Exception("Order doesn't exist.");
            }
            return Task.FromResult(found);
        }

        public Task<List<Order>> GetOrders(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            if (!_db.Orders.Any())
            {
                throw new Exception("No Results.");
            }
            List<Order> orders = _db.Orders.ToList();
            orders = FilterOrders(orders, search);
            orders = SortOrders(orders, sort, asc);
            orders.Skip(pageNum * maxPerPage);
            orders.Take(maxPerPage);

            return Task.FromResult(orders);
        }

        public Task<int> GetTotalCountOrder(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Orders.Count());
        }

        public Task<Order> UpdateOrder(Order order, CancellationToken cancellationToken)
        {
            var found = _db.Orders.SingleOrDefault(i => i.OrderId == order.OrderId);
            if (found != null)
            {
                throw new Exception("Order doesn't exist.");
            }
            found.Products = order.Products;
            found.TotalCount = order.Products.Count;
            foreach (Product p in order.Products)
            {
                order.TotalPrice += p.Price;
            }
            found.ModifiedDate = DateTime.Now;
            _db.SaveChanges();
            return Task.FromResult(_db.Orders.SingleOrDefault(i => i.OrderId == order.OrderId));
        }

        private List<Order> SortOrders(List<Order> orders, string sort, bool asc)
        {
            if (asc)
            {
                switch (sort)
                {
                    case "OrderId":
                        orders.Sort((x, y) => x.OrderId.Value.CompareTo(y.OrderId));
                        break;
                    case "InferiorName":
                        orders.Sort((x, y) => x.Inferior.Name.CompareTo(y.Inferior.Name));
                        break;
                    case "SuperiorName":
                        orders.Sort((x, y) => x.Superior.Name.CompareTo(y.Superior.Name));
                        break;
                    case "TotalCount":
                        orders.Sort((x, y) => x.TotalCount.Value.CompareTo(y.TotalCount.Value));
                        break;
                    case "TotalPrice":
                        orders.Sort((x, y) => x.TotalPrice.Value.CompareTo(y.TotalPrice.Value));
                        break;
                    case "CreatedDate":
                        orders.Sort((x, y) => x.CreatedDate.Value.CompareTo(y.CreatedDate));
                        break;
                    case "ModifiedDate":
                        orders.Sort((x, y) => x.ModifiedDate.Value.CompareTo(y.ModifiedDate));
                        break;
                }

            }
            else
            {
                switch (sort)
                {
                    case "OrderId":
                        orders.Sort((x, y) => y.OrderId.Value.CompareTo(x.OrderId));
                        break;
                    case "InferiorName":
                        orders.Sort((x, y) => y.Inferior.Name.CompareTo(x.Inferior.Name));
                        break;
                    case "SuperiorName":
                        orders.Sort((x, y) => y.Superior.Name.CompareTo(x.Superior.Name));
                        break;
                    case "TotalCount":
                        orders.Sort((x, y) => y.TotalCount.Value.CompareTo(x.TotalCount.Value));
                        break;
                    case "TotalPrice":
                        orders.Sort((x, y) => y.TotalPrice.Value.CompareTo(x.TotalPrice.Value));
                        break;
                    case "CreatedDate":
                        orders.Sort((x, y) => y.CreatedDate.Value.CompareTo(x.CreatedDate));
                        break;
                    case "ModifiedDate":
                        orders.Sort((x, y) => y.ModifiedDate.Value.CompareTo(x.ModifiedDate));
                        break;
                }
            }
            return orders;
        }

        private List<Order> FilterOrders(List<Order> orders, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                orders.Where(u => u.OrderId.ToString().Contains(search) ||
                                u.Inferior.UserId.ToString().Contains(search) ||
                                u.Inferior.Name.Contains(search) ||
                                u.Inferior.Email.Contains(search) ||
                                (u.Inferior.Roles.SingleOrDefault(i => i.Name.Contains(search)) != null) ||
                                u.Superior.UserId.ToString().Contains(search) ||
                                u.Superior.Name.Contains(search) ||
                                u.Superior.Email.Contains(search) ||
                                (u.Superior.Roles.SingleOrDefault(i => i.Name.Contains(search)) != null) ||
                                u.TotalCount.Value.ToString().Contains(search) ||
                                u.TotalPrice.Value.ToString().Contains(search) ||
                                u.CreatedDate.ToString().Contains(search) ||
                                u.ModifiedDate.ToString().Contains(search));
            }
            return orders;
        }
    }
}