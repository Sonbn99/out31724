import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-device-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './device-detail-modal.component.html',
  styleUrls: ['./device-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DeviceDetailModalComponent implements OnInit  {

@Input() source_mac:string;
@Input() main_type:string;
@Input() sub_type:string;
@Input() alert_type:string;

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
    this.deviceList = this.supabase.getDanhSachCanhBao(this.source_mac,this.main_type,this.sub_type,this.alert_type,this.page_index,this.page_size);
  }

  pagination(page:number,page_size:number){
    this.deviceList = this.supabase.getDanhSachCanhBao(this.source_mac,this.main_type,this.sub_type,this.alert_type,this.page_index,this.page_size);
    this.page_index = page;
    this.page_size = page_size;
    this.totalPages = Math.ceil(this.total / this.page_size);

  }
}
