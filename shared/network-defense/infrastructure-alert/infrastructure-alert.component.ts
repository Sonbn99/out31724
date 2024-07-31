import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AxisModel,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  LegendService,
  LegendSettingsModel,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { Constant } from '../../../../../../core/config/constant';
import { SupabaseService } from '../../../../services/supabase.service';
import { SocketEventType } from '../../../../models/utils-type';
import { PayloadChannel } from '../../../../models/payload-channel';

@Component({
  selector: 'app-infrastructure-alert',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    CategoryService,
    ScrollBarService,
    ColumnSeriesService,
    ChartAnnotationService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    DataLabelService,
  ],
  templateUrl: './infrastructure-alert.component.html',
  styleUrls: ['./infrastructure-alert.component.scss'],
})
export class InfrastructureAlertComponent implements OnInit {
  disconnectedListPromise: Promise<any>;

  // biểu đồ sự cố hạ tầng
  public disconnectedDevice: Object[] = [];
  public disconnectedService: Object[] = [];
  public disconnectedSystemMoritor: Object[] = [];

  public disconnectedDeviceDaXuLy: Object[] = [];
  public disconnectedServiceDaXuLy: Object[] = [];
  public disconnectedSystemMoritorDaXuLy: Object[] = [];


  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel;
  public legendSettings: LegendSettingsModel;

  public dataLabel: Object = [];
  public marker: Object;

  public countMKTChartUDDV: number = 0;
  public countDaXuLyChartUDDV: number = 0;


  public summaryDevice: any = {

  };
  public summaryService: any = {

  };
  public summaryMoritor: any = {

  };

  public alertType: string = '';
  public subType: string = '';
  private _mainType: string = '';

  @Input()
  set mainType(value: string) {
    this._mainType = value;
    this.getDisconnectedList(this.mainType, null);

    (async () => {
      await this.getDataChart(this.mainType);
    })();
  }

  get mainType(): string {
    return this._mainType;
  }

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {
    this.signIn();
  }

