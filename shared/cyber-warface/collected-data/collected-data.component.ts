import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';

@Component({
  selector: 'app-collected-data',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    DateTimeService,
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
  ],
  templateUrl: './collected-data.component.html',
  styleUrls: ['./collected-data.component.scss'],
})
export class CollectedDataComponent implements OnInit {
  //basic color
  public basicColor: string;

  //collect column var
  public collectPrimaryXAxis: any;
  public collectData?: Promise<any[]>;
  collectPrimaryYAxis: any;
  public collectPointMapping: Object;
  public collectMarker: Object;
  public totalCollectData: number = 0;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  startDate$: any;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];
    this.basicColor = '#4f8e6b';

    //collect data column var
    this.collectPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
      },
    };
    this.collectPointMapping = 'color';
    this.collectMarker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: 'bold',
          color: '#000000', // Text color
          size: '2rem', // Text size
        },
        template: '<div>${point.y} GB</div>', // Custom template for data label
      },
    };

    this.collectData = this.supabaseService.t5_dulieuthuthap().finally(() => {
      this.collectData!.then((data) => {
        this.totalCollectData = data.reduce(
          (acc, item) => acc + item.result_number,
          0,
        );
        this.cdr.markForCheck();
      });
    });
  }
}
