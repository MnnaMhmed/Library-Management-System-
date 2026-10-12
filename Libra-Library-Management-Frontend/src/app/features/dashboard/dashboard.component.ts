import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

interface Book {
  id: number;
  title: string;
  authorIds?: number[];
  categoryIds?: number[];
  author?: string;
  authors?: { id: number; name: string }[];
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
}

interface Borrowing {
  id: number;
  bookId: number;
  memberId: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string | null;
}

interface Category {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
}

interface ActivityItem {
  i: string;
  t: string;
  m: string;
}

interface PopularBook {
  c: string;
  t: string;
  a: string;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [NgFor, NgIf, DecimalPipe],
  template: `
    <div class="head">
      <div>
        <div class="eyebrow">Library overview</div>
        <h1 class="page-title">Good Morning, Menna ☀️</h1>
        <p>Here's what's happening with your library today.</p>
      </div>

      <button
        class="btn primary"
        type="button"
        (click)="refresh()"
        [disabled]="loading"
      >
        {{ loading ? 'Loading...' : '↻ Refresh' }}
      </button>
    </div>

    <div class="notice error" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="stats">
      <div class="card stat">
        <span>▤</span>
        <b>{{ totalBooks | number }}</b>
        <small>Total Books</small>
        <em>Books in the collection</em>
      </div>

      <div class="card stat">
        <span>♙</span>
        <b>{{ totalMembers | number }}</b>
        <small>Total Members</small>
        <em>Registered members</em>
      </div>

      <div class="card stat">
        <span>↔</span>
        <b>{{ activeBorrowings | number }}</b>
        <small>Active Borrowings</small>
        <em>Books not yet returned</em>
      </div>

      <div class="card stat">
        <span>!</span>
        <b>{{ overdueBooks | number }}</b>
        <small>Overdue Books</small>
        <em>Past their due date</em>
      </div>
    </div>

    <div class="grid">
      <div class="card panel">
        <b>Borrowings Trend</b>

        <div class="chart-empty" *ngIf="!borrowings.length">
          No borrowing data available yet.
        </div>

        <svg
          *ngIf="borrowings.length"
          viewBox="0 0 700 230"
          preserveAspectRatio="none"
          role="img"
          aria-label="Borrowing activity overview"
        >
          <path
            [attr.d]="trendArea"
            fill="#10b98112"
          />

          <path
            [attr.d]="trendPath"
            fill="none"
            stroke="#10b981"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>

        <div class="months">
          <span *ngFor="let month of months">
            {{ month }}
          </span>
        </div>
      </div>

      <div class="card panel">
        <b>Books by Category</b>

        <div class="donut">
          <div
            class="donut-chart"
            [style.background]="categoryGradient"
          >
            <span>{{ totalBooks | number }}</span>
          </div>

          <ul>
            <li *ngFor="let category of categoryStats">
              <span class="category-name">
                <i [style.background]="category.color"></i>
                {{ category.name }}
              </span>

              <b>{{ category.percentage }}%</b>
            </li>

            <li *ngIf="!categoryStats.length">
              <span>No categories found</span>
              <b>—</b>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card panel">
        <b>Recent Activity</b>

        <div class="activity" *ngFor="let item of activity">
          <span>{{ item.i }}</span>

          <div>
            <b>{{ item.t }}</b>
            <small>{{ item.m }}</small>
          </div>
        </div>

        <p class="empty" *ngIf="!activity.length">
          No recent activity available.
        </p>
      </div>

      <div class="card panel">
        <b>Popular Books</b>

        <div class="activity" *ngFor="let book of books">
          <span class="book">{{ book.c }}</span>

          <div>
            <b>{{ book.t }}</b>
            <small>{{ book.a }}</small>
          </div>
        </div>

        <p class="empty" *ngIf="!books.length">
          No books available.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 22px;
    }

    .head p {
      color: var(--muted);
      margin: 6px 0;
    }

    .head button:disabled {
      opacity: .65;
      cursor: wait;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .stat {
      padding: 18px;
      display: grid;
      grid-template-columns: 40px 1fr;
      grid-template-rows: 22px 18px 18px;
    }

    .stat > span {
      grid-row: 1 / 4;
      width: 38px;
      height: 38px;
      background: #e7f8f1;
      color: #087b57;
      border-radius: 10px;
      display: grid;
      place-items: center;
    }

    .stat b {
      font-size: 22px;
    }

    .stat small {
      font-size: 10px;
      color: var(--muted);
    }

    .stat em {
      font-size: 9px;
      color: var(--a);
      font-style: normal;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 14px;
      margin-top: 14px;
    }

    .panel {
      padding: 20px;
      min-height: 280px;
      min-width: 0;
    }

    .panel svg {
      width: 100%;
      height: 210px;
      margin-top: 15px;
    }

    .months {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: var(--muted);
    }

    .donut {
      display: flex;
      align-items: center;
      gap: 25px;
      min-height: 230px;
    }

    .donut-chart {
      width: 165px;
      height: 165px;
      min-width: 165px;
      border-radius: 50%;
      position: relative;
      display: grid;
      place-items: center;
    }

    .donut-chart::after {
      content: '';
      position: absolute;
      inset: 35px;
      border-radius: 50%;
      background: var(--card);
    }

    .donut-chart > span {
      position: relative;
      z-index: 1;
      font-weight: 800;
      font-size: 13px;
    }

    .donut ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 10px;
      font-size: 10px;
      flex: 1;
      min-width: 0;
    }

    .donut li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .category-name {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .category-name i {
      display: inline-block;
      width: 8px;
      height: 8px;
      min-width: 8px;
      border-radius: 50%;
    }

    .activity {
      display: flex;
      gap: 10px;
      padding: 13px 0;
      border-bottom: 1px solid var(--line);
      align-items: center;
    }

    .activity > span {
      width: 30px;
      height: 30px;
      min-width: 30px;
      border-radius: 8px;
      background: #e9f0ff;
      display: grid;
      place-items: center;
      font-size: 9px;
    }

    .activity > div {
      flex: 1;
      min-width: 0;
    }

    .activity b,
    .activity small {
      display: block;
      font-size: 10px;
      overflow-wrap: anywhere;
    }

    .activity small {
      color: var(--muted);
      margin-top: 3px;
    }

    .book {
      background: #efe2cc !important;
      color: #493a2b !important;
      font-size: 7px !important;
      padding: 5px;
    }

    .chart-empty,
    .empty {
      color: var(--muted);
      font-size: 12px;
      padding: 24px 0;
    }

    .notice.error {
      margin-bottom: 14px;
      color: #b42318;
      font-size: 12px;
    }

    @media (max-width: 1100px) {
      .stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .stats {
        grid-template-columns: 1fr;
      }

      .head {
        flex-direction: column;
        align-items: start;
        gap: 12px;
      }

      .donut {
        gap: 14px;
      }

      .donut-chart {
        width: 125px;
        height: 125px;
        min-width: 125px;
      }

      .donut-chart::after {
        inset: 27px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';

  totalBooks = 0;
  totalMembers = 0;
  activeBorrowings = 0;
  overdueBooks = 0;

  allBooks: Book[] = [];
  members: Member[] = [];
  borrowings: Borrowing[] = [];
  categories: Category[] = [];
  authors: Author[] = [];

  activity: ActivityItem[] = [];
  books: PopularBook[] = [];

  months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug'
  ];

  categoryColors = [
    '#7b61ff',
    '#2ab59a',
    '#f5a623',
    '#5d82f5',
    '#e46d90',
    '#b4bac2',
    '#e67e22',
    '#16a085'
  ];

  categoryStats: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[] = [];

  categoryGradient = 'conic-gradient(#e5e7eb 0% 100%)';

  trendPath = '';
  trendArea = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.errorMessage = '';

    let pending = 5;
    let hasFailure = false;

    const finishRequest = (): void => {
      pending--;

      if (pending === 0) {
        this.loading = false;
        this.updateDashboard();

        if (hasFailure) {
          this.errorMessage =
            'Some dashboard data could not be loaded. Check the API and your login session.';
        }
      }
    };

    this.api.get<any>('Books/GetAllBooks').subscribe({
      next: response => {
        this.allBooks = this.toArray<Book>(response);
        this.totalBooks = this.allBooks.length;
        finishRequest();
      },
      error: () => {
        hasFailure = true;
        finishRequest();
      }
    });

    this.api.get<any>('Members/GetAllMembers').subscribe({
      next: response => {
        this.members = this.toArray<Member>(response);
        this.totalMembers = this.members.length;
        finishRequest();
      },
      error: () => {
        hasFailure = true;
        finishRequest();
      }
    });

    this.api.get<any>('Borrowing/GetAll').subscribe({
      next: response => {
        this.borrowings = this.toArray<Borrowing>(response);

        const active = this.borrowings.filter(
          borrowing => !borrowing.returnedAt
        );

        this.activeBorrowings = active.length;

        const now = new Date();

        this.overdueBooks = active.filter(borrowing => {
          if (!borrowing.dueDate) {
            return false;
          }

          const dueDate = new Date(borrowing.dueDate);

          return (
            !isNaN(dueDate.getTime()) &&
            dueDate < now
          );
        }).length;

        finishRequest();
      },
      error: () => {
        hasFailure = true;
        finishRequest();
      }
    });

    this.api.get<any>('Categories/GetAllCategories').subscribe({
      next: response => {
        this.categories = this.toArray<Category>(response);
        finishRequest();
      },
      error: () => {
        hasFailure = true;
        finishRequest();
      }
    });

    this.api.get<any>('Authors/GetAllAuthors').subscribe({
      next: response => {
        this.authors = this.toArray<Author>(response);
        finishRequest();
      },
      error: () => {
        hasFailure = true;
        finishRequest();
      }
    });
  }

  private toArray<T>(response: any): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (Array.isArray(response?.data)) {
      return response.data as T[];
    }

    if (Array.isArray(response?.items)) {
      return response.items as T[];
    }

    if (Array.isArray(response?.$values)) {
      return response.$values as T[];
    }

    return [];
  }

  private updateDashboard(): void {
    this.updateCategories();
    this.updatePopularBooks();
    this.updateActivity();
    this.updateTrend();
  }

  private updateCategories(): void {
    const counts = new Map<number, number>();
    let totalAssignments = 0;

    for (const book of this.allBooks) {
      for (const categoryId of book.categoryIds ?? []) {
        counts.set(
          categoryId,
          (counts.get(categoryId) ?? 0) + 1
        );

        totalAssignments++;
      }
    }

    this.categoryStats = this.categories
      .map((category, index) => {
        const count = counts.get(category.id) ?? 0;

        return {
          name: category.name,
          count,
          percentage: totalAssignments
            ? Math.round(
                (count / totalAssignments) * 100
              )
            : 0,
          color: this.categoryColors[
            index % this.categoryColors.length
          ]
        };
      })
      .filter(category => category.count > 0);

    if (!this.categoryStats.length) {
      this.categoryGradient =
        'conic-gradient(#e5e7eb 0% 100%)';
      return;
    }

    let position = 0;

    const segments = this.categoryStats.map(category => {
      const start = position;
      position += category.percentage;

      return `${category.color} ${start}% ${position}%`;
    });

    this.categoryGradient =
      `conic-gradient(${segments.join(', ')})`;
  }

  private updatePopularBooks(): void {
    const borrowCounts = new Map<number, number>();

    for (const borrowing of this.borrowings) {
      borrowCounts.set(
        borrowing.bookId,
        (borrowCounts.get(borrowing.bookId) ?? 0) + 1
      );
    }

    const sortedBooks = [...this.allBooks].sort((a, b) => {
      return (
        (borrowCounts.get(b.id) ?? 0) -
        (borrowCounts.get(a.id) ?? 0)
      );
    });

    this.books = sortedBooks.slice(0, 3).map(book => {
      const authorNames = (book.authorIds ?? [])
        .map(
          id => this.authors.find(
            author => author.id === id
          )?.name
        )
        .filter((name): name is string => !!name);

      const embeddedNames = (book.authors ?? [])
        .map(author => author.name)
        .filter(Boolean);

      return {
        c: book.title,
        t: book.title,
        a: authorNames.join(', ') ||
          embeddedNames.join(', ') ||
          book.author ||
          'Author not available'
      };
    });
  }

  private updateActivity(): void {
    const sorted = [...this.borrowings].sort((a, b) => {
      return (
        new Date(b.borrowedAt).getTime() -
        new Date(a.borrowedAt).getTime()
      );
    });

    this.activity = sorted.slice(0, 4).map(borrowing => {
      const book = this.allBooks.find(
        item => item.id === borrowing.bookId
      );

      const member = this.members.find(
        item => item.id === borrowing.memberId
      );

      const memberName = member
        ? `${member.firstName} ${member.lastName}`.trim()
        : `Member #${borrowing.memberId}`;

