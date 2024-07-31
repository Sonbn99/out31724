import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticInformationComponent } from './static-information/static-information.component';
import {
  ModeToggleService,
  ModeType,
} from '../../../mode-toggle/mode-toggle.service';
import { Observable, tap } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [CommonModule, StaticInformationComponent],
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss'],
})
export class TopPanelComponent implements OnInit {
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
