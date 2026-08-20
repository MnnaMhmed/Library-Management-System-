using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Data
{
    public class LibraryDbContext : DbContext
    {
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<Author> Authors => Set<Author>();
        public DbSet<BookAuthor> BookAuthors => Set<BookAuthor>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<BookCategory> BookCategories => Set<BookCategory>();
        public DbSet<Publisher> Publishers => Set<Publisher>();
        public DbSet<Member> Members => Set<Member>();
        public DbSet<BorrowingTransaction> BorrowingTransactions => Set<BorrowingTransaction>();
        public DbSet<SystemUser> SystemUsers => Set<SystemUser>();
        public DbSet<UserActivityLog> UserActivityLogs => Set<UserActivityLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

     

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(b => b.Id);

                entity.Property(b => b.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(b => b.ISBN)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasIndex(b => b.ISBN)
                    .IsUnique();

                entity.Property(b => b.Edition)
                    .HasMaxLength(50);

                entity.Property(b => b.Language)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(b => b.Summary)
                    .HasMaxLength(2000);

                entity.Property(b => b.CoverImageUrl)
                    .HasMaxLength(500);

                entity.Property(b => b.Status)
                    .IsRequired();

                entity.HasOne(b => b.Publisher)
                    .WithMany(p => p.Books)
                    .HasForeignKey(b => b.PublisherId)
                    .OnDelete(DeleteBehavior.Restrict);
            });




            modelBuilder.Entity<Author>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(a => a.Name);
            });


            modelBuilder.Entity<BookAuthor>(entity =>
            {
                entity.HasKey(ba => new
                {
                    ba.BookId,
                    ba.AuthorId
                });

                entity.HasOne(ba => ba.Book)
                    .WithMany(b => b.BookAuthors)
                    .HasForeignKey(ba => ba.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ba => ba.Author)
                    .WithMany(a => a.BookAuthors)
                    .HasForeignKey(ba => ba.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });




            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasIndex(c => c.Name);

                entity.HasOne(c => c.ParentCategory)
                    .WithMany(c => c.SubCategories)
                    .HasForeignKey(c => c.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


            modelBuilder.Entity<BookCategory>(entity =>
            {
                entity.HasKey(bc => new
                {
                    bc.BookId,
                    bc.CategoryId
                });

                entity.HasOne(bc => bc.Book)
                    .WithMany(b => b.BookCategories)
                    .HasForeignKey(bc => bc.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(bc => bc.Category)
                    .WithMany(c => c.BookCategories)
                    .HasForeignKey(bc => bc.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Publisher>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(p => p.Address)
                    .HasMaxLength(300);

                entity.Property(p => p.PhoneNumber)
                    .HasMaxLength(30);

                entity.Property(p => p.Email)
                    .HasMaxLength(150);

                entity.HasIndex(p => p.Name);
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(m => m.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(m => m.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(m => m.Email)
                    .IsUnique();

                entity.Property(m => m.PhoneNumber)
                    .HasMaxLength(30);

                entity.Property(m => m.RegistrationDate)
                    .IsRequired();
            });
            modelBuilder.Entity<BorrowingTransaction>(entity =>
            {
                entity.HasKey(bt => bt.Id);

                entity.Property(bt => bt.BorrowedAt)
                    .IsRequired();

                entity.Property(bt => bt.DueDate)
                    .IsRequired();

                entity.HasOne(bt => bt.Book)
                    .WithMany(b => b.BorrowingTransactions)
                    .HasForeignKey(bt => bt.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(bt => bt.Member)
                    .WithMany(m => m.BorrowingTransactions)
                    .HasForeignKey(bt => bt.MemberId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SystemUser>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.UserName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasIndex(u => u.UserName)
                    .IsUnique();

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .IsRequired();
            });

            modelBuilder.Entity<UserActivityLog>(entity =>
            {
                entity.HasKey(log => log.Id);

                entity.Property(log => log.EntityName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(log => log.Action)
                    .IsRequired();

                entity.Property(log => log.Timestamp)
                    .IsRequired();

                entity.HasOne(log => log.SystemUser)
                    .WithMany(u => u.ActivityLogs)
                    .HasForeignKey(log => log.SystemUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}