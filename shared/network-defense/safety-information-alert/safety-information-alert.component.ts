import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { Constant } from '../../../../../../core/config/constant';
import { SupabaseService } from '../../../../services/supabase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketEventType } from '../../../../models/utils-type';
import { PayloadChannel } from '../../../../models/payload-channel';
import { DeviceDetailModalComponent } from '../../device-detail-modal/device-detail-modal.component';

@Component({
  selector: 'app-safety-information-alert',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    DataLabelService,
  ],
  templateUrl: './safety-information-alert.component.html',
  styleUrls: ['./safety-information-alert.component.scss'],
})
export class SafetyInformationAlertComponent implements OnInit {
  private eventSent: boolean = false;

  eventListPromise: Promise<any>;
  disconnectedListPromise: Promise<any>;

  // biểu đồ sự cố hạ tầng
  public malware: Object[] = [];
  public black_domain: Object[] = [];
  public internet: Object[] = [];
  public hunting: Object[] = [];

  public malware_daxuly: Object[] = [];
  public black_domain_daxuly: Object[] = [];
  public internet_daxuly: Object[] = [];
  public hunting_daxuly: Object[] = [];

  public primaryXAxis: Object = [];
  public primaryYAxis: Object = [];
  public legendSettings: Object = [];
  public dataLabel: Object = [];
  public marker: Object;

  public countTotalChartSuCoATTT: number = 0;
  public countDaXuLyChartSuCoATTT: number = 0;


  public summaryMalware: any = {

  };
  public summaryBlackDomain: any = {

  };
  public summaryInternet: any = {

  };
  public summaryHunting: any = {

  };
  public subType: string = '';

  public alertType: string = '';

  private _mainType: string = '';

