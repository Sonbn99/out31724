import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../../../../../core/config/constant';
import { SupabaseService } from '../../../../services/supabase.service';
import { SocketEventType } from '../../../../models/utils-type';
import { PayloadChannel } from '../../../../models/payload-channel';
import { NumberFormatPipe } from "../../../../../../core/pipes/number-format/number-format.pipe";

@Component({
  selector: 'app-safety-information',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './safety-information.component.html',
  styleUrls: ['./safety-information.component.scss'],
})
export class SafetyInformationComponent implements OnInit {
  public deviceQSQP: any;
  public deviceTYQG: any;
  public thietBiDauCuoiQSQP: any;
  public thietBiDauCuoiTYQG: any;

  public thietBiTrienKhaiATTT: Promise<any>;
  public countPortalQSQP: any;
  public countPortalTYQG: any;
  public countCommonQSQP: any;
  public countCommonTYQG: any;

  private _mainType: string = '';

  @Input()
  set mainType(value: string) {
    this.getData(value);
    this._mainType = value;
  }

  get mainType(): string {
    return this._mainType;
  }
  constructor(private supabase: SupabaseService) {
    this.signIn();
  }

  async ngOnInit(): Promise<void> {
    this.getData(this.mainType);
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

  async getData(main_type: any) {
    this.deviceQSQP = this.supabase.getThongKeDevice(
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
    );
    this.deviceTYQG = this.supabase.getThongKeDevice(
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
    );

    this.thietBiDauCuoiQSQP = this.supabase.getThongKeEndpoint(
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
    );
    this.thietBiDauCuoiTYQG = this.supabase.getThongKeEndpoint(
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
    );

    this.countPortalQSQP = this.supabase.getThongKeUngDungDichVu(
      Constant.SERVICE_TYPE.PORTAL,
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
    );
    this.countPortalTYQG = this.supabase.getThongKeUngDungDichVu(
      Constant.SERVICE_TYPE.PORTAL,
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
    );

    this.countCommonQSQP = this.supabase.getThongKeUngDungDichVu(
      Constant.SERVICE_TYPE.COMMON,
      main_type,
      Constant.SUB_TYPE_DEVICE.QS_QP,
    );
    this.countCommonTYQG = this.supabase.getThongKeUngDungDichVu(
      Constant.SERVICE_TYPE.COMMON,
      main_type,
      Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,
    );

    this.thietBiTrienKhaiATTT = this.supabase.getThongKeTrienKhaiATTT(main_type);
  }

  getValueTrienKhai(key_list: any, sys: any) {
    return key_list.find((e: any) => e?.sys == sys);
  }
}
