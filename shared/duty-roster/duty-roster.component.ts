import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-duty-roster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duty-roster.component.html',
  styleUrls: ['./duty-roster.component.scss'],
})
export class DutyRosterComponent implements OnInit {
  public shiftInformation: any;


  constructor(
    private cdr: ChangeDetectorRef,

  ) {}
  async ngOnInit(): Promise<void> {
    // let response = await fetch('http://86.0.188.212:5000/api/QuanSo_LichTruc');

    let response = await fetch(`${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/QuanSo_LichTruc`);

    let data = await response.json();
    this.shiftInformation = data;


  //   this.shiftInformation = {
  //     CoMat: 907,
  //     LichTruc: [
  //       {
  //         Id_DonVi: '0035',
  //         TenDonVi: 'CQ BTL',
  //         TrucBanPho: 'Bình',
  //         TrucBanTruong: 'Tùng',
  //         TrucCH: '',
  //       },
  //       {
  //         Id_DonVi: '003510',
  //         TenDonVi: 'T1',
  //         TrucBanPho: 'Tùng',
  //         TrucBanTruong: 'Đức',
  //         TrucCH: 'Việt',
  //       },
  //       {
  //         Id_DonVi: '003511',
  //         TenDonVi: 'T2',
  //         TrucBanPho: 'Hưng',
  //         TrucBanTruong: 'Anh',
  //         TrucCH: 'Anh',
  //       },
  //       {
  //         Id_DonVi: '003512',
  //         TenDonVi: 'T3',
  //         TrucBanPho: 'Phan',
  //         TrucBanTruong: 'Hoàng',
  //         TrucCH: 'Duy',
  //       },
  //       {
  //         Id_DonVi: '003507',
  //         TenDonVi: 'V4',
  //         TrucBanPho: 'Huy',
  //         TrucBanTruong: 'Lệ',
  //         TrucCH: 'Dũng',
  //       },
  //       {
  //         Id_DonVi: '003509',
  //         TenDonVi: 'T6',
  //         TrucBanPho: '',
  //         TrucBanTruong: '',
  //         TrucCH: 'Cương',
  //       },
  //       {
  //         Id_DonVi: '003515',
  //         TenDonVi: 'T7',
  //         TrucBanPho: '',
  //         TrucBanTruong: '',
  //         TrucCH: 'Đoàn',
  //       },
  //     ],
  //     NgayBaoCao: '22/07/2024',
  //     QuanSo: 1045,
  //     TrucChiHuy: 'Đại tá Nguyễn Tiền Giang',
  //     Vang: 138,
  //   };
   }

   getLastWord(words:string):string {
    let str = words?.trim()?.split(' ');
    return str[str.length - 1] || '';

   }
}
