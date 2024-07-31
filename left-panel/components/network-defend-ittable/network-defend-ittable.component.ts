import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AccumulationChartModule,
  ChartModule,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { PayloadChannel } from '../../../../models/payload-channel';
import { SocketEventType } from '../../../../models/utils-type';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ItInfrasComponent } from '../../../shared/network-defense/it-infras/it-infras.component';
import { InfrastructureAlertComponent } from '../../../shared/network-defense/infrastructure-alert/infrastructure-alert.component';
import { SafetyInformationComponent } from '../../../shared/network-defense/safety-information/safety-information.component';
import { SafetyInformationAlertComponent } from '../../../shared/network-defense/safety-information-alert/safety-information-alert.component';


@Component({
  selector: 'app-network-defend-ittable',
  standalone: true,

  imports: [
    CommonModule,
    AccumulationChartModule,
    ChartModule,
    RadioButtonModule,
    ChartModule,
    ItInfrasComponent,
    InfrastructureAlertComponent,
    SafetyInformationComponent,
    SafetyInformationAlertComponent,
  ],
  templateUrl: './network-defend-ittable.component.html',
  styleUrls: ['./network-defend-ittable.component.scss'],
})
export class NetworkDefendITTableComponent implements OnInit {

   mainType:any = '';
   subType:any = '';
   alertType: string = '';


  constructor(
    private supabase: SupabaseService,
  ) {}

  ngOnInit() {}

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
  changeSelect(event: any) {
    this.mainType = event;
    // this.getData(event);
    // this.getDanhSachCanhBao(null, event, null); //TODO: fix this
    // this.getDisconnectedList(event, null); //TODO: fix this
    //
    // await this.getDataChart(event);
  }
}
