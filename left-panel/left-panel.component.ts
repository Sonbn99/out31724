import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkDefendITTableComponent } from './components/network-defend-ittable/network-defend-ittable.component';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Observable, tap } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';
import { ModeToggleService } from '../../../mode-toggle/mode-toggle.service';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, NetworkDefendITTableComponent],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  startDate: any;
  // endDate$: Observable<Date>;
  mode: any;
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private modeToggleService: ModeToggleService) {}

  ngOnInit() {
    this.channel = this.supabase.joinChannel();
    this.supabase.sendAllChanel(this.channel, 'change-theme');
    this.payloadData$ = this.supabase.payload$.pipe(
      tap((payload) => {
        this.mode = localStorage.getItem('mode');
        localStorage.clear();
        this.modeToggleService.selectMode(this.mode);
      }),
    );
  }
}
