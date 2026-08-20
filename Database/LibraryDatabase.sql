

USE LibraryManagementSystem;
GO
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Authors] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(150) NOT NULL,
    CONSTRAINT [PK_Authors] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Categories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [ParentCategoryId] int NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Categories_Categories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Members] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(150) NOT NULL,
    [PhoneNumber] nvarchar(30) NOT NULL,
    [RegistrationDate] datetime2 NOT NULL,
    CONSTRAINT [PK_Members] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Publishers] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Address] nvarchar(300) NULL,
    [PhoneNumber] nvarchar(30) NULL,
    [Email] nvarchar(150) NULL,
    CONSTRAINT [PK_Publishers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SystemUsers] (
    [Id] int NOT NULL IDENTITY,
    [UserName] nvarchar(100) NOT NULL,
    [Email] nvarchar(150) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] int NOT NULL,
    CONSTRAINT [PK_SystemUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Books] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(200) NOT NULL,
    [ISBN] nvarchar(20) NOT NULL,
    [Edition] nvarchar(50) NULL,
    [PublicationYear] int NOT NULL,
    [Summary] nvarchar(2000) NULL,
    [Language] nvarchar(50) NOT NULL,
    [CoverImageUrl] nvarchar(500) NULL,
    [Status] int NOT NULL,
    [PublisherId] int NOT NULL,
    CONSTRAINT [PK_Books] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Books_Publishers_PublisherId] FOREIGN KEY ([PublisherId]) REFERENCES [Publishers] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [UserActivityLogs] (
    [Id] int NOT NULL IDENTITY,
    [SystemUserId] int NOT NULL,
    [Action] int NOT NULL,
    [EntityName] nvarchar(100) NOT NULL,
    [EntityId] int NULL,
    [Timestamp] datetime2 NOT NULL,
    CONSTRAINT [PK_UserActivityLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserActivityLogs_SystemUsers_SystemUserId] FOREIGN KEY ([SystemUserId]) REFERENCES [SystemUsers] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [BookAuthors] (
    [BookId] int NOT NULL,
    [AuthorId] int NOT NULL,
    CONSTRAINT [PK_BookAuthors] PRIMARY KEY ([BookId], [AuthorId]),
    CONSTRAINT [FK_BookAuthors_Authors_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [Authors] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_BookAuthors_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [BookCategories] (
    [BookId] int NOT NULL,
    [CategoryId] int NOT NULL,
    CONSTRAINT [PK_BookCategories] PRIMARY KEY ([BookId], [CategoryId]),
    CONSTRAINT [FK_BookCategories_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_BookCategories_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [BorrowingTransactions] (
    [Id] int NOT NULL IDENTITY,
    [BookId] int NOT NULL,
    [MemberId] int NOT NULL,
    [BorrowedAt] datetime2 NOT NULL,
    [DueDate] datetime2 NOT NULL,
    [ReturnedAt] datetime2 NULL,
    CONSTRAINT [PK_BorrowingTransactions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BorrowingTransactions_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_BorrowingTransactions_Members_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [Members] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_Authors_Name] ON [Authors] ([Name]);
GO

CREATE INDEX [IX_BookAuthors_AuthorId] ON [BookAuthors] ([AuthorId]);
GO

CREATE INDEX [IX_BookCategories_CategoryId] ON [BookCategories] ([CategoryId]);
GO

CREATE UNIQUE INDEX [IX_Books_ISBN] ON [Books] ([ISBN]);
GO

CREATE INDEX [IX_Books_PublisherId] ON [Books] ([PublisherId]);
GO

CREATE INDEX [IX_BorrowingTransactions_BookId] ON [BorrowingTransactions] ([BookId]);
GO

CREATE INDEX [IX_BorrowingTransactions_MemberId] ON [BorrowingTransactions] ([MemberId]);
GO

CREATE INDEX [IX_Categories_Name] ON [Categories] ([Name]);
GO

CREATE INDEX [IX_Categories_ParentCategoryId] ON [Categories] ([ParentCategoryId]);
GO

CREATE UNIQUE INDEX [IX_Members_Email] ON [Members] ([Email]);
GO

CREATE INDEX [IX_Publishers_Name] ON [Publishers] ([Name]);
GO

CREATE UNIQUE INDEX [IX_SystemUsers_Email] ON [SystemUsers] ([Email]);
GO

CREATE UNIQUE INDEX [IX_SystemUsers_UserName] ON [SystemUsers] ([UserName]);
GO

CREATE INDEX [IX_UserActivityLogs_SystemUserId] ON [UserActivityLogs] ([SystemUserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260818152813_Menna1', N'8.0.29');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Authors] ADD [BirthDate] datetime2 NULL;
GO

ALTER TABLE [Authors] ADD [Desciption] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [Authors] ADD [Nationality] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260819124702_menna3', N'8.0.29');
GO

COMMIT;
GO