  async ngOnInit(): Promise<void> {
    // biểu đồ sự cố hạ tầng ứng dụng dich vụ
    this.primaryXAxis = {
      majorGridLines: { width: 0 },
      minorGridLines: { width: 0 },
      majorTickLines: { width: 0 },
      minorTickLines: { width: 0 },
      interval: 1,
      lineStyle: { width: 0 },
      valueType: 'Category',
      labelStyle: {
        size: '2rem',
      },
    };
    this.primaryYAxis = {
      title: '',
      lineStyle: { width: 0 },
      majorTickLines: { width: 0 },
      majorGridLines: { width: 1 },
      minorGridLines: { width: 1 },
      minorTickLines: { width: 0 },
      labelFormat: '{value}',
      labelStyle: {
        size: '2rem',
      },
    };

    this.legendSettings = {
      visible: true,
      position: 'Right', // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '24px', // Change the font size as needed
      },
    };
    this.dataLabel = {
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '24px',
        color: '#ffffff',
        size: '30px',
      },
    };

    this.marker = {
      visible: true,
      width: 30,
      height: 30,
      dataLabel: this.dataLabel,
    };
    this.getDisconnectedList(this.mainType, null);
    await this.getDataChart(this.mainType);
  }

  getDisconnectedList(
    main_type: any,
    sub_type: any,
    column_type: any = '',
    n_day: number = 5,
    page_index: number = 1,
    page_size: number = 3,
  ) {
    this.disconnectedListPromise = this.supabase.getDanhSachHeThongMatKetNoi(
      main_type,
      sub_type,
      column_type,
      n_day,
      page_index,
      page_size,
    );
  }

  signIn() {
    this.supabase.signIn();
  }

  sendMapEvent(
    channelName: string,
    eventName: string,
    type: SocketEventType = 'ROUTER',
  ) {
    let channel: any;
    channel = this.supabase.joinChannel();
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        const payload: PayloadChannel = { socketEventType: type, data: {} };
        this.supabase.sendEvent(channel, eventName, payload);
        console.log('Event sent:', channel, eventName);
      }
    });
  }

  async onClickChartSuCoUngDungHaTang(event: any) {
    let sub_type = '';
    let _sub_type = event?.point?.x;
    if (_sub_type == Constant.TYPE.BQP) {
      sub_type = Constant.SUB_TYPE_DEVICE.QS_QP;
    } else {
      sub_type = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    };
    this.subType = sub_type;
    this.alertType = event.point.series.properties.stackingGroup;
    this.getDisconnectedList(
      this.mainType,
      sub_type,
      event.point.series.properties.stackingGroup,
    );
  }

  getValueSuCoHaTang(key_list: any, sys: any) {
    return key_list.find((e: any) => e?.sys == sys)?.mkn || 0;
  }
  getValueSuCoHaTangDaXuLy(key_list: any, sys: any) {
    return key_list.find((e: any) => e?.sys == sys)?.daxuly || 0;
  }

  async getDataChart(main_type: any) {
    let suCoHaTangUDDVQSQP = await this.supabase.getThongKeSuCoHaTangUDDV(
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
      Constant.N_DAY,
    );
    let suCoHaTangUDDVTYQG = await this.supabase.getThongKeSuCoHaTangUDDV(
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
      Constant.N_DAY,
    );

    if (main_type == Constant.MAIN_TYPE.QS) {
      this.disconnectedDevice = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'device'),
        },
      ];
      this.disconnectedService = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'service'),
        },
      ];
      this.disconnectedSystemMoritor = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'server_monitor'),
        },
      ];


      this.disconnectedDeviceDaXuLy = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'device'),
        },
      ];
      this.disconnectedServiceDaXuLy = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'service'),
        },
      ];
      this.disconnectedSystemMoritorDaXuLy = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'server_monitor'),
        },
      ];

      this.countMKTChartUDDV = suCoHaTangUDDVQSQP.reduce((sum: number, item: any) => sum + item?.mkn,0);

      this.countDaXuLyChartUDDV = suCoHaTangUDDVQSQP.reduce((sum: number, item: any) => sum + item?.daxuly,0);

      this.summaryDevice = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'device'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'device'),
      };
      this.summaryService = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'service'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'service'),
      };
      this.summaryMoritor = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'server_monitor'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'server_monitor'),
      };

    } else if (main_type == Constant.MAIN_TYPE.CD) {
      this.disconnectedDevice = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'device'),
        },
      ];
      this.disconnectedService = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'service'),
        },
      ];
      this.disconnectedSystemMoritor = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'server_monitor'),
        },
      ];

      this.disconnectedDeviceDaXuLy = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'device'),
        },
      ];
      this.disconnectedServiceDaXuLy = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'service'),
        },
      ];
      this.disconnectedSystemMoritorDaXuLy = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'server_monitor'),
        },
      ];

      this.countMKTChartUDDV = suCoHaTangUDDVTYQG.reduce(
        (sum: number, item: any) => sum + item?.mkn,
        0,
      );
      this.countDaXuLyChartUDDV = suCoHaTangUDDVTYQG.reduce(
        (sum: number, item: any) => sum + item?.daxuly,
        0,
      );

      this.summaryDevice = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'device'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'device'),
      };
      this.summaryService = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'service'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'service'),
      };
      this.summaryMoritor = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'server_monitor'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'server_monitor'),
      };
    } else {
      this.disconnectedDevice = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'device'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'device'),
        },
      ];
      this.disconnectedService = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'service'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'service'),
        },
      ];
      this.disconnectedSystemMoritor = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'server_monitor'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'server_monitor'),
        },
      ];

      this.countMKTChartUDDV = [
        ...suCoHaTangUDDVQSQP,
        ...suCoHaTangUDDVTYQG,
      ].reduce((sum: number, item: any) => sum + item?.mkn, 0);

      this.countDaXuLyChartUDDV = [
        ...suCoHaTangUDDVQSQP,
        ...suCoHaTangUDDVTYQG,
      ].reduce((sum: number, item: any) => sum + item?.daxuly, 0);

      this.summaryDevice = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'device')  + this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'device'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'device') + this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'device'),
      };
      this.summaryService = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'service') + this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'service'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'service') + this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'service'),
      };
      this.summaryMoritor = {
        daxuly: this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVQSQP, 'server_monitor') + this.getValueSuCoHaTangDaXuLy(suCoHaTangUDDVTYQG, 'server_monitor'),
        mkn :  this.getValueSuCoHaTang(suCoHaTangUDDVQSQP, 'server_monitor') + this.getValueSuCoHaTang(suCoHaTangUDDVTYQG, 'server_monitor') ,
      };
    }

    this.cdr.detectChanges();
  }

  async pagination(page: number, page_size: number) {
    // let suCoHaTangUDDVQSQP = await this.supabase.getThongKeSuCoHaTangUDDV(main_type,Constant.SUB_TYPE_DEVICE.QS_QP);
    // let suCoHaTangUDDVTYQG = await this.supabase.getThongKeSuCoHaTangUDDV(main_type,Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,);
    // this.suco = this.supabase.getDanhSachDevice(this.subType,this.deviceName,page,page_size);
    // this.page_index = page;
    // this.page_size = page_size;
    // this.totalPages = Math.ceil(this.total / this.page_size);
    this.getDisconnectedList(
      this.mainType,
      this.subType,
      this.alertType,
      Constant.N_DAY,
      page,
      page_size,
    );

    // this.getDisconnectedList('',this.mainType, this.subType, this.alertType,page,page_size);
    this.cdr.detectChanges();
  }

  getSummaryDevices() {

  }

  getType(data: any) {

    let key:any ={
      PORTAL:"Cổng thông tin điện tử",
      ROUTER:"Thiết bị định tuyến",
      SWITCH:"Thiết bị chuyển mạng",
      FIREWALL:"Tường lửa"
    };
    return key[data.type] || data.type.toUpperCase();
  }

  getTenDV(data: any) {
    return data?.unit_name_full || '';
  }

  getIpTenMien(data: any) {
    return (
      data?.ip ||
      data?.nms?.management_ip ||
      data?.nac?.management_ip ||
      data?.description ||
      ''
    );
  }

  getLastActive(data: any) {
    var a = data?.last_up || data?.nms?.last_active || data?.nac?.last_active;
    // return new Date(a).toISOString().split('T')[0];
    return a?.replace('T', ' ');
  }

  getValueNetwork(name: any) {
    let key:any ={
      INT:"Internet",
      QS:"Quân sự",
      CD:"Chuyên dùng"
    };
    return key[name] || '';
  }
}
