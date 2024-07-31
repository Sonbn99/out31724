import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-operational-command',
  standalone: true,
  imports: [CommonModule,TooltipModule ],
  templateUrl: './operational-command.component.html',
  styleUrls: ['./operational-command.component.scss']
})
export class OperationalCommandComponent implements OnInit {

  shiftOperation: any;
  page:number = 1;
  page_size = 3;

  constructor(
    private cdr: ChangeDetectorRef,
  ){}
  async ngOnInit(): Promise<void> {

    let response = await fetch(`${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${this.page}&page_size=${this.page_size}`);

    let data = await response.json();

    this.shiftOperation = data;


  //   this.shiftOperation  = {
  //     "current_page": 1,
  //     "nhiemvus": [
  //         {
  //             "DoKhan": "Thường",
  //             "DonViXuLy": " T1,T2,T3",
  //             "LoaiTin": "Trinh sát, giám sát",
  //             "NgayGiao": "18/7/2024",
  //             "NguoiGiao": "4// Phạm Hải An - P.TMT",
  //             "NguonTin": "Thủ trưởng Bộ",
  //             "NhiemVu": " Tăng cường giám sát diễn tập quân sự tại Vịnh Bắc Bộ",
  //             "NoiDung": "Nội dung nhiệm vụ",
  //             "ThoiHanXuLy": "16/07/2024",
  //             "VuViec": "",
  //             "linkfiles": [
  //                 {
  //                     "Linkfile": "http://localhost:10000/tep-tin/DNP2801Uploads.,;YKien_TT.,;39458C39F6951DF4F647321C79C993C8.,;onesms_cai_dat_v10.1_v1.102016.docx1983DIZI.html",
  //                     "TenFile": "onesms_cai_dat_v10.1_v1.102016.docx"
  //                 },
  //                 {
  //                     "Linkfile": "http://localhost:10000/tep-tin/DNP2801Uploads.,;YKien_TT.,;39458C39F6951DF4F647321C79C993C8.,;van.txt1983DIZI.html",
  //                     "TenFile": "van.txt"
  //                 },
  //                 {
  //                     "Linkfile": "http://localhost:10000/tep-tin/DNP2801Uploads.,;YKien_TT.,;39458C39F6951DF4F647321C79C993C8.,;VT86.txt1983DIZI.html",
  //                     "TenFile": "VT86.txt"
  //                 },
  //                 {
  //                     "Linkfile": "http://localhost:10000/tep-tin/DNP2801Uploads.,;YKien_TT.,;39458C39F6951DF4F647321C79C993C8.,;VT861.txt1983DIZI.html",
  //                     "TenFile": "VT861.txt"
  //                 }
  //             ]
  //         },
  //         {
  //           "DoKhan": "Khẩn",
  //           "DonViXuLy": " T5",
  //           "LoaiTin": "Trinh sát, giám sát",
  //           "NgayGiao": "18/7/2024",
  //           "NguoiGiao": "2// Nguyễn Văn Bắc - TPTC/BTM",
  //           "NguonTin": "Thủ trưởng Bộ",
  //           "NhiemVu": "  Trinh sát thông tin liên quan đến vụ việc quân nhân tử vong.",
  //           "NoiDung": "Nội dung nhiệm vụ",
  //           "ThoiHanXuLy": "16/07/2024",
  //           "VuViec": "",
  //       }
  //     ],
  //     "page_size": 1,
  //     "total_doccument": 5,
  //     "total_pages": 5
  // }
  this.cdr.detectChanges();

  }

  async pagination(page_index:number, page_size:number){

    if(page_index > 0){

      let response = await fetch(`${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${page_index}&page_size=${page_size}`);

      let data = await response.json();

      this.shiftOperation = data;

    }
  }
  getValue(str:string){
      return str.replace('<u>','').replace('</u>','')
  }

  getStatusClass(name: string): string {
    console.log(name);
    switch (name) {
      case 'Thường':
        return 'status-green';
      case 'Khẩn':
        return 'status-red';
      case 'Hẹn giờ':
        return 'status-pink';
      case 'Hỏa tốc':
          return 'status-red';
      case 'Thượng khẩn':
            return 'status-red';
      default:
        return '';
    }
  }
}
