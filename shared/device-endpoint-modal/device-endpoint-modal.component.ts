import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-device-endpoint-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './device-endpoint-modal.component.html',
  styleUrls: ['./device-endpoint-modal.component.scss']
})
export class DeviceEndpointModalComponent {
  // let qsqp = await this.supabase.getDanhSachEndpoint(this.subType,this.deviceName,this.page_index,this.page_size);
  // console.log("qsqp",qsqp)
  @Input() deviceName:string;
  @Input() subType:string;

    deviceList: Promise<any>;
    page_index = 1;
    page_size = 10;
    total = 0;
    pages: number[];
    totalPages: number;
    gotoPage: number = 1;
  constructor(
    private readonly supabase: SupabaseService
  ) {
  }

  ngOnInit(){
    this.deviceList = this.supabase.getDanhSachEndpoint(this.subType,this.deviceName,this.page_index,this.page_size);
  }

  pagination(page:number,page_size:number){
    this.deviceList = this.supabase.getDanhSachEndpoint(this.subType,this.deviceName,page,page_size);
    this.page_index = page;
    this.page_size = page_size;
    this.totalPages = Math.ceil(this.total / this.page_size);
  }
}
