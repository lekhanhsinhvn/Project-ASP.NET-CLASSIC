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

        public Task<Order> CreateOrder(int InferiorId, int SuperiorId, Order order, CancellationToken cancellationToken)
        {
            order.Inferior = _db.Users.FirstOrDefault(x => x.UserId == InferiorId);
            order.Superior = _db.Users.FirstOrDefault(x => x.UserId == SuperiorId);
            if(order.Inferior == null || order.Superior == null)
            {
                throw new Exception("Order not valid");
            }
            order.TotalCount = 0;
            order.TotalPrice = 0;
            foreach (OrderDetail d in order.OrderDetails)
            {
                Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                if (foundProduct == null)
                {
                    throw new Exception("Product not valid");
                }
                if (d.Quantity > foundProduct.Quantity)
                {
                    throw new Exception("Product" + foundProduct.Name + "out of stock");
                }
                d.Product = foundProduct;
                d.UnitPrice = foundProduct.Price.Value;
                order.TotalCount += d.Quantity;
                order.TotalPrice += d.UnitPrice * d.Quantity;
            }
            order.Status = "Adding";
            order.CreatedDate = DateTime.Now;
            order.ModifiedDate = DateTime.Now;
            _db.Orders.Add(order);
            foreach (OrderDetail d in order.OrderDetails)
            {
                Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                foundProduct.Quantity -= d.Quantity;
            }
            _db.SaveChanges();
            return Task.FromResult(order);
        }

        public Task<Order> DeleteOrder(int OrderId, CancellationToken cancellationToken)
        {
            Order found = _db.Orders.FirstOrDefault(x => x.OrderId == OrderId);
            if (found == null)
            {
                throw new Exception("Order doesn't exist.");
            }
            if (found.OrderDetails != null)
            {
                foreach (OrderDetail d in found.OrderDetails)
                {
                    Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                    foundProduct.Quantity += d.Quantity;
                }
            }
            _db.Orders.Remove(found);
            _db.SaveChanges();
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

        public Task<List<Order>> GetOrdersUserandStatus(int UserId, string status, CancellationToken cancellationToken)
        {
            List<Order> orders = _db.Orders.ToList();
            orders = orders.Where(o => o.Status.Equals(status) && o.Inferior.UserId == UserId).ToList();
            return Task.FromResult(orders);
        }

        public Task<List<Order>> GetOrdersfromUserasSuperior(int UserId, int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            List<Order> orders = _db.Orders.ToList();
            orders = orders.Where(o => !o.Status.Equals("Adding") && o.Superior.UserId == UserId).ToList();
            orders = FilterOrders(orders, search);
            orders = SortOrders(orders, sort, asc);
            orders = orders.Skip(pageNum * maxPerPage).ToList();
            orders = orders.Take(maxPerPage).ToList();
            if (!orders.Any())
            {
                throw new Exception("No Results.");
            }
            return Task.FromResult(orders);
        }

        public Task<List<Order>> GetOrdersfromUserasInferior(int UserId, int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            List<Order> orders = _db.Orders.ToList();
            orders = orders.Where(o => o.Inferior.UserId == UserId).ToList();
            orders = FilterOrders(orders, search);
            orders = SortOrders(orders, sort, asc);
            orders = orders.Skip(pageNum * maxPerPage).ToList();
            orders = orders.Take(maxPerPage).ToList();
            if (!orders.Any())
            {
                throw new Exception("No Results.");
            }
            return Task.FromResult(orders);
        }

        public Task<List<Order>> GetOrders(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            
            List<Order> orders = _db.Orders.ToList();
            orders = FilterOrders(orders, search);
            orders = SortOrders(orders, sort, asc);
            orders = orders.Skip(pageNum * maxPerPage).ToList();
            orders = orders.Take(maxPerPage).ToList();
            if (!orders.Any())
            {
                throw new Exception("No Results.");
            }

            return Task.FromResult(orders);
        }

        public Task<int> GetTotalCountOrder(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Orders.Count());
        }

        public Task<int> GetTotalCountOrdersfromUserasInferior(int UserId, CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Orders.Where(o => o.Inferior.UserId == UserId).Count());
        }

        public Task<int> GetTotalCountOrdersfromUserasSuperior(int UserId, CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Orders.Where(o => !o.Status.Equals("Adding") && o.Superior.UserId == UserId).Count());
        }

        public Task<Order> UpdateOrder(Order order, CancellationToken cancellationToken)
        {
            var found = _db.Orders.SingleOrDefault(i => i.OrderId == order.OrderId);
            if (found == null)
            {
                throw new Exception("Order doesn't exist.");
            }
            if (!found.Status.Equals("Adding"))
            {
                throw new Exception("Order invaild.");
            }
            // reset
            order.TotalCount = 0;
            order.TotalPrice = 0;
            if (found.OrderDetails != null)
            {
                foreach (OrderDetail d in found.OrderDetails)
                {
                    Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                    foundProduct.Quantity += d.Quantity;
                }
            }

            List<OrderDetail> orderDetails = new List<OrderDetail>();
            if (order.OrderDetails != null)
            {
                foreach (OrderDetail d in order.OrderDetails)
                {
                    if (d.Quantity < 0 || d.UnitPrice < 0)
                    {
                        throw new Exception("Order invaild.");
                    }
                    Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                    if (foundProduct == null)
                    {
                        throw new Exception("Product not valid");
                    }
                    if (d.Quantity > foundProduct.Quantity)
                    {
                        throw new Exception("Product " + foundProduct.Name + "out of stock");
                    }
                    d.Product = foundProduct;
                    d.UnitPrice = foundProduct.Price.Value;

                    // sort so no duplicate product & 0 quantity
                    Boolean has = false;
                    foreach (OrderDetail p in orderDetails)
                    {
                        if (p.Product == d.Product)
                        {
                            p.Quantity += d.Quantity;
                            p.UnitPrice = d.UnitPrice;
                            has = true;
                        }
                    }
                    if (!has)
                    {
                        orderDetails.Add(d);
                    }
                    if (d.Quantity <=0 )
                    {
                        orderDetails.Remove(d);
                    }

                    order.TotalCount += d.Quantity;
                    order.TotalPrice += d.UnitPrice * d.Quantity;
                }
                foreach (OrderDetail d in orderDetails)
                {
                    Product foundProduct = _db.Products.FirstOrDefault(x => x.ProductId == d.Product.ProductId);
                    foundProduct.Quantity -= d.Quantity;
                }
            }
            found.Status = string.IsNullOrWhiteSpace(order.Status) ? found.Status : order.Status;
            found.OrderDetails = orderDetails;
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
                return orders.Where(u => u.OrderId.ToString().Contains(search) ||
                                u.Inferior.UserId.ToString().Contains(search) ||
                                u.Inferior.Name.Contains(search) ||
                                u.Inferior.Email.Contains(search) ||
                                //(u.Inferior.Roles.SingleOrDefault(i => i.Name.Contains(search)) != null) ||
                                u.Superior.UserId.ToString().Contains(search) ||
                                u.Superior.Name.Contains(search) ||
                                u.Superior.Email.Contains(search) ||
                                //(u.Superior.Roles.SingleOrDefault(i => i.Name.Contains(search)) != null) ||
                                u.TotalCount.Value.ToString().Contains(search) ||
                                u.TotalPrice.Value.ToString().Contains(search) ||
                                u.Status.Contains(search) ||
                                u.CreatedDate.ToString().Contains(search) ||
                                u.ModifiedDate.ToString().Contains(search)).ToList();
            }
            return orders;
        }
    }
}