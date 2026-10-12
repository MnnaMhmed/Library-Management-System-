import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-books',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  template: `
    <div class="head">
      <div>
        <div class="eyebrow">Library collection</div>
        <h1 class="page-title">Books</h1>
        <p>Search, manage, and explore your library collection.</p>
      </div>

      <button class="btn primary" type="button" (click)="openAddForm()">
        ＋ Add Book
      </button>
    </div>

    <div class="notice success" *ngIf="success">{{ success }}</div>
    <div class="notice error" *ngIf="error">{{ error }}</div>

    <!-- Add / Edit Form -->
    <div class="card form-panel" *ngIf="showForm">
      <div class="form-heading">
        <div>
          <h2>{{ isEditing ? 'Edit book' : 'Add a new book' }}</h2>
          <p>
            {{ isEditing
              ? 'Update the book details below.'
              : 'Enter the book details below.' }}
          </p>
        </div>

        <button class="btn" type="button" (click)="closeForm()">
          Cancel
        </button>
      </div>

      <form
        #bookForm="ngForm"
        class="book-form"
        (ngSubmit)="saveBook()"
      >
        <label>
          Book title *
          <input
            class="input"
            name="title"
            [(ngModel)]="form.title"
            required
            maxlength="200"
            placeholder="e.g. Clean Code"
          >
        </label>

        <label>
          ISBN *
          <input
            class="input"
            name="isbn"
            [(ngModel)]="form.isbn"
            required
            placeholder="Enter ISBN"
          >
        </label>

        <label>
          Edition
          <input
            class="input"
            name="edition"
            [(ngModel)]="form.edition"
            placeholder="e.g. 1st Edition"
          >
        </label>

        <label>
          Publication year *
          <input
            class="input"
            type="number"
            name="publicationYear"
            [(ngModel)]="form.publicationYear"
            required
            min="1000"
            max="2100"
          >
        </label>

        <label>
          Language *
          <input
            class="input"
            name="language"
            [(ngModel)]="form.language"
            required
            placeholder="e.g. English"
          >
        </label>

        <label>
          Publisher ID *
          <input
            class="input"
            type="number"
            name="publisherId"
            [(ngModel)]="form.publisherId"
            required
            min="1"
          >
        </label>

        <label>
          Author IDs *
          <input
            class="input"
            name="authorIds"
            [(ngModel)]="authorIdsText"
            required
            placeholder="e.g. 1, 2"
          >
          <small>Enter existing author IDs separated by commas.</small>
        </label>

        <label>
          Category IDs *
          <input
            class="input"
            name="categoryIds"
            [(ngModel)]="categoryIdsText"
            required
            placeholder="e.g. 1, 3"
          >
          <small>Enter existing category IDs separated by commas.</small>
        </label>

        <label>
          Status
          <select class="input" name="status" [(ngModel)]="form.status">
            <option [ngValue]="0">Status 0</option>
            <option [ngValue]="1">Status 1</option>
          </select>
        </label>

        <label>
          Cover image URL
          <input
            class="input"
            name="coverImageUrl"
            [(ngModel)]="form.coverImageUrl"
            placeholder="https://example.com/book.jpg"
          >
        </label>

        <label class="full">
          Summary
          <textarea
            class="input"
            name="summary"
            [(ngModel)]="form.summary"
            rows="3"
            placeholder="Short description of the book"
          ></textarea>
        </label>

        <div class="form-actions full">
          <button class="btn" type="button" (click)="closeForm()">
            Cancel
          </button>

          <button
            class="btn primary"
            type="submit"
            [disabled]="saving || bookForm.invalid"
          >
            {{
              saving
                ? 'Saving...'
                : (isEditing ? 'Update Book' : 'Save Book')
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- Search -->
    <div class="toolbar card">
      <input
        class="input"
        [(ngModel)]="q"
        placeholder="⌕ Search by title or ISBN..."
      >

      <button
        class="btn"
        type="button"
        (click)="loadBooks()"
        [disabled]="loading"
      >
        {{ loading ? 'Loading...' : '↻ Refresh' }}
      </button>
    </div>

    <div class="card message" *ngIf="loading">
      Loading books...
    </div>

    <div class="card message" *ngIf="!loading && filtered().length === 0">
      No books found. Try another search or add a new book.
    </div>

    <!-- Books Grid -->
    <div class="books" *ngIf="!loading && filtered().length > 0">
      <div class="card book" *ngFor="let b of filtered()">
        <a class="book-link" [routerLink]="['/books', getBookId(b)]">
          <div class="cover">
            <img
              *ngIf="b.coverImageUrl"
              [src]="b.coverImageUrl"
              [alt]="b.title"
              (error)="imageFailed($event)"
            >

            <span *ngIf="!b.coverImageUrl">{{ b.title }}</span>
          </div>

          <h3>{{ b.title }}</h3>
          <p>ISBN: {{ b.isbn || 'Not provided' }}</p>
          <p>Published: {{ b.publicationYear || 'Unknown' }}</p>
          <small>Book ID: {{ getBookId(b) }}</small>
        </a>

        <div class="book-actions">
          <button
            class="btn"
            type="button"
            (click)="openEditForm(b)"
          >
            Edit
          </button>

          <button
            class="btn danger"
            type="button"
            (click)="deleteBook(b)"
            [disabled]="deletingId === getBookId(b)"
          >
            {{ deletingId === getBookId(b) ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 16px;
      margin-bottom: 20px;
    }

    .head p,
    .form-heading p {
      color: var(--muted);
      margin: 6px 0;
    }

    .toolbar {
      padding: 14px;
      display: flex;
      gap: 10px;
      margin-bottom: 18px;
    }

    .toolbar .input {
      flex: 1;
      min-width: 0;
    }

    .books {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .book {
      display: flex;
      flex-direction: column;
      padding: 14px;
      min-width: 0;
    }

    .book-link {
      display: block;
      flex: 1;
      color: inherit;
      text-decoration: none;
      min-width: 0;
    }

    .cover {
      height: 220px;
      overflow: hidden;
      border-radius: 10px;
      background: linear-gradient(145deg, #efe2cc, #cba97a);
      display: grid;
      place-items: center;
      text-align: center;
      padding: 18px;
      box-sizing: border-box;
      color: #493a2b;
      font: 600 21px 'Playfair Display', serif;
      overflow-wrap: anywhere;
    }

    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .book h3 {
      font: 600 16px 'Playfair Display', serif;
      margin: 12px 0 6px;
      overflow-wrap: anywhere;
    }

    .book p,
    .book small {
      font-size: 11px;
      color: var(--muted);
      display: block;
      overflow-wrap: anywhere;
      margin: 0 0 6px;
    }

    .book-actions {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }

    .book-actions .btn {
      flex: 1;
      min-width: 0;
    }

    .btn.danger {
      background: #fff0ef;
      color: #a52a2a;
      border: 1px solid #f1cbc7;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-panel {
      padding: 22px;
      margin-bottom: 18px;
    }

    .form-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .form-heading h2 {
      margin: 0;
      font-size: 20px;
    }

    .book-form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .book-form label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      font-size: 12px;
      font-weight: 600;
      min-width: 0;
    }

    .book-form .input {
      width: 100%;
      box-sizing: border-box;
    }

    .book-form small {
      color: var(--muted);
      font-weight: 400;
    }

    .full {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .notice,
    .message {
      padding: 14px;
      margin-bottom: 16px;
      border-radius: 10px;
    }

    .success {
      background: #e5f8ed;
      color: #17663c;
    }

    .error {
      background: #fff0ef;
      color: #a52a2a;
    }

    @media (max-width: 1100px) {
      .books {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 750px) {
      .books {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .toolbar {
        flex-direction: column;
      }

      .book-form {
        grid-template-columns: 1fr;
      }

      .full {
        grid-column: auto;
      }
    }

    @media (max-width: 450px) {
      .books {
        grid-template-columns: 1fr;
      }

      .head {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class BooksComponent implements OnInit {
  q = '';
  books: any[] = [];

  loading = false;
  saving = false;
  showForm = false;

  success = '';
  error = '';

  isEditing = false;
  editingBookId: number | null = null;
  deletingId: number | null = null;

  authorIdsText = '';
  categoryIdsText = '';

  form: any = this.emptyForm();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  private emptyForm(): any {
    return {
      title: '',
      isbn: '',
      edition: '',
      publicationYear: new Date().getFullYear(),
      summary: '',
      status: 0,
      language: 'English',
      coverImageUrl: '',
      publisherId: null
    };
  }

  getBookId(book: any): number {
    return Number(book?.id ?? book?.bookId ?? 0);
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.api.get<any>('Books/GetAllBooks').subscribe({
      next: (response: any) => {
        const data = Array.isArray(response)
          ? response
          : response?.data ?? response?.items ?? response?.books ?? [];

        this.books = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Load books error:', err);
        this.loading = false;
        this.error = this.getErrorMessage(err, 'Could not load books.');
      }
    });
  }

  filtered(): any[] {
    const term = this.q.trim().toLowerCase();

    if (!term) {
      return this.books;
    }

    return this.books.filter((book: any) =>
      String(book.title ?? '').toLowerCase().includes(term) ||
      String(book.isbn ?? '').toLowerCase().includes(term)
    );
  }

  openAddForm(): void {
    this.error = '';
    this.success = '';

    this.isEditing = false;
    this.editingBookId = null;
    this.form = this.emptyForm();
    this.authorIdsText = '';
    this.categoryIdsText = '';
    this.showForm = true;
  }

openEditForm(book: any): void {
  console.log('Selected book:', book);

  const id = this.getBookId(book);
  console.log('Book ID:', id);

  this.error = '';
  this.success = '';

  if (!id || !Number.isInteger(id)) {
    this.error = 'Could not identify this book. Please refresh the list.';
    return;
  }

  // كمّلي باقي الكود الحالي كما هو

    this.isEditing = true;
    this.editingBookId = id;

    this.form = {
      title: book.title ?? '',
      isbn: book.isbn ?? '',
      edition: book.edition ?? '',
      publicationYear: book.publicationYear ?? new Date().getFullYear(),
      summary: book.summary ?? '',
      status: Number(book.status ?? 0),
      language: book.language ?? 'English',
      coverImageUrl: book.coverImageUrl ?? '',
      publisherId: book.publisherId ?? book.publisher?.id ?? null
    };

    this.authorIdsText = this.getIdsText(
      book.authorIds ?? book.authors ?? book.bookAuthors
    );

    this.categoryIdsText = this.getIdsText(
      book.categoryIds ?? book.categories ?? book.bookCategories
    );

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingBookId = null;
    this.error = '';
  }

  saveBook(): void {
    this.error = '';
    this.success = '';

    const authorIds = this.parseIds(this.authorIdsText);
    const categoryIds = this.parseIds(this.categoryIdsText);
    const publisherId = Number(this.form.publisherId);
    const publicationYear = Number(this.form.publicationYear);

    if (!this.form.title?.trim() || !this.form.isbn?.trim()) {
      this.error = 'Book title and ISBN are required.';
      return;
    }

    if (!Number.isInteger(publisherId) || publisherId <= 0) {
      this.error = 'Enter a valid Publisher ID.';
      return;
    }

    if (authorIds.length === 0) {
      this.error = 'Enter at least one valid Author ID.';
      return;
    }

    if (categoryIds.length === 0) {
      this.error = 'Enter at least one valid Category ID.';
      return;
    }

    if (
      !Number.isInteger(publicationYear) ||
      publicationYear < 1000 ||
      publicationYear > 2100
    ) {
      this.error = 'Enter a valid publication year.';
      return;
    }

    const payload = {
      title: this.form.title.trim(),
      isbn: this.form.isbn.trim(),
      edition: this.form.edition?.trim() || '',
      publicationYear,
      summary: this.form.summary?.trim() || '',
      status: Number(this.form.status),
      language: this.form.language?.trim() || 'English',
      coverImageUrl: this.form.coverImageUrl?.trim() || '',
      publisherId,
      authorIds,
      categoryIds
    };

    const editing = this.isEditing;
    const bookId = this.editingBookId;

    if (editing && (!bookId || bookId <= 0)) {
      this.error = 'Could not identify the book to update.';
      return;
    }

    this.saving = true;

    const request = editing
      ? this.api.put<any>('Books/UpdateBook', bookId as number, payload)
      : this.api.post<any>('Books/AddBook', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.isEditing = false;
        this.editingBookId = null;

        this.success = editing
          ? 'Book updated successfully!'
          : 'Book added successfully!';

        this.loadBooks();
      },
      error: (err: any) => {
        console.error('Save book error:', err);
        this.saving = false;
        this.error = this.getErrorMessage(
          err,
          editing ? 'Could not update the book.' : 'Could not add the book.'
        );
      }
    });
  }

  deleteBook(book: any): void {
    const id = this.getBookId(book);

    if (!id) {
      this.error = 'Could not identify the book to delete.';
      return;
    }

    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    this.error = '';
    this.success = '';
    this.deletingId = id;

    this.api.delete('Books/DeleteVBook', id).subscribe({
      next: () => {
        this.deletingId = null;
        this.books = this.books.filter(
          (item: any) => this.getBookId(item) !== id
        );
        this.success = 'Book deleted successfully!';
      },
      error: (err: any) => {
        console.error('Delete book error:', err);
        this.deletingId = null;
        this.error = this.getErrorMessage(err, 'Could not delete the book.');
      }
    });
  }

  private getIdsText(value: any): string {
    if (!Array.isArray(value)) {
      return '';
    }

    return value
      .map((item: any) => {
        if (typeof item === 'number' || typeof item === 'string') {
          return Number(item);
        }

        return Number(
          item?.id ??
          item?.authorId ??
          item?.categoryId ??
          item?.author?.id ??
          item?.category?.id
        );
      })
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .join(', ');
  }

  private parseIds(value: string): number[] {
    return [...new Set(
      String(value ?? '')
        .split(',')
        .map((item: string) => Number(item.trim()))
        .filter((id: number) => Number.isInteger(id) && id > 0)
    )];
  }

  private getErrorMessage(err: any, fallback: string): string {
    return (
      err?.error?.message ||
      err?.error?.Message ||
      err?.error?.title ||
      (typeof err?.error === 'string' ? err.error : '') ||
      `${fallback} (HTTP ${err?.status || 'unknown'}).`
    );
  }

  imageFailed(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}