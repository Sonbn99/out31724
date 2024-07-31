import { ChangeDetectorRef, Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../../services/supabase.service';
import { SocketEventType } from '../../../../models/utils-type';
import { TCTTTargetType } from '../../../../models/btth.type';
import { PayloadChannel } from '../../../../models/payload-channel';

@Component({
  selector: 'app-protecting-target',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protecting-target.component.html',
  styleUrls: ['./protecting-target.component.scss'],
})
export class ProtectingTargetComponent implements OnInit {
  // mục tiêu bảo vệ
  @Output() popupToggled = new EventEmitter<{ isPopupVisible: boolean, typePopup: string }>();
  
  public baoveData?: Promise<any[]>;
  private cdr = inject(ChangeDetectorRef);
  private supabaseService = inject(SupabaseService);
  startDate$: any;

  constructor() {}
  ngOnInit() {
      // tq
    this.baoveData = this.supabaseService
      .tctt_muc_tieu_bao_ve()
      .finally(() => this.cdr.markForCheck());

      console.log('muc tieu bao ve data',this.baoveData)
  }

  togglePopup(isPopupVisible: boolean, typePopup: string){
    this.popupToggled.emit({isPopupVisible,typePopup});
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
