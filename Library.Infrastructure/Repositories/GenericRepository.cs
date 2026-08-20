using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Library.Application.Interfaces;
namespace Library.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T>
        where T : class
    {
        private readonly LibraryDbContext _context;

        public GenericRepository(LibraryDbContext context)
        {
            _context = context;
        }
        public async Task<T?> GetByIdAsync(
            int id,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _context.Set<T>();

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(x =>
                EF.Property<int>(x, "Id") == id);
        }
        public async Task<IEnumerable<T>> GetAllAsync(
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _context.Set<T>();

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(
            Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>()
                .Where(predicate)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>()
                .AddAsync(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>()
                .Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>()
                .Remove(entity);
        }

        public async Task<bool> ExistsAsync(
            Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>()
                .AnyAsync(predicate);
        }
    }
}