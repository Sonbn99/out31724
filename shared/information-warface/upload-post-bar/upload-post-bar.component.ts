import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../../services/supabase.service';
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

@Component({
  selector: 'app-upload-post-bar',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    DateTimeService,
    MultiColoredLineSeriesService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
  ],
  templateUrl: './upload-post-bar.component.html',
  styleUrls: ['./upload-post-bar.component.scss'],
})
export class UploadPostBarComponent implements OnInit {
  //basic color
  public basicColor: string;

  // upload post bar var
  public uploadPostPrimaryXAxis: any;
  public uploadPostData: Object[];
  public uploadPostTitle: string;
  uploadPostPrimaryYAxis: any;
  public uploadPostColorMapping: Object;

  private supabaseService = inject(SupabaseService);

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    //upload post bar var
    this.uploadPostData = [];
    this.uploadPostPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
    };
    this.uploadPostColorMapping = 'color';
    this.basicColor = '#4f8e6b';
  }
}
