import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';

@Component({
  selector: 'app-information-wareface-result',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './information-wareface-result.component.html',
  styleUrls: ['./information-wareface-result.component.scss'],
})
export class InformationWarefaceResultComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  constructor() {}

  ngOnInit() {}
}
