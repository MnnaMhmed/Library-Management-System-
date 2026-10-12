
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIf],

  template: `
    <div class="auth">

      <div class="hero">
        <b>♧ Libra</b>

        <div>
          <small>BOOKS BUILD</small>

          <h1>
            Better<br>
            Tomorrows.
          </h1>

          <p>
            A modern library management experience for people
            who believe knowledge changes everything.
          </p>
        </div>
      </div>

      <div class="form">
        <div>

          <div class="logo">♧</div>

          <h2>Welcome Back</h2>

          <p>Sign in to manage your library.</p>

          <form (ngSubmit)="login()">

            <label>Username</label>

            <input
              class="input"
              name="username"
              [(ngModel)]="username"
              required
            >

            <label>Password</label>

            <input
              class="input"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
            >

            <div
              *ngIf="error"
              class="error">
              {{ error }}
            </div>

            <button
              class="btn primary"
              type="submit">
              Login
            </button>

          </form>

          <small>
            Don't have an account?
            <a routerLink="/register">Register</a>
          </small>

        </div>
      </div>

    </div>
  `,

  styles: [`
    .auth {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.15fr 1fr;
    }

    .hero {
      background: linear-gradient(135deg, #fbf8f0, #eee8da);
      padding: 40px 9%;
      display: flex;
      flex-direction: column;
      color: #102938;
    }

    .hero > b {
      font: 700 24px 'Playfair Display';
    }

    .hero > div {
      margin-top: auto;
      margin-bottom: 12%;
    }

    .hero h1 {
      font: 600 80px/.9 'Playfair Display';
      margin: 12px 0;
    }

    .hero p {
      max-width: 430px;
      line-height: 1.8;
      color: #5c6469;
    }

    .form {
      display: grid;
      place-items: center;
      padding: 30px;
    }

    .form > div {
      width: min(400px, 100%);
    }

    .logo {
      font-size: 32px;
    }

    .form h2 {
      font: 600 42px 'Playfair Display';
      margin: 8px 0;
    }

    .form p {
      color: var(--muted);
      margin-bottom: 28px;
    }

    .form form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form label {
      font-size: 11px;
      font-weight: 700;
      margin-top: 8px;
    }

    .form button {
      width: 100%;
      margin-top: 12px;
    }

    .form > div > small {
      display: block;
      text-align: center;
      color: var(--muted);
      margin-top: 22px;
    }

    .form a {
      color: var(--a);
      font-weight: 700;
    }

    .error {
      padding: 9px;
      background: #ffe9e9;
      color: #a52d2d;
      border-radius: 8px;
      font-size: 11px;
    }

    @media (max-width: 800px) {
      .hero {
        display: none;
      }

      .auth {
        display: block;
      }
    }
  `]
})
export class LoginComponent {

  username = 'admin';

  password = 'Admin@123';

  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {

    this.error = '';

    this.auth.login(
      this.username,
      this.password
    ).subscribe({

      next: () => {
        this.router.navigate(['/dashboard']);
      },

      error: () => {
        this.error =
          'Login failed. Check your username or password.';
      }

    });
  }
}

