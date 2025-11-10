import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../models';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  private loadingService = inject(LoadingService);

  loading$: Observable<LoadingState> = this.loadingService.getLoadingState();
}
