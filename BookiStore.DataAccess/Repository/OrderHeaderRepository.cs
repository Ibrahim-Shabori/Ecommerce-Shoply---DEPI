﻿using ShoplyStore.DataAccess.Data;
using ShoplyStore.DataAccess.Repository.IRepository;
using ShoplyStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoplyStore.DataAccess.Repository
{
    public class OrderHeaderRepository:Repository<OrderHeader>, IOrderHeaderRepository
    {
        private readonly ApplicationContext _db;
        public OrderHeaderRepository(ApplicationContext db) : base(db)
        {
            _db = db;
        }
        public void Update(OrderHeader obj)
        {
            _db.OrderHeaders.Update(obj);
        }

        public void UpdateStatus(int id, string orderStatus, string? paymentStatus = null)
        {

            var orderFromDb = _db.OrderHeaders.FirstOrDefault(u => u.Id == id);
            if (orderFromDb != null)
            {
                orderFromDb.OrderStatus = orderStatus;
                if (!string.IsNullOrEmpty(paymentStatus))
                {
                    orderFromDb.PaymentStatus = paymentStatus;
                }
            }
        }

        public void UpdateStripePaymentId(int id, string sessionId, string paymentIntentId)
        {

            var orderFromDb = _db.OrderHeaders.FirstOrDefault(u => u.Id == id);
            if (orderFromDb != null)
            {
                if(!string.IsNullOrEmpty(sessionId))
                {
                    orderFromDb.SessionId = sessionId;
                }

                if (!string.IsNullOrEmpty(paymentIntentId))
                {
                    orderFromDb.PaymentIntentId = paymentIntentId;
                    orderFromDb.PaymentDate = DateTime.Now;
                }
            }
        }
    }
    
    
}
