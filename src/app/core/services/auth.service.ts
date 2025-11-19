import {computed, inject, Injectable, signal} from '@angular/core';
import {User} from "../models/user.model";
import {UserRole} from "../models/user-role.enum";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, of, tap, throwError} from "rxjs";
import {LoginDto} from "../dto/login.dto";
import {LoginResponseDto} from "../dto/login-response.dto";
import {RegisterDto} from "../dto/register.dto";

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Поточний Користувач (Admin)',
  email: 'test@test.test',
  role: UserRole.admin
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Стан користувача
  readonly currentUser = signal<User | null>(this.getUserFromStorage());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === UserRole.admin);
  readonly currentUserId = computed(() => this.currentUser()?.id);

  constructor() {
    // Перевірка токена при старті (можна розширити перевіркою терміну дії)
    const token = this.getToken();
    if (!token) {
      this.logout(false);
    }
  }

  /**
   * Реєстрація нового користувача
   */
  register(dto: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, dto);
  }

  /**
   * Вхід в систему
   */
  login(dto: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.API_URL}/login`, dto).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        // У реальному додатку, можливо, доведеться зробити запит /api/users/me,
        // щоб отримати профіль, якщо login повертає тільки токен.
        // Але припустимо, ми можемо декодувати токен або бекенд поверне юзера.
        // Для спрощення тут я "декодую" або роблю запит.
        // Припустимо, ми зробили запит за профілем:
        this.fetchProfile().subscribe();
      })
    );
  }

  /**
   * Вихід з системи
   */
  logout(redirect: boolean = true): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Отримати токен (для інтерсептора)
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- Допоміжні методи ---

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Метод для отримання профілю поточного користувача
  // (потрібно додати endpoint в UsersController бекенду або брати з токена)
  fetchProfile(): Observable<User> {
    // Тимчасово імітуємо отримання даних з токена (якщо бекенд ще не має /me)
    // У вашому бекенді є JWT стратегія, яка кладе user в request.
    // Можна додати endpoint GET /auth/me або /users/me

    // Приклад:
    // return this.http.get<User>('/api/users/me').pipe(
    //   tap(user => {
    //     this.currentUser.set(user);
    //     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    //   })
    // );

    // ПОКИ ЩО: декодуємо JWT (спрощено для прикладу)
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.sub,
          email: payload.email,
          name: payload.email.split('@')[0], // Тимчасово, бо в токені може не бути імені
          role: payload.role
        };
        this.currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return of(user);
      } catch (e) {
        return throwError(() => new Error('Invalid token'));
      }
    }
    return throwError(() => new Error('No token'));
  }

  // Перевірка авторства (для UI)
  isAuthor(authorId: string): boolean {
    return this.currentUserId() === authorId;
  }
}
