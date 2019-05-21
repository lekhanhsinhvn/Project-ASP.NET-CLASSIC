using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Server.API.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> GetOrder(int OrderId, CancellationToken cancellationToken);

        Task<List<Order>> GetOrdersUserandStatus(int UserId, string status, CancellationToken requestAborted);

        Task<List<Order>> GetOrdersfromUserasSuperior(int UserId, int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<List<Order>> GetOrdersfromUserasInferior(int UserId, int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<List<Order>> GetOrders(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<int> GetTotalCountOrder(CancellationToken cancellationToken);

        Task<int> GetTotalCountOrdersfromUserasInferior(int UserId, CancellationToken cancellationToken);

        Task<int> GetTotalCountOrdersfromUserasSuperior(int UserId, CancellationToken cancellationToken);

        Task<Order> UpdateOrder(Order order, CancellationToken cancellationToken);

        Task<Order> DeleteOrder(int OrderId, CancellationToken cancellationToken);

        Task<Order> CreateOrder(int InferiorId,int SuperiorId, Order order, CancellationToken cancellationToken);
    }
}
