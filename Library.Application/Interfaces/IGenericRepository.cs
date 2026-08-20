using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Library.Application.Interfaces
    {
        public interface IGenericRepository<T> where T : class
        {
        Task<T?> GetByIdAsync(
            int id,
            params Expression<Func<T, object>>[] includes);

        Task<IEnumerable<T>> GetAllAsync(
            params Expression<Func<T, object>>[] includes);

        Task<IEnumerable<T>> FindAsync(
                Expression<Func<T, bool>> predicate);

            Task AddAsync(T entity);

            void Update(T entity);

            void Delete(T entity);

            Task<bool> ExistsAsync(
                Expression<Func<T, bool>> predicate);
        }
    }

