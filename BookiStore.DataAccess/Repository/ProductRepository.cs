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
    class ProductRepository : Repository<Product>, IProductRepository
    {
        private readonly ApplicationContext _db;
        public ProductRepository(ApplicationContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Product obj)
        {
            Product ExistingProduct = _db.Products.FirstOrDefault(p => p.Id == obj.Id);
            if (ExistingProduct != null)
            {
                ExistingProduct.Title = obj.Title;
                ExistingProduct.Description = obj.Description;
                ExistingProduct.ISBN = obj.ISBN;
                ExistingProduct.Author = obj.Author;
                ExistingProduct.ListPrice = obj.ListPrice;
                ExistingProduct.Price = obj.Price;
                ExistingProduct.Price50 = obj.Price50;
                ExistingProduct.Price100 = obj.Price100;
                ExistingProduct.CategoryId = obj.CategoryId;
                if (obj.ImageUrl != null)
                {
                    ExistingProduct.ImageUrl = obj.ImageUrl;
                }
            }
        }
    }
}
