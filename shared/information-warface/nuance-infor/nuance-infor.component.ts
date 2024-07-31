import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  AccumulationChartModule,
  AccumulationTooltipService,
  AccumulationLegendService,
  PieSeriesService,
  AccumulationAnnotationService,
  AccumulationDataLabelService,
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-nuance-infor',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
  ],
  imports: [CommonModule, AccumulationChartModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './nuance-infor.component.html',
  styleUrls: ['./nuance-infor.component.scss'],
})
export class NuanceInforComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  private _payload: PayloadChannelData;

  // @Input() payload: any;

  // nuance donut var
  public nuanceData?: Promise<any[]>;
  public nuanceDataLabel: Object;
  public nuanceColors: string[];
  public nuanceTitle: string;
  public nuancelegendSettings: Object;
  public nuanceTooltip: Object;
  public enableSmartLabels: Object;
  private cdr = inject(ChangeDetectorRef);
  private supabaseService = inject(SupabaseService);
  constructor() {}

  ngOnInit() {
    //nuance donut var
    this.nuanceDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.nuanceColors = ['#045E2B', '#1D85E7', '#D00B32'];
    this.nuancelegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };
    this.updateData();
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.payload &&
      !changes.payload.firstChange &&
      this.isDatePayload(changes.payload.currentValue)
    ) {
      this.updateData();
      console.log('sac thai update', this.payload);
    }
  }

  private updateData() {
    const dateFromPayload = this.getDateFromPayload(); // Implement this method to extract date from payload
    this.nuanceData = this.supabaseService
      .tctt_chi_so_sac_thai(dateFromPayload)
      .finally(() => this.cdr.markForCheck());
  }

  private getDateFromPayload(): string {
    // Extract date from the payload; assuming payload contains a date property
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    console.log(formattedToday);
    return this.payload?.date || formattedToday;
  }

  private isDatePayload(payload: any): boolean {
    return payload && payload.payload.type === 'Date';
  }
}