  @Input()
  set mainType(value: string) {
    this._mainType = value;

    this.getDanhSachCanhBao('', this.mainType, null, '');

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
    private modalService: NgbModal,
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
        fontWeight: '600',
        color: '#ffffff',
        size: '30px',
      },
    };

    this.marker = {
      visible: true,
      width: 10,
      height: 10,
      dataLabel: this.dataLabel,
    };
    this.getDanhSachCanhBao('', this.mainType, null, '');

    await this.getDataChart(this.mainType);
  }
  async getDanhSachCanhBao(
    source_mac: any = null,
    main_type: any,
    sub_type: any,
    column_type: string = '',
    page_index: number = 1,
    page_size: number = 3,
  ) {
    this.eventListPromise = this.supabase.getDanhSachCanhBao(
      source_mac,
      main_type,
      sub_type,
      column_type,
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

  openModalDetail(source_mac: string): void {
    const modalRef = this.modalService.open(DeviceDetailModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.source_mac = source_mac;
    modalRef.componentInstance.main_type = this.mainType;
    modalRef.componentInstance.sub_type = this.subType;
    modalRef.componentInstance.alert_type = this.alertType;
  }

  async onClickChartSuCoATTT(event: any) {
    let sub_type = '';
    let _sub_type = event?.point?.x;
    if (_sub_type == Constant.TYPE.BQP) {
      sub_type = Constant.SUB_TYPE_DEVICE.QS_QP;
    } else {
      sub_type = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    }
    this.subType = sub_type;
    this.alertType = event.point.series.properties.stackingGroup;
    this.getDanhSachCanhBao(
      null,
      this.mainType,
      sub_type,
      event.point.series.properties.stackingGroup,
    );
  }

  async getDataChart(main_type: any) {
    let canhBaoSuCoATTTQS = await this.supabase.getThongKeCanhBao(
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
    );
    let canhBaoSuCoATTTTYQG = await this.supabase.getThongKeCanhBao(
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
    );

    if (main_type == Constant.MAIN_TYPE.QS) {
      this.malware = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        },
      ];
      this.black_domain = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        },
      ];
      this.internet = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        },
      ];
      this.hunting = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        },
      ];
      this.malware_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        },
      ];
      this.black_domain_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        },
      ];
      this.internet_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        },
      ];
      this.hunting_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        },
      ];

      this.countTotalChartSuCoATTT = canhBaoSuCoATTTQS.reduce((sum: number, item: any) => sum + item?.tong,0);
      this.countDaXuLyChartSuCoATTT = canhBaoSuCoATTTQS.reduce((sum: number, item: any) => sum + item?.daxuly,0);

      this.summaryMalware = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
      };
      this.summaryBlackDomain = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
      };
      this.summaryInternet = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
      };
      this.summaryHunting = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
      }
    } else if (main_type == Constant.MAIN_TYPE.CD) {
      this.malware = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
        },
      ];
      this.black_domain = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
        },
      ];
      this.internet = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
        },
      ];
      this.hunting = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
        },
      ];

      this.malware_daxuly = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        },
      ];
      this.black_domain_daxuly = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        },
      ];
      this.internet_daxuly = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        },
      ];
      this.hunting_daxuly = [
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        },
      ];
      this.countTotalChartSuCoATTT = canhBaoSuCoATTTTYQG.reduce((sum: number, item: any) => sum + item?.tong,0);
      this.countDaXuLyChartSuCoATTT = canhBaoSuCoATTTTYQG.reduce((sum: number, item: any) => sum + item?.daxuly,0);


      this.summaryMalware = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
      };
      this.summaryBlackDomain = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
      };
      this.summaryInternet = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
      };
      this.summaryHunting = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
      }
    } else {
      this.malware = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
        },
      ];
      this.black_domain = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
        },
      ];

      this.internet = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
        },
      ];
      this.hunting = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
        },
      ];

      this.malware_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'MALWARE'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
        },
      ];
      this.black_domain_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
        },
      ];

      this.internet_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'INTERNET'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
        },
      ];
      this.hunting_daxuly = [
        {
          x: Constant.TYPE.BQP,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'HUNTING'),
        },
        {
          x: Constant.TYPE.TYQG,
          y: this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
        },
      ];
      this.countTotalChartSuCoATTT = [
        ...canhBaoSuCoATTTQS,
        ...canhBaoSuCoATTTTYQG,
      ].reduce((sum: number, item: any) => sum + item?.tong, 0);
      this.countDaXuLyChartSuCoATTT = [
        ...canhBaoSuCoATTTQS,
        ...canhBaoSuCoATTTTYQG,
      ].reduce((sum: number, item: any) => sum + item?.daxuly, 0);

      this.summaryMalware = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'MALWARE') + this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
        tong:  this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'MALWARE') + this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'MALWARE'),
      };
      this.summaryBlackDomain = {
        daxuly:  this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN') + this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
        tong:  this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'BLACK_DOMAIN') + this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'BLACK_DOMAIN'),
      };
      this.summaryInternet = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'INTERNET') + this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
        tong: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'INTERNET') + this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'INTERNET'),
      };
      this.summaryHunting = {
        daxuly: this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTQS, 'HUNTING') + this.getValueDaXuLySuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
        tong: this.getValueTongSuCoATTT(canhBaoSuCoATTTQS, 'HUNTING') + this.getValueTongSuCoATTT(canhBaoSuCoATTTTYQG, 'HUNTING'),
      }
    }

    this.cdr.detectChanges();
  }

  async pagination(page: number, page_size: number) {
    this.getDanhSachCanhBao(
      '',
      this.mainType,
      this.subType,
      this.alertType,
      page,
      page_size,
    );
  }

  getValueTongSuCoATTT(key_list: any, alert_type: any) {
    return key_list.find((e: any) => e?.alert_type == alert_type)?.tong || 0;
  }
  getValueDaXuLySuCoATTT(key_list: any, alert_type: any) {
    return key_list.find((e: any) => e?.alert_type == alert_type)?.daxuly || 0;
  }
  getValueNetwork(name: any) {
    let key:any ={
      INT:"Internet",
      QS:"Quân sự",
      CD:"Chuyên dùng"
    };
    return key[name] || '';
  }
  getValueAlertType(name: any) {
    let key:any ={
      MALWARE:"Mã độc",
      BLACK_DOMAIN:"Tên miền",
      INTERNET:"Kết nối Internet",
      HUNTING:"Bất thường",
    };
    return key[name] || '';
  }
  getLastActive(data: any) {
    console.log(data);
    // var a = data?.last_active || data?.last_up || data?.nms?.last_active || data?.nac?.last_active;
    // return new Date(a).toISOString().split('T')[0];
    return data? new Date(data)?.toLocaleString():"";
  }
}
