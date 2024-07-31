import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-weapons-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons-status.component.html',
  styleUrls: ['./weapons-status.component.scss']
})
export class WeaponsStatusComponent implements OnInit {

  public weaponList: any = [];

  constructor(
    private readonly supabase: SupabaseService,
    private cdr: ChangeDetectorRef,

  ) {}

  async ngOnInit(): Promise<void> {
    this.weaponList = await this.supabase.getVuKhiTrangBi(null,0,0);
    this.cdr.detectChanges();

  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động bình thường':
        return 'badge-success';
      case 'Có sự cố':
        return 'badge-danger';
      case 'Nâng cấp, bảo trì':
        return 'badge-warning';
      default:
        return '';
    }
  }
}
