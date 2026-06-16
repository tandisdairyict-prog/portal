using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class BaseRepository<T>(AppDbContext db) : IRepository<T> where T : class
{
    protected readonly AppDbContext _db = db;

    public virtual async Task<T?> GetByIdAsync(int id) => await _db.Set<T>().FindAsync(id);
    public virtual async Task<IEnumerable<T>> GetAllAsync() => await _db.Set<T>().ToListAsync();
    public virtual async Task<T> AddAsync(T entity) { _db.Set<T>().Add(entity); return entity; }
    public virtual async Task UpdateAsync(T entity) => _db.Set<T>().Update(entity);
    public virtual async Task DeleteAsync(T entity) => _db.Set<T>().Remove(entity);
    public virtual async Task<bool> ExistsAsync(int id) => await _db.Set<T>().FindAsync(id) != null;
}
