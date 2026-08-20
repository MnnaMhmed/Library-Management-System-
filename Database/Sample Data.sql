
USE LibraryManagementSystem;
GO

INSERT INTO Publishers (Name, Address, PhoneNumber, Email)
VALUES
('Prentice Hall', 'New Jersey, USA', '+1-555-100-1000', 'info@prenticehall.com'),
('Penguin Books', 'London, UK', '+44-555-200-2000', 'info@penguin.com'),
('OReilly Media', 'California, USA', '+1-555-300-3000', 'info@oreilly.com'),
('McGraw Hill', 'New York, USA', '+1-555-400-4000', 'info@mcgrawhill.com'),
('Wiley', 'New Jersey, USA', '+1-555-500-5000', 'info@wiley.com');

INSERT INTO Authors (Name, BirthDate, Desciption, Nationality)
VALUES
('Robert C. Martin', '1952-12-05', 'Software engineer and author known for Clean Code and software craftsmanship.', 'American'),
('James Clear', '1986-01-01', 'Author and speaker known for his work about habits and personal development.', 'American'),
('Martin Fowler', '1963-12-18', 'Software developer and author known for software architecture and refactoring.', 'British'),
('Andrew Hunt', '1964-01-01', 'Author and software developer known for The Pragmatic Programmer.', 'American'),
('David Thomas', '1956-01-01', 'Software developer and co-author of The Pragmatic Programmer.', 'American'),
('Eric Evans', '1964-01-01', 'Software developer and author known for Domain Driven Design.', 'American'),
('Joshua Bloch', '1961-08-28', 'Software engineer and author known for Effective Java.', 'American'),
('Thomas H. Cormen', '1956-06-22', 'Computer scientist and co-author of Introduction to Algorithms.', 'American');

INSERT INTO Categories (Name, ParentCategoryId)
VALUES
('Programming', NULL),
('Personal Development', NULL),
('Computer Science', NULL),
('Software Engineering', 1),
('Web Development', 1),
('Productivity', 2),
('Software Architecture', 3),
('Algorithms', 3),
('Object Oriented Programming', 1),
('Database', 3);

INSERT INTO Members (FirstName, LastName, Email, PhoneNumber, RegistrationDate)
VALUES
('Ahmed', 'Ali', 'ahmed.ali@example.com', '01000000001', '2026-08-01'),
('Sara', 'Mohamed', 'sara.mohamed@example.com', '01000000002', '2026-08-02'),
('Omar', 'Hassan', 'omar.hassan@example.com', '01000000003', '2026-08-03'),
('Mariam', 'Ahmed', 'mariam.ahmed@example.com', '01000000004', '2026-08-04'),
('Youssef', 'Khaled', 'youssef.khaled@example.com', '01000000005', '2026-08-05'),
('Nour', 'Ibrahim', 'nour.ibrahim@example.com', '01000000006', '2026-08-06'),
('Karim', 'Mahmoud', 'karim.mahmoud@example.com', '01000000007', '2026-08-07'),
('Hana', 'Samir', 'hana.samir@example.com', '01000000008', '2026-08-08');

INSERT INTO Books
(Title, ISBN, Edition, PublicationYear, Summary, Language, CoverImageUrl, Status, PublisherId)
VALUES
('Clean Code', '9780132350884', '1st', 2008, 'A handbook of agile software craftsmanship.', 'English', 'https://example.com/clean-code.jpg', 0, 1),
('Atomic Habits', '9780735211292', '1st', 2018, 'A practical guide to building good habits and breaking bad ones.', 'English', 'https://example.com/atomic-habits.jpg', 0, 2),
('Refactoring', '9780134757599', '2nd', 2018, 'A guide to improving the design of existing code.', 'English', 'https://example.com/refactoring.jpg', 1, 3),
('The Pragmatic Programmer', '9780135957059', '2nd', 2019, 'A practical guide to software development and professional programming.', 'English', 'https://example.com/pragmatic-programmer.jpg', 0, 3),
('Domain-Driven Design', '9780321125217', '1st', 2003, 'A guide to designing complex software systems around domain models.', 'English', 'https://example.com/ddd.jpg', 0, 4),
('Effective Java', '9780134685991', '3rd', 2018, 'Best practices for the Java programming language.', 'English', 'https://example.com/effective-java.jpg', 0, 5),
('Introduction to Algorithms', '9780262046305', '4th', 2022, 'Comprehensive introduction to algorithms and their analysis.', 'English', 'https://example.com/algorithms.jpg', 1, 4),
('Clean Architecture', '9780134494166', '1st', 2017, 'A guide to software architecture and design principles.', 'English', 'https://example.com/clean-architecture.jpg', 0, 1),
('The Clean Coder', '9780137081073', '1st', 2011, 'A guide to professional programming practices.', 'English', 'https://example.com/clean-coder.jpg', 0, 1),
('Code Complete', '9780735619678', '2nd', 2004, 'A practical handbook of software construction.', 'English', 'https://example.com/code-complete.jpg', 0, 4),
('Design Patterns', '9780201633610', '1st', 1994, 'Elements of reusable object-oriented software.', 'English', 'https://example.com/design-patterns.jpg', 0, 4),
('The 7 Habits of Highly Effective People', '9781982137274', '1st', 2020, 'A guide to personal effectiveness and productivity.', 'English', 'https://example.com/7-habits.jpg', 0, 2);

INSERT INTO BookAuthors (BookId, AuthorId)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 1),
(9, 1),
(10, 4),
(10, 5),
(11, 3),
(12, 2);

INSERT INTO BookCategories (BookId, CategoryId)
VALUES
(1, 1),
(1, 4),
(1, 9),
(2, 2),
(2, 6),
(3, 1),
(3, 4),
(3, 7),
(4, 1),
(4, 4),
(4, 9),
(5, 3),
(5, 7),
(6, 1),
(6, 9),
(7, 3),
(7, 8),
(8, 1),
(8, 4),
(8, 7),
(9, 1),
(9, 4),
(10, 1),
(10, 4),
(11, 1),
(11, 9),
(12, 2),
(12, 6);

INSERT INTO BorrowingTransactions
(BookId, MemberId, BorrowedAt, DueDate, ReturnedAt)
VALUES
(3, 1, '2026-08-10', '2026-08-24', NULL),
(7, 2, '2026-08-12', '2026-08-26', NULL),
(1, 3, '2026-07-01', '2026-07-15', '2026-07-12'),
(2, 4, '2026-07-05', '2026-07-19', '2026-07-17'),
(4, 5, '2026-07-10', '2026-07-24', '2026-07-20'),
(5, 6, '2026-07-15', '2026-07-29', '2026-07-25'),
(6, 7, '2026-07-20', '2026-08-03', '2026-07-30');


SELECT * FROM Publishers;
SELECT * FROM Authors;
SELECT * FROM Categories;
SELECT * FROM Members;
SELECT * FROM Books;
SELECT * FROM BookAuthors;
SELECT * FROM BookCategories;
SELECT * FROM BorrowingTransactions;
