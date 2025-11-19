import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  error = '';

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = '';
      this.authService.login(
        {
          email: this.form.getRawValue().email + '',
          password: this.form.getRawValue().password + ''
        }
      ).subscribe({
        next: () => this.router.navigate(['/']), // Перехід на головну
        error: (err) => {
          this.error = 'Невірний email або пароль';
          this.isLoading = false;
        }
      });
    }
  }
}
