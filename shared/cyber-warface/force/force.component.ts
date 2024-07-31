import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoryService,
  ChartModule,
  DataLabelService,
  DateTimeService,
  LegendService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';
import { SocketEventType } from '../../../../models/utils-type';
import { TCTTTargetType } from '../../../../models/btth.type';
import { PayloadChannel } from '../../../../models/payload-channel';

@Component({
  selector: 'app-force',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    DateTimeService,
    CategoryService,
    DataLabelService,
    LegendService,
    TooltipService,
    StackingColumnSeriesService,
  ],
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.scss'],
})
export class ForceComponent implements OnInit {
  // biểu đồ lc lượng UCSC
  public forcePrimaryXAxis: Object;
  public forceData?: Promise<any[]>;
  public title: string;
  forcePrimaryYAxis: any;
  public forceLegendSettings: Object;
  public forceColors: string[];
  public total01: number = 0;
  public total02: number = 0;
  public total03: number = 0;
  public totalLucLuongCMF: number = 0;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  startDate$: any;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];

    // force column var
    this.forcePrimaryXAxis = {
      title: '',
      interval: 1,
      valueType: 'Category',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
      },
    };
    this.forceColors = ['#045E2B', '#F58501', '#16C8C7', '#1D85E7'];

    this.forceLegendSettings = {
      visible: false,
      position: 'Bottom', // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '1em', // Change the font size as needed
      },
    };

    this.forceData = this.supabaseService.t5_lucluong().finally(() => {
      this.forceData!.then(data => {
        this.total01 = this.total01 = this.calculateOverallTotal(data);
        console.log(this.total01)
        this.totalLucLuongCMF = data.reduce((total, item) => total + (Object.keys(item).length), 0);
        console.log(this.totalLucLuongCMF)

        this.cdr.markForCheck();
      });
    });
  }

  calculateOverallTotal = (data: any[]) => {
    return data.reduce((acc, item) => {
        const itemTotal = Object.keys(item)
            .filter(key => key.startsWith('y'))
            .reduce((sum, key) => sum + item[key], 0);
        return acc + itemTotal;
    }, 0);
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
