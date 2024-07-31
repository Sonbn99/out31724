import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureStatsOverlayComponent } from '../../mid-panel/feature-stats-overlay/feature-stats-overlay.component';
import { TopologyCardComponent } from '../topology-card/topology-card.component';
import { MapSupabaseService } from '../../../services/map-supabase.service';
import { TopologyData } from '../../../models/btth.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feature-detail-panel',
  standalone: true,
  imports: [CommonModule, FeatureStatsOverlayComponent, TopologyCardComponent],
  templateUrl: './feature-detail-panel.component.html',
  styleUrls: ['./feature-detail-panel.component.scss'],
})
export class FeatureDetailPanelComponent implements OnInit {
  get selectedId(): string {
    return this._selectedId;
  }

  @Input() set selectedId(value: string) {
    this._selectedId = value;
    this.topology$ = this.getTopologyData(this.selectedId);
  }
  private _selectedId: string;

  selectedFeatureData: any;

  topology$: Observable<TopologyData | null>;
  private mapSupabase = inject(MapSupabaseService);

  ngOnInit() {
    this.selectedFeatureData = [
      {
        unit: 'Đơn vị 1',
        networkDevice: 641,
        endDevice: 452,
        infrastructure: 1,
        att: 43,
      },
      {
        unit: 'Đơn vị 2',
        networkDevice: 432,
        endDevice: 123,
        infrastructure: 23,
        att: 2,
      },
      {
        unit: 'Đơn vị 3',
        networkDevice: 123,
        endDevice: 452,
        infrastructure: 13,
        att: 32,
      },
    ];
  }

  getTopologyData(unitPath: string): Observable<TopologyData | null> {
    return this.mapSupabase.getTopologyData(unitPath);
  }
}
