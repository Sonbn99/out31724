import {
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  AxisModel,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  PieSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingColumnSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
  TooltipSettingsModel,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { PayloadChannelData } from '../../../../models/payload-channel';

@Component({
  selector: 'app-monitoring-target',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
  ],
  imports: [CommonModule, AccumulationChartModule, ChartModule],
  templateUrl: './monitoring-target.component.html',
  styleUrls: ['./monitoring-target.component.scss'],
})
export class MonitoringTargetComponent implements OnInit {
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  private _payload: PayloadChannelData;
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  // article correlation bar
  public articleCorrelationData?: Promise<any[]>;
  public articleCorrelationPrimaryXAxis: AxisModel;
  public articleCorrelationPrimaryYAxis: AxisModel;
  public articleCorrelationTooltip: TooltipSettingsModel;
  articleCorrelationPalette: string[];
  public articleCorrelationMarker: Object;
  public articleCorrelationColorMapping: Object;

  // target correlation donut var
  public targetCorrelationData?: Promise<any[]>;
  public targetCorrelationDataLabel: Object;
  public enableSmartLabels: boolean;
  public accumulationLegendSettings: LegendSettingsModel;
  public targetCorrelationColors: string[] = [
    '#E98F8F',
    '#045E2B',
    '#BD0A0A',
    '#D00B0B',
    '#E05C5C',
    '#940808',
  ];
  public relatedTargetTitle: string;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  startDate$: any;

  constructor() {}

  ngOnInit() {
    this.updateData();

    this.initialArticleCorrelationSettings();
    this.initialAccumulationSettings();
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

    // togglePopup(open: boolean, type: string) {
    //   this.popupToggled.emit({ open, type });
    // }
  }
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  private updateData() {
    const dateFromPayload = this.getDateFromPayload(); // Implement this method to extract date from payload
    // this.nuanceData = this.supabaseService.tctt_chi_so_sac_thai(dateFromPayload)
    //   .finally(() => this.cdr.markForCheck());
    this.articleCorrelationData = this.supabaseService
      .tctt_tuong_quan_bai_viet(this.startDate$)
      .finally(() => this.cdr.markForCheck());
    this.targetCorrelationData = this.supabaseService
      .tctt_tuong_quan_muc_tieu()
      .finally(() => this.cdr.markForCheck());
  }

  private getDateFromPayload(): string {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    console.log(formattedToday);
    return this.payload?.date || formattedToday;
  }

  // kiểm tra sự kiện phải Date từ mid sang right
  private isDatePayload(payload: any): boolean {
    return payload && payload.payload.type === 'Date';
  }

  initialArticleCorrelationSettings() {
    this.articleCorrelationPalette = ['#045E2B'];

    this.articleCorrelationPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem',
        fontWeight: 'bold',
      },
    };
    this.articleCorrelationColorMapping = 'color';

    this.articleCorrelationMarker = {
      dataLabel: {
        visible: true,
        position: 'Middle', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: 'bold',
          color: '#ffffff', // Text color
          size: '2.5rem', // Text size
        },
        template: '<div>${point.y} bài viết</div>', // Custom template for data label
      },
    };
    this.articleCorrelationTooltip = {
      enable: true,
      textStyle: {
        size: '20px',
        textAlignment: 'Center',
      },
    };
  }
  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 30,
      alignment: 'Center',
      textStyle: {
        size: '1.8rem',
        textAlignment: 'Center',
      },
    };

    this.targetCorrelationDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
  }
}
