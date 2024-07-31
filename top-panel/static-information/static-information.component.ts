import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DutyRosterComponent } from '../../shared/duty-roster/duty-roster.component';
import { CombatReadinessComponent } from '../../shared/combat-readiness/combat-readiness.component';
import { OperationalCommandComponent } from '../../shared/operational-command/operational-command.component';
import { WeaponsStatusComponent } from '../../shared/weapons-status/weapons-status.component';
import { MilitaryStrengthComponent } from '../../shared/military-strength/military-strength.component';

@Component({
  selector: 'app-static-information',
  standalone: true,
  imports: [
    CommonModule,
    DutyRosterComponent,
    CombatReadinessComponent,
    OperationalCommandComponent,
    WeaponsStatusComponent,
    MilitaryStrengthComponent,
  ],
  templateUrl: './static-information.component.html',
  styleUrls: ['./static-information.component.scss'],
})
export class StaticInformationComponent {}
