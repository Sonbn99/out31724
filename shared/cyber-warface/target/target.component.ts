import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  DateTimeService,
  MultiColoredLineSeriesService,
  PieSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';
import { SocketEventType } from '../../../../models/utils-type';
import { TCTTTargetType } from '../../../../models/btth.type';
import { PayloadChannel } from '../../../../models/payload-channel';

@Component({
  selector: 'app-target',
  standalone: true,
  providers: [
    DateTimeService,
    MultiColoredLineSeriesService,
    PieSeriesService,
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
  ],
  imports: [CommonModule, AccumulationChartModule],
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  //basic color
  public basicColor: string;

  // target donut var
  public targetData?: Promise<any[]>;
  public targetDataLabel: Object;
  public targetColors: string[];
  public targetTitle: string;
  public targetlegendSettings: Object;
  public totaltargetData: number = 0;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  startDate$: any;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];

    // target donut var
    this.targetDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
    this.targetColors = ['#045E2B', '#F58501', '#16C8C7', '#1D85E7'];
    this.targetlegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 30,
    };

    this.basicColor = '#4f8e6b';
    this.cdr.markForCheck();

    // this.targetData = this.supabase.t5_muctieu().finally(() => this.cdr.markForCheck());
    this.targetData = this.supabaseService.t5_muctieu().finally(() => {
      this.targetData!.then((data) => {
        this.totaltargetData = data.reduce((acc, item) => acc + item.count, 0);
        this.cdr.markForCheck();
      });
    });
  }
  sendMapEvent(
    channelName: string,
    eventName: string,
    type: SocketEventType = 'TCTT',
    tcttType: TCTTTargetType,
  ) {
    let channel: any;
    channel = this.supabaseService.joinChannel();
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        const payload: PayloadChannel = {
          socketEventType: type,
          data: {
            tctt: {
              type: tcttType,
            },
          },
        };
        this.supabaseService.sendEvent(channel, eventName, payload);
      }
    });
  }
}
