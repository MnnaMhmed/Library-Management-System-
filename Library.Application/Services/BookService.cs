using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Application.DTOs;
using Library.Application.Interfaces;
using Library.Domain.Entities;
using Library.Domain.Enums;

namespace Library.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public BookService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService= activityLogService;
        }

        public async Task<IEnumerable<BookDto>> GetAllAsync()
        {
            var books = await _unitOfWork.Books.GetAllAsync();

            var result = new List<BookDto>();

            foreach (var book in books)
            {
                var authors = await _unitOfWork.BookAuthors
                    .FindAsync(x => x.BookId == book.Id);

                var categories = await _unitOfWork.BookCategories
                    .FindAsync(x => x.BookId == book.Id);

                result.Add(new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    ISBN = book.ISBN,
                    Edition = book.Edition,
                    PublicationYear = book.PublicationYear,
                    Summary = book.Summary,
                    Language = book.Language,
                    CoverImageUrl = book.CoverImageUrl,
                    Status = book.Status,
                    PublisherId = book.PublisherId,

                    AuthorIds = authors
                        .Select(x => x.AuthorId)
                        .ToList(),

                    CategoryIds = categories
                        .Select(x => x.CategoryId)
                        .ToList()
                });
            }

            return result;
        }
        public async Task<BookDto?> GetByIdAsync(int id)
        {
            var book = await _unitOfWork.Books.GetByIdAsync(id);

            if (book == null)
                return null;

            var authors = await _unitOfWork.BookAuthors
                .FindAsync(x => x.BookId == book.Id);

            var categories = await _unitOfWork.BookCategories
                .FindAsync(x => x.BookId == book.Id);

            return new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                ISBN = book.ISBN,
                Edition = book.Edition,
                PublicationYear = book.PublicationYear,
                Summary = book.Summary,
                Language = book.Language,
                CoverImageUrl = book.CoverImageUrl,
                PublisherId = book.PublisherId,
                Status=book.Status,
                AuthorIds = authors.Select(x => x.AuthorId).ToList(),
                CategoryIds = categories.Select(x => x.CategoryId).ToList()
            };
        }

        public async Task<BookDto> CreateAsync(CreateBookDto dto)
        {
            var publisher = await _unitOfWork.Publishers
                .GetByIdAsync(dto.PublisherId);

            if (publisher == null)
                throw new Exception("Publisher not found.");

            var book = new Book
            {
                Title = dto.Title,
                ISBN = dto.ISBN,
                Edition = dto.Edition,
                PublicationYear = dto.PublicationYear,
                Summary = dto.Summary,
                Status = dto.Status,
                Language = dto.Language,
                CoverImageUrl = dto.CoverImageUrl,
                PublisherId = dto.PublisherId
            };

            await _unitOfWork.Books.AddAsync(book);

            // Save once to generate Book.Id
            await _unitOfWork.SaveChangesAsync();

            await _activityLogService.LogAsync(
                ActivityAction.Create,
                "Book",
                book.Id);

            foreach (var authorId in dto.AuthorIds)
            {
                var author = await _unitOfWork.Authors
                    .GetByIdAsync(authorId);

                if (author != null)
                {
                    await _unitOfWork.BookAuthors.AddAsync(
                        new BookAuthor
                        {
                            BookId = book.Id,
                            AuthorId = authorId
                        });
                }
            }

            foreach (var categoryId in dto.CategoryIds)
            {
                var category = await _unitOfWork.Categories
                    .GetByIdAsync(categoryId);

                if (category != null)
                {
                    await _unitOfWork.BookCategories.AddAsync(
                        new BookCategory
                        {
                            BookId = book.Id,
                            CategoryId = categoryId
                        });
                }
            }

            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(book.Id)
                ?? throw new Exception("Book could not be created.");
        }

        public async Task<bool> UpdateAsync(int id, CreateBookDto dto)
        {
            var book = await _unitOfWork.Books.GetByIdAsync(id);

            if (book == null)
                return false;

            var publisher = await _unitOfWork.Publishers
                .GetByIdAsync(dto.PublisherId);

            if (publisher == null)
                return false;

            book.Title = dto.Title;
            book.ISBN = dto.ISBN;
            book.Edition = dto.Edition;
            book.PublicationYear = dto.PublicationYear;
            book.Summary = dto.Summary;
            book.Status = dto.Status;
            book.Language = dto.Language;
            book.CoverImageUrl = dto.CoverImageUrl;
            book.PublisherId = dto.PublisherId;

            _unitOfWork.Books.Update(book);

            var oldAuthors = await _unitOfWork.BookAuthors
                .FindAsync(x => x.BookId == id);

            foreach (var oldAuthor in oldAuthors)
            {
                _unitOfWork.BookAuthors.Delete(oldAuthor);
            }

            var oldCategories = await _unitOfWork.BookCategories
                .FindAsync(x => x.BookId == id);

            foreach (var oldCategory in oldCategories)
            {
                _unitOfWork.BookCategories.Delete(oldCategory);
            }

            foreach (var authorId in dto.AuthorIds)
            {
                var author = await _unitOfWork.Authors
                    .GetByIdAsync(authorId);

                if (author != null)
                {
                    await _unitOfWork.BookAuthors.AddAsync(
                        new BookAuthor
                        {
                            BookId = id,
                            AuthorId = authorId
                        });
                }
            }

            foreach (var categoryId in dto.CategoryIds)
            {
                var category = await _unitOfWork.Categories
                    .GetByIdAsync(categoryId);

                if (category != null)
                {
                    await _unitOfWork.BookCategories.AddAsync(
                        new BookCategory
                        {
                            BookId = id,
                            CategoryId = categoryId
                        });
                }
            }

            await _unitOfWork.SaveChangesAsync();

            await _activityLogService.LogAsync(
                ActivityAction.Update,
                "Book",
                id);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _unitOfWork.Books.GetByIdAsync(id);

            if (book == null)
                return false;

            var authors = await _unitOfWork.BookAuthors
                .FindAsync(x => x.BookId == id);

            foreach (var author in authors)
            {
                _unitOfWork.BookAuthors.Delete(author);
            }

            var categories = await _unitOfWork.BookCategories
                .FindAsync(x => x.BookId == id);

            foreach (var category in categories)
            {
                _unitOfWork.BookCategories.Delete(category);
            }

            _unitOfWork.Books.Delete(book);


            await _unitOfWork.SaveChangesAsync();

            await _activityLogService.LogAsync(
                ActivityAction.Delete,
                "Book",
                id);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}