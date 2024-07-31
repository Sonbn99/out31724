import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
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
import { startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';
import { SocketEventType } from '../../../../models/utils-type';
import { TCTTTargetType } from '../../../../models/btth.type';
import { PayloadChannel } from '../../../../models/payload-channel';

@Component({
  selector: 'app-warface-technique',
  standalone: true,
  providers: [
    DateTimeService,

    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
  ],
  imports: [CommonModule, ChartModule],
  templateUrl: './warface-technique.component.html',
  styleUrls: ['./warface-technique.component.scss'],
})
export class WarfaceTechniqueComponent implements OnInit {
  // warface technique bar var
  public warfacePrimaryXAxis: any;
  public warfaceData?: Promise<any[]>;
  public warfaceTitle: string;
  warfacePrimaryYAxis: any;
  public warfacePalette: string[];
  public warfacePointMapping: Object;
  public totalWeaponCount: number = 0;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  startDate$: any;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];

    // lấy sự kiện chọn vùng
    // this.supabaseService.listenToChannel('regionSelected');
    // this.eventSubscriptionArea = this.supabaseService.payload$.pipe(

    // ).subscribe(
    //   (payload) => {
    //     console.log('Received event Area From Midpanel:', payload);
    //   },
    //   (error) => {
    //     console.error('Error subscribing to event Area:', error);
    //   }
    // );
    this.subscribeToDateSelected();
    this.subscribeToRegionSelected();

    //warface bar var

    this.warfacePrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
    };

    // this.warfacePointMapping = 'color'
    this.warfacePointMapping = [
      { value: 'T5', color: '#F58501' },
      { value: 'T1', color: '#1D85E7' },
      { value: 'T2', color: '#DAF7A6' },
      { value: 'T3', color: '#8b4ef5' },
    ];
    this.warfacePalette = ['#045E2B', '#045E2B', '#045E2B', '#045E2B'];

    // ky thuat tac chien
    this.warfaceData = this.supabaseService.t5_kythuattacchien().finally(() => {
      this.warfaceData!.then((data) => {
        this.totalWeaponCount = data.reduce((acc, item) => acc + item.count, 0);
        this.cdr.markForCheck();
      });
    });
  }

  subscribeToRegionSelected() {
    //this.supabaseService.listenToChannel('regionSelected');
  }
  subscribeToDateSelected() {
    //this.supabaseService.listenToChannel('dateSelected');
  }
}
