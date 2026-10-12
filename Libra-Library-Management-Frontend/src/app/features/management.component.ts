
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-management',
  imports: [NgFor, NgIf, FormsModule],
  template: `
    <div class="head">
      <div>
        <div class="eyebrow">Library management</div>
        <h1 class="page-title">{{ title }}</h1>
        <p>Manage {{ title.toLowerCase() }} and their information.</p>
      </div>

      <button
        *ngIf="title !== 'Users' && title !== 'Activity Logs'"
        class="btn primary"
        type="button"
        (click)="open()">
        ＋ Add {{ singular }}
      </button>
    </div>

    <div class="notice success" *ngIf="success">{{ success }}</div>
    <div class="notice error" *ngIf="error">{{ error }}</div>

    <div class="toolbar card">
      <input
        class="input"
        [(ngModel)]="q"
        placeholder="⌕ Search..." />

      <select
        *ngIf="title !== 'Activity Logs'"
        class="select"
        [(ngModel)]="statusFilter">
        <option value="All">All statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Borrowed">Borrowed</option>
        <option value="Returned">Returned</option>
        <option value="Overdue">Overdue</option>
      </select>

      <button
        class="btn"
        type="button"
        (click)="refresh()"
        [disabled]="loading">
        {{ loading ? 'Loading...' : '↻ Refresh' }}
      </button>
    </div>

    <div class="card table">
      <table>
        <thead>
          <tr>
            <th *ngFor="let field of fields">{{ field }}</th>

            <th *ngIf="
              title !== 'Members' &&
              title !== 'Borrowing' &&
              title !== 'Activity Logs'
            ">Status</th>

            <th *ngIf="title !== 'Activity Logs'">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let row of filteredRows">
            <td *ngFor="let key of keys">
              <ng-container
                *ngIf="title === 'Borrowing' && key === 'status';
                else normalValue">

                <span
                  class="status-badge"
                  [class.returned]="getBorrowingStatus(row) === 'Returned'"
                  [class.overdue]="getBorrowingStatus(row) === 'Overdue'">
                  {{ getBorrowingStatus(row) }}
                </span>
              </ng-container>

              <ng-template #normalValue>
                <ng-container
                  *ngIf="title === 'Activity Logs' && key === 'action';
                  else regularText">

                  <span
                    class="log-action"
                    [class.log-create]="displayValue(row, key) === 'Create'"
                    [class.log-update]="displayValue(row, key) === 'Update'"
                    [class.log-delete]="displayValue(row, key) === 'Delete'">
                    {{ displayValue(row, key) }}
                  </span>
                </ng-container>

                <ng-template #regularText>
                  {{ displayValue(row, key) }}
                </ng-template>
              </ng-template>
            </td>

            <td *ngIf="
              title !== 'Members' &&
              title !== 'Borrowing' &&
              title !== 'Activity Logs'
            ">
              <span class="badge ok">{{ getStatus(row) }}</span>
            </td>

            <td *ngIf="title !== 'Activity Logs'">
              <ng-container *ngIf="title === 'Borrowing'; else normalActions">
                <button
                  *ngIf="getBorrowingStatus(row) !== 'Returned'"
                  class="action"
                  type="button"
                  (click)="returnBook(getId(row))">
                  Return Book
                </button>

                <span
                  *ngIf="getBorrowingStatus(row) === 'Returned'"
                  class="muted">
                  Completed
                </span>
              </ng-container>

              <ng-template #normalActions>
                <button
                  class="action"
                  type="button"
                  (click)="edit(row)"
                  [disabled]="title === 'Users'">
                  Edit
                </button>

                <button
                  class="action badtxt"
                  type="button"
                  (click)="remove(getId(row))">
                  Delete
                </button>
              </ng-template>
            </td>
          </tr>

          <tr *ngIf="!loading && filteredRows.length === 0">
            <td
              class="empty"
              [attr.colspan]="keys.length +
                (title === 'Members' ||
                 title === 'Borrowing' ||
                 title === 'Activity Logs' ? 0 : 2)">
              {{
                error
                  ? 'Unable to load ' + title.toLowerCase() + '.'
                  : 'No ' + title.toLowerCase() + ' found.'
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="loading" class="loading">
        Loading {{ title.toLowerCase() }}...
      </p>
    </div>

    <div class="modal" *ngIf="editing">
      <div class="modalbox">
        <h2>{{ isEdit ? 'Edit' : 'Add' }} {{ singular }}</h2>

        <ng-container *ngIf="title === 'Borrowing'; else otherForms">
          <label>
            <span>Book</span>
            <select class="input" [(ngModel)]="editing.bookId">
              <option [ngValue]="null">Select a book</option>
              <option
                *ngFor="let book of books"
                [ngValue]="getBookId(book)">
                {{ getBookName(book) }}
              </option>
            </select>
          </label>

          <label>
            <span>Member</span>
            <select class="input" [(ngModel)]="editing.memberId">
              <option [ngValue]="null">Select a member</option>
              <option
                *ngFor="let member of members"
                [ngValue]="getMemberId(member)">
                {{ getMemberName(member) }}
              </option>
            </select>
          </label>

          <label>
            <span>Due Date</span>
            <input
              class="input"
              type="date"
              [(ngModel)]="editing.dueDate">
          </label>
        </ng-container>

        <ng-template #otherForms>
          <ng-container
            *ngIf="title === 'Members'; else authorPublisherOrGeneric">

            <label>
              <span>First Name</span>
              <input
                class="input"
                [(ngModel)]="editing.firstName"
                placeholder="First name">
            </label>

            <label>
              <span>Last Name</span>
              <input
                class="input"
                [(ngModel)]="editing.lastName"
                placeholder="Last name">
            </label>

            <label>
              <span>Email</span>
              <input
                class="input"
                type="email"
                [(ngModel)]="editing.email"
                placeholder="Email">
            </label>

            <label>
              <span>Phone Number</span>
              <input
                class="input"
                [(ngModel)]="editing.phoneNumber"
                placeholder="Phone number">
            </label>
          </ng-container>

          <ng-template #authorPublisherOrGeneric>
            <ng-container
              *ngIf="title === 'Authors'; else publisherOrGeneric">

              <label>
                <span>Author Name</span>
                <input
                  class="input"
                  [(ngModel)]="editing.name"
                  placeholder="Author name">
              </label>

              <label>
                <span>Biography</span>
                <textarea
                  class="input"
                  [(ngModel)]="editing.biography"
                  placeholder="Short biography"
                  rows="4"></textarea>
              </label>
            </ng-container>

            <ng-template #publisherOrGeneric>
              <ng-container
                *ngIf="title === 'Publishers'; else categoryOrGeneric">

                <label>
                  <span>Publisher Name *</span>
                  <input
                    class="input"
                    [(ngModel)]="editing.name"
                    placeholder="Publisher name">
                </label>

                <label>
                  <span>Address</span>
                  <input
                    class="input"
                    [(ngModel)]="editing.address"
                    placeholder="Address">
                </label>

                <label>
                  <span>Email</span>
                  <input
                    class="input"
                    type="email"
                    [(ngModel)]="editing.email"
                    placeholder="Email">
                </label>

                <label>
                  <span>Phone Number</span>
                  <input
                    class="input"
                    [(ngModel)]="editing.phoneNumber"
                    placeholder="Phone number">
                </label>
              </ng-container>

              <ng-template #categoryOrGeneric>
                <ng-container
                  *ngIf="title === 'Categories'; else genericForm">

                  <label>
                    <span>Category Name</span>
                    <input
                      class="input"
                      [(ngModel)]="editing.name"
                      placeholder="Category name">
                  </label>

                  <label>
                    <span>Parent Category ID (optional)</span>
                    <input
                      class="input"
                      type="number"
                      [(ngModel)]="editing.parentCategoryId"
                      placeholder="Parent category ID">
                  </label>
                </ng-container>

                <ng-template #genericForm>
                  <label *ngFor="let key of keys">
                    <span>{{ label(key) }}</span>
                    <input
                      class="input"
                      [(ngModel)]="editing[key]"
                      [placeholder]="label(key)">
                  </label>
                </ng-template>
              </ng-template>
            </ng-template>
          </ng-template>
        </ng-template>

        <div class="modal-actions">
          <button
            class="btn secondary"
            type="button"
            (click)="cancel()">
            Cancel
          </button>

          <button
            class="btn primary"
            type="button"
            [disabled]="saving"
            (click)="save()">
            {{ saving ? 'Saving...' : 'Save' }}
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
      gap: 12px;
      margin-bottom: 20px;
    }

    .head p {
      color: var(--muted);
      margin: 6px 0;
    }

    .toolbar {
      display: flex;
      gap: 10px;
      padding: 14px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .toolbar .input {
      flex: 1;
      min-width: 140px;
      max-width: 420px;
    }

    .select {
      max-width: 180px;
    }

    .table {
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 14px;
      text-align: left;
      white-space: nowrap;
      border-bottom: 1px solid var(--border);
    }

    th {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .action {
      border: 0;
      background: none;
      color: var(--p);
      font-size: 11px;
      font-weight: 700;
      margin-right: 12px;
      cursor: pointer;
    }

    .action:disabled {
      opacity: .45;
      cursor: not-allowed;
    }

    .badtxt {
      color: var(--danger);
    }

    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      background: #fff0d9;
      color: #9a6200;
    }

    .status-badge.returned {
      background: #dff6e9;
      color: #16794b;
    }

    .status-badge.overdue {
      background: #ffe4e4;
      color: #b42318;
    }

    .log-action {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 7px;
      font-size: 11px;
      font-weight: 700;
      background: var(--border);
    }

    .log-create {
      background: #dff6e9;
      color: #16794b;
    }

    .log-update {
      background: #e4edff;
      color: #2458a6;
    }

    .log-delete {
      background: #ffe4e4;
      color: #b42318;
    }

    .muted {
      color: var(--muted);
      font-size: 12px;
    }

    .modal {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: grid;
      place-items: center;
      padding: 20px;
      background: #08152288;
    }

    .modalbox {
      display: grid;
      gap: 9px;
      width: min(520px, 100%);
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      border-radius: 18px;
      background: var(--card);
    }

    .modalbox h2 {
      font: 600 25px 'Playfair Display';
    }

    .modalbox label span {
      display: block;
      margin: 5px 0;
      font-size: 11px;
      font-weight: 700;
    }

    .modalbox .input {
      width: 100%;
      box-sizing: border-box;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }

    .empty, .loading {
      padding: 24px;
      text-align: center;
      color: var(--muted);
    }

    .notice {
      padding: 12px 16px;
      margin-bottom: 12px;
      border-radius: 10px;
    }

    .success {
      color: var(--success, #21845b);
    }

    .error {
      color: var(--danger);
    }

    @media(max-width: 600px) {
      .head {
        flex-direction: column;
        align-items: start;
      }

      .toolbar {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ManagementComponent implements OnInit {
  title = 'Members';
  singular = 'Member';
  endpoint = 'Members/GetAllMembers';

  fields: string[] = [];
  keys: string[] = [];
  rows: any[] = [];
  books: any[] = [];
  members: any[] = [];

  q = '';
  statusFilter = 'All';
  editing: any = null;
  isEdit = false;
  loading = false;
  saving = false;
  success = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.url[0]?.path ?? 'members';

    const map: any = {
      members: [
        'Members', 'Member', 'Members/GetAllMembers',
        ['First Name', 'Last Name', 'Email', 'Phone Number'],
        ['firstName', 'lastName', 'email', 'phoneNumber']
      ],
      borrowing: [
        'Borrowing', 'Borrowing', 'Borrowing/GetAll',
        ['Book', 'Member', 'Borrow Date', 'Due Date', 'Status'],
        ['bookTitle', 'memberName', 'borrowDate', 'dueDate', 'status']
      ],
      authors: [
        'Authors', 'Author', 'Authors/GetAllAuthors',
        ['Name', 'Biography'],
        ['name', 'biography']
      ],
      publishers: [
        'Publishers', 'Publisher', 'Publishers/GetAllPublishers',
        ['Name', 'Address', 'Email'],
        ['name', 'address', 'email']
      ],
      categories: [
        'Categories', 'Category', 'Categories/GetAllCategories',
        ['Name', 'Parent Category ID'],
        ['name', 'parentCategoryId']
      ],
      users: [
        'Users', 'User', 'Users/GetAllUsers',
        ['Name', 'Email', 'Role'],
        ['fullName', 'email', 'role']
      ],
      'activity-logs': [
        'Activity Logs', 'Log', 'ActivityLogs',
        ['User', 'Action', 'Entity', 'Entity ID', 'Time'],
        ['systemUserId', 'action', 'entityName', 'entityId', 'timestamp']
      ]
    };

    const config = map[path] ?? map.members;

    [
      this.title,
      this.singular,
      this.endpoint,
      this.fields,
      this.keys
    ] = config;

    if (path === 'members') {
      this.loadMembers();
    } else if (path === 'borrowing') {
      this.loadBooks();
      this.loadMemberOptions();
      this.loadBorrowing();
    } else {
      this.loadOtherData();
    }
  }

  get filteredRows(): any[] {
    const term = this.q.trim().toLowerCase();

    return this.rows.filter(row => {
      const matchesSearch = !term || this.keys.some(key =>
        String(this.displayValue(row, key) ?? '')
          .toLowerCase()
          .includes(term)
      );

      if (this.title === 'Activity Logs') {
        return matchesSearch;
      }

      const status = this.title === 'Borrowing'
        ? this.getBorrowingStatus(row)
        : this.getStatus(row);

      return matchesSearch &&
        (this.statusFilter === 'All' ||
          status.toLowerCase() === this.statusFilter.toLowerCase());
    });
  }

  private readArray(response: any): any[] {
    if (Array.isArray(response)) return response;

    const possibleArrays = [
      response?.data,
      response?.items,
      response?.$values,
      response?.publishers,
      response?.authors,
      response?.members,
      response?.users,
      response?.categories,
      response?.activityLogs
    ];

    const result = possibleArrays.find(value => Array.isArray(value));

    // The ActivityLogs endpoint may return a single log object.
    if (
      this.title === 'Activity Logs' &&
      response &&
      typeof response === 'object' &&
      response.id !== undefined
    ) {
      return [response];
    }

    return result ?? [];
  }

  getId(row: any): number {
    return Number(
      row?.borrowingId ??
      row?.authorId ??
      row?.memberId ??
      row?.bookId ??
      row?.publisherId ??
      row?.categoryId ??
      row?.userId ??
      row?.id ??
      0
    );
  }

  getBookId(book: any): number {
    return Number(book?.bookId ?? book?.id ?? 0);
  }

  getMemberId(member: any): number {
    return Number(member?.memberId ?? member?.id ?? 0);
  }

  getBookName(book: any): string {
    return book?.title ?? book?.bookTitle ?? book?.name ?? 'Untitled book';
  }

  getMemberName(member: any): string {
    if (!member) return 'Unknown member';

    const name = [
      member.firstName,
      member.lastName
    ].filter(Boolean).join(' ');

    return name ||
      member.fullName ||
      member.name ||
      member.email ||
      'Unknown member';
  }

  displayValue(row: any, key: string): any {
    if (this.title === 'Activity Logs') {
      switch (key) {
        case 'systemUserId':
          return row?.systemUserId != null
            ? `User #${row.systemUserId}`
            : 'Unknown user';

        case 'action':
          return row?.action ?? '—';

        case 'entityName':
          return row?.entityName ?? '—';

        case 'entityId':
          return row?.entityId ?? '—';

        case 'timestamp': {
          const value = row?.timestamp;

          if (!value) return '—';

          const date = new Date(value);

          return Number.isNaN(date.getTime())
            ? '—'
            : date.toLocaleString();
        }
      }
    }

    if (this.title === 'Users') {
      if (key === 'fullName') {
        return row?.fullName ??
          row?.userName ??
          row?.username ??
          row?.name ??
          row?.email ??
          '';
      }

      if (key === 'email') return row?.email ?? '';

      if (key === 'role') {
        const role = row?.roleName ??
          row?.role ??
          row?.userRole ??
          row?.roleId;

        if (
          typeof role === 'number' ||
          /^\d+$/.test(String(role ?? ''))
        ) {
          const roles: Record<number, string> = {
            1: 'Administrator',
            2: 'Librarian',
            3: 'Staff'
          };

          return roles[Number(role)] ?? String(role);
        }

        return role ?? '—';
      }
    }

    if (this.title === 'Borrowing') {
      if (key === 'bookTitle') {
        const id = Number(
          row?.bookId ??
          row?.book?.bookId ??
          row?.book?.id ??
          0
        );

        const book = this.books.find(
          b => this.getBookId(b) === id
        );

        return row?.book?.title ||
          row?.bookTitle ||
          (book ? this.getBookName(book) : 'Book unavailable');
      }

      if (key === 'memberName') {
        const id = Number(
          row?.memberId ??
          row?.member?.memberId ??
          row?.member?.id ??
          0
        );

        const member = this.members.find(
          m => this.getMemberId(m) === id
        );

        return row?.memberName ||
          (row?.member ? this.getMemberName(row.member) : '') ||
          (member ? this.getMemberName(member) : 'Member unavailable');
      }

      if (key === 'borrowDate') {
        const value = row?.borrowDate ??
          row?.borrowedAt ??
          row?.borrowedDate ??
          row?.createdAt;

        return value ? new Date(value).toLocaleDateString() : '—';
      }

      if (key === 'dueDate') {
        return row?.dueDate
          ? new Date(row.dueDate).toLocaleDateString()
          : '—';
      }

      if (key === 'status') return this.getBorrowingStatus(row);
    }

    if (this.title === 'Authors' && key === 'biography') {
      return row?.biography ?? row?.bio ?? '—';
    }

    if (this.title === 'Publishers') {
      if (key === 'name') return row?.name ?? row?.publisherName ?? '';
      if (key === 'address') return row?.address ?? '';
      if (key === 'email') return row?.email ?? '';
    }

    if (this.title === 'Categories' && key === 'name') {
      return row?.name ?? row?.categoryName ?? '';
    }

    return row?.[key] ?? '—';
  }

  getBorrowingStatus(row: any): string {
    const status = String(
      row?.status ?? row?.borrowingStatus ?? ''
    ).toLowerCase();

    if (
      row?.returnDate ||
      row?.returnedAt ||
      row?.isReturned === true ||
      status === 'returned' ||
      status === 'return'
    ) {
      return 'Returned';
    }

    if (status === 'overdue') return 'Overdue';

    if (
      row?.dueDate &&
      new Date(row.dueDate).getTime() < Date.now()
    ) {
      return 'Overdue';
    }

    return 'Borrowed';
  }

  getStatus(row: any): string {
    const value = row?.status ?? row?.isActive;

    return value === false ||
      value === 0 ||
      value === 'Inactive'
      ? 'Inactive'
      : 'Active';
  }

  label(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase());
  }

  private toDateInput(value: any): string {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  open(): void {
    this.error = '';
    this.success = '';

    if (this.title === 'Users') {
      this.error = 'The Users API list does not include an add-user endpoint yet.';
      return;
    }

    if (this.title === 'Activity Logs') {
      return;
    }

    this.isEdit = false;

    if (this.title === 'Borrowing') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      this.editing = {
        bookId: null,
        memberId: null,
        dueDate: this.toDateInput(dueDate)
      };

      return;
    }

    if (this.title === 'Members') {
      this.editing = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      };
      return;
    }

    if (this.title === 'Authors') {
      this.editing = { name: '', biography: '' };
      return;
    }

    if (this.title === 'Publishers') {
      this.editing = {
        name: '',
        address: '',
        email: '',
        phoneNumber: ''
      };
      return;
    }

    if (this.title === 'Categories') {
      this.editing = { name: '', parentCategoryId: null };
      return;
    }

    this.editing = {};
    for (const key of this.keys) this.editing[key] = '';
  }

  edit(row: any): void {
    if (this.title === 'Users') {
      this.error = 'User editing needs the exact UpdateUser request DTO from the backend.';
      return;
    }

    if (this.title === 'Activity Logs') return;

    this.error = '';
    this.success = '';
    this.isEdit = true;
    this.editing = { ...row };

    if (this.title === 'Borrowing') {
      this.editing.bookId = Number(
        row?.bookId ?? row?.book?.bookId ?? 0
      ) || null;

      this.editing.memberId = Number(
        row?.memberId ?? row?.member?.memberId ?? 0
      ) || null;

      this.editing.dueDate = this.toDateInput(row?.dueDate);
    }

    if (this.title === 'Authors') {
      this.editing.name = row?.name ?? '';
      this.editing.biography = row?.biography ?? row?.bio ?? '';
    }

    if (this.title === 'Publishers') {
      this.editing.publisherId = this.getId(row);
      this.editing.name = row?.name ?? row?.publisherName ?? '';
      this.editing.address = row?.address ?? '';
      this.editing.email = row?.email ?? '';
      this.editing.phoneNumber = row?.phoneNumber ?? '';
    }

    if (this.title === 'Categories') {
      this.editing.categoryId = this.getId(row);
      this.editing.name = row?.name ?? row?.categoryName ?? '';
      this.editing.parentCategoryId = row?.parentCategoryId ?? null;
    }
  }

  cancel(): void {
    this.editing = null;
    this.isEdit = false;
  }

  refresh(): void {
    if (this.title === 'Members') {
      this.loadMembers();
    } else if (this.title === 'Borrowing') {
      this.loadBorrowing();
    } else {
      this.loadOtherData();
    }
  }

  loadMembers(): void {
    this.loading = true;
    this.error = '';

    this.api.get<any>('Members/GetAllMembers').subscribe({
      next: response => {
        this.rows = this.readArray(response);
        this.loading = false;
      },
      error: err => {
        console.error('Load members error:', err);
        this.rows = [];
        this.loading = false;
        this.error = this.apiError(err, 'Could not load members.');
      }
    });
  }

  loadMemberOptions(): void {
    this.api.get<any>('Members/GetAllMembers').subscribe({
      next: response => {
        this.members = this.readArray(response);
      },
      error: err => {
        console.error('Load member options error:', err);
        this.members = [];
      }
    });
  }

  loadBooks(): void {
    this.api.get<any>('Books/GetAllBooks').subscribe({
      next: response => {
        this.books = this.readArray(response);
      },
      error: err => {
        console.error('Load books error:', err);
        this.books = [];
      }
    });
  }

  loadBorrowing(): void {
    this.loading = true;
    this.error = '';

    this.api.get<any>('Borrowing/GetAll').subscribe({
      next: response => {
        this.rows = this.readArray(response);
        this.loading = false;
      },
      error: err => {
        console.error('Load borrowing error:', err);
        this.rows = [];
        this.loading = false;
        this.error = this.apiError(err, 'Could not load borrowing records.');
      }
    });
  }

  loadOtherData(): void {
    this.loading = true;
    this.error = '';

    this.api.get<any>(this.endpoint).subscribe({
      next: response => {
        console.log('Loaded ' + this.title + ':', response);
        this.rows = this.readArray(response);
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load ' + this.title, err);
        this.rows = [];
        this.loading = false;
        this.error = this.apiError(
          err,
          'Could not load ' + this.title + '.'
        );
      }
    });
  }

  private apiError(err: any, fallback: string): string {
    if (err?.status === 0) {
      return 'Cannot connect to the API. Check the backend and HTTPS.';
    }

    if (err?.status === 401) {
      return '401 Unauthorized: Please log in again.';
    }

    if (err?.status === 403) {
      return '403 Forbidden: Your account has no permission.';
    }

    if (err?.status === 404) {
      return '404 Not Found: Check the API route.';
    }

    return err?.error?.message ||
      err?.error?.Message ||
      err?.error?.title ||
      fallback + ' HTTP ' + (err?.status ?? 'unknown') + '.';
  }

  save(): void {
    if (!this.editing || this.saving) return;

    this.error = '';
    this.success = '';

    if (this.title === 'Users') {
      this.error = 'User editing/addition is disabled until the exact Users request DTO and add-user endpoint are confirmed.';
      return;
    }

    if (this.title === 'Activity Logs') {
      this.error = 'Activity logs are read-only.';
      return;
    }

    if (this.title === 'Borrowing') {
      if (this.isEdit) {
        this.error = 'Use Return Book to complete a borrowing record.';
        return;
      }

      const bookId = Number(this.editing.bookId);
      const memberId = Number(this.editing.memberId);
      const dueDate = String(this.editing.dueDate ?? '');

      if (!bookId || !memberId || !dueDate) {
        this.error = 'Please select a book, a member, and a due date.';
        return;
      }

      const date = new Date(dueDate + 'T00:00:00');

      if (Number.isNaN(date.getTime())) {
        this.error = 'Please enter a valid due date.';
        return;
      }

      this.saving = true;

      this.api.post<any>('Borrowing/borrow', {
        bookId,
        memberId,
        dueDate: date.toISOString()
      }).subscribe({
        next: () => {
          this.saving = false;
          this.editing = null;
          this.success = 'Book borrowed successfully.';
          this.loadBorrowing();
        },
        error: err => {
          console.error('Borrow error:', err);
          this.saving = false;
          this.error = this.apiError(err, 'Could not borrow book.');
        }
      });

      return;
    }

    if (this.title === 'Members') {
      const member = {
        firstName: String(this.editing.firstName ?? '').trim(),
        lastName: String(this.editing.lastName ?? '').trim(),
        email: String(this.editing.email ?? '').trim(),
        phoneNumber: String(this.editing.phoneNumber ?? '').trim()
      };

      if (
        !member.firstName ||
        !member.lastName ||
        !member.email ||
        !member.phoneNumber
      ) {
        this.error = 'Please fill in all member fields.';
        return;
      }

      const id = this.getId(this.editing);

      if (this.isEdit && !id) {
        this.error = 'Could not identify this member.';
        return;
      }

      this.saving = true;

      const request = this.isEdit
        ? this.api.put('Members/UpdateMember', id, member)
        : this.api.post('Members/Add_Member', member);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.editing = null;
          this.isEdit = false;
          this.success = 'Member saved successfully.';
          this.loadMembers();
        },
        error: err => {
          console.error('Save member error:', err);
          this.saving = false;
          this.error = this.apiError(err, 'Could not save member.');
        }
      });

      return;
    }

    if (this.title === 'Authors') {
      const author = {
        name: String(this.editing.name ?? '').trim(),
        biography: String(this.editing.biography ?? '').trim()
      };

      if (!author.name) {
        this.error = 'Please enter the author name.';
        return;
      }

      const id = this.getId(this.editing);

      if (this.isEdit && !id) {
        this.error = 'Could not identify this author.';
        return;
      }

      this.saving = true;

      const request = this.isEdit
        ? this.api.put('Authors/UpdateAuthor', id, author)
        : this.api.post('Authors/AddAuthor', author);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.editing = null;
          this.isEdit = false;
          this.success = 'Author saved successfully.';
          this.loadOtherData();
        },
        error: err => {
          console.error('Save author error:', err);
          this.saving = false;
          this.error = this.apiError(err, 'Could not save author.');
        }
      });

      return;
    }

    if (this.title === 'Publishers') {
      const publisher = {
        name: String(this.editing.name ?? '').trim(),
        address: String(this.editing.address ?? '').trim(),
        email: String(this.editing.email ?? '').trim(),
        phoneNumber: String(this.editing.phoneNumber ?? '').trim()
      };

      if (!publisher.name) {
        this.error = 'Please enter the publisher name.';
        return;
      }

      const id = this.getId(this.editing);

      if (this.isEdit && !id) {
        this.error = 'Could not identify this publisher.';
        return;
      }

      this.saving = true;

      const wasEdit = this.isEdit;

      const request = wasEdit
        ? this.api.put('Publishers/UpdatePublisher', id, publisher)
        : this.api.post('Publishers/AddPublisher', publisher);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.editing = null;
          this.isEdit = false;
          this.success = wasEdit
            ? 'Publisher updated successfully.'
            : 'Publisher saved successfully.';
          this.loadOtherData();
        },
        error: err => {
          console.error('Save publisher error:', err);
          this.saving = false;
          this.error = this.apiError(err, 'Could not save publisher.');
        }
      });

      return;
    }

    if (this.title === 'Categories') {
      const category = {
        name: String(this.editing.name ?? '').trim(),
        parentCategoryId: this.editing.parentCategoryId
          ? Number(this.editing.parentCategoryId)
          : null
      };

      if (!category.name) {
        this.error = 'Please enter the category name.';
        return;
      }

      const id = this.getId(this.editing);

      if (this.isEdit && !id) {
        this.error = 'Could not identify this category.';
        return;
      }

      this.saving = true;

      const request = this.isEdit
        ? this.api.put('Categories/UpdateCategory', id, category)
        : this.api.post('Categories/AddCategory', category);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.editing = null;
          this.isEdit = false;
          this.success = 'Category saved successfully.';
          this.loadOtherData();
        },
        error: err => {
          console.error('Save category error:', err);
          this.saving = false;
          this.error = this.apiError(err, 'Could not save category.');
        }
      });
    }
  }

  returnBook(id: number): void {
    if (!id) {
      this.error = 'Could not identify this borrowing record.';
      return;
    }

    if (!confirm('Are you sure you want to return this book?')) return;

    this.error = '';
    this.success = '';

    this.api.put<any>('Borrowing/return', id, {}).subscribe({
      next: () => {
        this.success = 'Book returned successfully.';
        this.loadBorrowing();
      },
      error: err => {
        console.error('Return book error:', err);
        this.error = this.apiError(err, 'Could not return this book.');
      }
    });
  }

  remove(id: number): void {
    if (this.title === 'Activity Logs') return;

    if (!id) {
      this.error = 'Could not identify this record.';
      return;
    }

    if (!confirm(
      'Delete this ' + this.singular.toLowerCase() + '?'
    )) {
      return;
    }

    this.error = '';
    this.success = '';

    let request;

    if (this.title === 'Authors') {
      request = this.api.delete('Authors/DeleteAuthor', id);
    } else if (this.title === 'Publishers') {
      request = this.api.delete('Publishers/DeletePublisher', id);
    } else if (this.title === 'Members') {
      request = this.api.delete('Members/DeleteMember', id);
    } else if (this.title === 'Categories') {
      request = this.api.delete('Categories/DeleteCategory', id);
    } else if (this.title === 'Users') {
      request = this.api.deleteUserById(id);
    } else {
      request = this.api.delete(this.endpoint, id);
    }

    request.subscribe({
      next: () => {
        this.success = this.singular + ' deleted successfully.';

        if (this.title === 'Members') {
          this.loadMembers();
        } else if (this.title === 'Borrowing') {
          this.loadBorrowing();
        } else {
          this.loadOtherData();
        }
      },
      error: err => {
        console.error('Delete record error:', err);
        this.error = this.apiError(
          err,
          'Could not delete ' + this.singular.toLowerCase() + '.'
        );
      }
    });
  }
}