      const bookTitle = book?.title ??
        `Book #${borrowing.bookId}`;

      return {
        i: '↔',
        t: `${memberName} borrowed ${bookTitle}`,
        m: this.formatDate(borrowing.borrowedAt)
      };
    });
  }

  private updateTrend(): void {
    const monthCounts = new Array<number>(8).fill(0);
    const currentYear = new Date().getFullYear();

    for (const borrowing of this.borrowings) {
      if (!borrowing.borrowedAt) {
        continue;
      }

      const date = new Date(borrowing.borrowedAt);

      if (
        !isNaN(date.getTime()) &&
        date.getFullYear() === currentYear &&
        date.getMonth() >= 0 &&
        date.getMonth() < 8
      ) {
        monthCounts[date.getMonth()]++;
      }
    }

    const max = Math.max(...monthCounts, 1);

    const points = monthCounts.map((count, index) => ({
      x: index * (700 / 7),
      y: 195 - (count / max) * 150
    }));

    this.trendPath = points
      .map((point, index) =>
        `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`
      )
      .join(' ');

    if (points.length) {
      this.trendArea =
        `${this.trendPath} L700 230 L0 230 Z`;
    } else {
      this.trendArea = '';
    }
  }

  private formatDate(value: string): string {
    if (!value) {
      return 'Date unavailable';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return date.toLocaleString('en', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }
}
