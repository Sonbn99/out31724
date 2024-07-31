import {
  ChangeDetectorRef,
  Component,
  inject,
  Output,
  EventEmitter,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
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
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { PayloadChannelData } from '../../../../models/payload-channel';

@Component({
  selector: 'app-hot-topic',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    LegendService,
    TooltipService,
  ],
  templateUrl: './hot-topic.component.html',
  styleUrls: ['./hot-topic.component.scss'],
})
export class HotTopicComponent implements OnInit, OnChanges {
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

  //basic color
  public basicColor: string[];
  //hot topic column var
  public hotTopicPrimaryXAxis: any;
  public hotTopicData?: Promise<any[]>;
  public hotTopicTitle: string;
  hotTopicPrimaryYAxis: any;
  public hotTopicPointMapping: Object;
  public hotTopicMarker: Object;
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit() {
    this.basicColor = ['#4f8e6b', '#ffffff'];
    this.updateData();

    // hot topic column var
    this.hotTopicPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
        row: 2,
      },
    };
    this.hotTopicMarker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '100',
          color: '#000000', // Text color
          size: '2rem', // Text size
        },
        template: '<div>${point.y} bài viết</div>', // Custom template for data label
      },
    };
    this.hotTopicPointMapping = 'color';
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
      console.log('hot topic update', this.payload.payload.type);
    }
  }

  private isDatePayload(payload: any): boolean {
    return payload && payload.payload.type === 'Date';
  }

  private updateData() {
    const dateFromPayload = this.getDateFromPayload(); // Implement this method to extract date from payload
    this.hotTopicData = this.supabaseService
      .tctt_thong_ke_chu_de_nong('2024-07-26')
      .finally(() => this.cdr.markForCheck());
  }

  private getDateFromPayload(): string {
    // Extract date from the payload; assuming payload contains a date property
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    return this.payload?.date || formattedToday;
  }
}
