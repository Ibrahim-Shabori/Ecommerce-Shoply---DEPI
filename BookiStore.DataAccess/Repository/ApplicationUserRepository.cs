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
    public class ApplicationUserRepository:Repository<ApplicationUser>, IApplicationUserRepsoitory
    {
        private readonly ApplicationContext _db;
        public ApplicationUserRepository(ApplicationContext db) : base(db)
        {
            _db = db;
        }
    }
    
    
}
