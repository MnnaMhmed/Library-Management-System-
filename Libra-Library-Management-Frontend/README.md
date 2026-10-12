# Libra — Angular 17 Frontend

Complete responsive Libra-style Library Management System UI for the existing ASP.NET Core backend.

## Run
`npm install` then `npm start`.

Set the backend URL in `src/environments/environment.ts`.

Prepared API resources: Auth, Books, Members, Borrowing, Authors, Publishers, Categories, Users and ActivityLogs. JWT is automatically attached to requests.

The dashboard charts use presentation data until real analytics endpoints are available. Wishlist is intentionally visual-only because it was not part of the existing backend feature set. Backend roles are treated as Administrator, Librarian and Staff.
