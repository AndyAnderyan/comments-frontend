import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  error = '';

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = '';
      const email = this.form.getRawValue().email + '';
      const name = this.form.getRawValue().name + '';
      const password = this.form.getRawValue().password + '';

      this.authService.register({ email, name, password }).subscribe({
        next: () => {
          // Після реєстрації пробуємо залогінитись автоматично
          this.authService.login({ email, password }).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/login'])
          });
        },
        error: (err) => {
          this.error = 'Помилка реєстрації. Можливо email зайнятий.';
          this.isLoading = false;
        }
      });
    }
  }
}
