using ShoplyStore.DataAccess.Data;
using ShoplyStore.DataAccess.Repository.IRepository;
using ShoplyStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoplyStore.DataAccess.Repository
{
    public class OrderDetailRepository:Repository<OrderDetail>, IOrderDetailRepository
    {
        private readonly ApplicationContext _db;
        public OrderDetailRepository(ApplicationContext db) : base(db)
        {
            _db = db;
        }
        public void Update(OrderDetail obj)
        {
            _db.OrderDetails.Update(obj);
        }
    }
    
    
}
