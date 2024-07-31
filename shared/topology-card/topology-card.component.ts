import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConnectorConstraints,
  ConnectorModel,
  DataBindingService,
  Diagram,
  DiagramComponent,
  DiagramModule,
  DiagramTools,
  DiagramTooltipModel,
  HierarchicalTreeService,
  NodeConstraints,
  NodeModel,
  SelectorModel,
  SnapConstraints,
  SnapSettingsModel,
  UserHandleModel,
} from '@syncfusion/ej2-angular-diagrams';
import { Constant } from '../../../../../core/config/constant';
import {
  FieldSettingsModel,
  SelectEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { UnitModel } from '../../../../unit/models/unit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NetworkDeviceService } from '../../../../device/services/network-device.service';
import { UtilsService } from '../../../../../core/services/utils.service';
import { Subscription } from 'rxjs';
import { MainStatisticalViewComponent } from '../../../../topology/components/main-statistical-view/main-statistical-view.component';
import { IDevice } from '../../../../device/models/device.model';
import { DetailNetworkDeviceTopologyComponent } from '../../../../topology/components/detail-network-device-topology/detail-network-device-topology.component';
import { ResultAPIModel } from '../../../../../core/models/api-response.model';
import { ConnectorDetailComponent } from '../../../../topology/components/diagram-topology/connector-detail/connector-detail.component';
import { PrtgAlertWidgetComponent } from '../../../../../shared/statistical-modal/prtg-alert-widget/prtg-alert-widget.component';
import {
  ConnectorTopology,
  NodeTopology,
  TopologyData,
} from '../../../models/btth.interface';

@Component({
  selector: 'app-topology-card',
  standalone: true,
  imports: [CommonModule, DiagramModule, PrtgAlertWidgetComponent],
  providers: [HierarchicalTreeService, DataBindingService],
  templateUrl: './topology-card.component.html',
  styleUrls: ['./topology-card.component.scss'],
})
export class TopologyCardComponent implements OnInit, OnDestroy {
  @ViewChild('diagram')
  public diagram: DiagramComponent;

  get topologyData(): TopologyData {
    return this._topologyData;
  }

  @Input() set topologyData(value: TopologyData) {
    this._topologyData = value;
    this.nodes = this.topologyData.nodes;
    this.connectors = this.topologyData.connectors;
    console.log(value);
    this.cdr.markForCheck();
  }

  private _topologyData: TopologyData;

  // @Input()
  // set topologyData(topologyModels: TopologyModel | null) {
  //   if (
  //     !topologyModels ||
  //     !topologyModels?.nodes ||
  //     !topologyModels?.links ||
  //     topologyModels.nodes.length === 0
  //   ) {
  //     if (this.diagram) this.diagram.clear();
  //     return;
  //   }
  //
  //   this.nodes = topologyModels.nodes.map((item) => {
  //     if (
  //       item.deviceType.toUpperCase() === Constant.TYPE_DEVICE.POS &&
  //       item.isChildUnitExist
  //     ) {
  //       return {
  //         ...item,
  //         style: {
  //           strokeWidth: 0,
  //         },
  //         tooltip: {
  //           content: item.isRouterRoot ? item.name : item.unitName,
  //           position: 'BottomRight',
  //           relativeMode: 'Object',
  //         },
  //         height: 50,
  //         width: 50,
  //         shape: {
  //           type: 'Image',
  //           source: this.utils.getUnitIconById(item.iconId),
  //         },
  //       };
  //     }
  //     return item;
  //   });
  //   this.createAndAddAlertClassForRouterBCTT();
  //
  //   this.connectors = topologyModels?.links;
  //   this.cdr.markForCheck();
  //   setTimeout(() => {
  //     this.fitToPage();
  //   }, 25);
  //   // this._changeDetectorRef.markForCheck();
  // }
  //
  // get topologyData(): TopologyModel {
  //   return this._topologyData;
  // }
  // private _topologyData: TopologyModel;

  nodes: NodeTopology[];
  connectors: ConnectorTopology[];

  @Input() nodeSearch: any[] = [];

  fields: FieldSettingsModel = { text: 'name', value: 'id' };

  snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None,
    // SnapConstraints.ShowHorizontalLines | SnapConstraints.ShowVerticalLines,
  };
  tool: DiagramTools = DiagramTools.ZoomPan | DiagramTools.SingleSelect;

  isLoading: boolean = true;
  units: UnitModel[] = [];

  handle: UserHandleModel[] = [
    {
      name: Constant.DIAGRAM_TOPOLOGY.NAME.STATISTICAL,
      visible: true,
      backgroundColor: Constant.DIAGRAM_TOPOLOGY.BACKGROUND_COLOR,
      side: 'Left',
      pathColor: Constant.DIAGRAM_TOPOLOGY.PATH_COLOR,
      pathData: Constant.DIAGRAM_TOPOLOGY.PATH_DATA.STATISTICAL,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    {
      name: Constant.DIAGRAM_TOPOLOGY.NAME.DETAIL,
      backgroundColor: Constant.DIAGRAM_TOPOLOGY.BACKGROUND_COLOR,
      pathColor: Constant.DIAGRAM_TOPOLOGY.PATH_COLOR,
      pathData: Constant.DIAGRAM_TOPOLOGY.PATH_DATA.DETAIL,
      side: 'Right',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
  ];

  private modal: NgbModal = inject(NgbModal);
  private networkDeviceService: NetworkDeviceService =
    inject(NetworkDeviceService);
  private utils: UtilsService = inject(UtilsService);
  private cdr = inject(ChangeDetectorRef);
  private subscription$: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.diagram) this.diagram.destroy;
    if (this.subscription$) this.subscription$.unsubscribe();
  }

  fitToPage() {
    if (this.diagram)
      this.diagram.fitToPage({
        mode: 'Page',
        region: 'Content',
        canZoomIn: true,
      });
  }

  hasTopologyData(): boolean {
    return (
      this.nodes &&
      this.nodes.length > 0 &&
      this.connectors &&
      this.connectors.length > 0
    );
  }

  // isNode(
  //   element: NodeModel | ConnectorModel | SelectorModel | Diagram,
  // ): element is NodeModel {
  //   return (element as NodeTopology)?.nodeUUID !== undefined;
  // }

  public handleWhenDiagramCreate(): void {
    this.fitToPage();
  }

  public tooltip: DiagramTooltipModel = {
    position: 'TopCenter',
    animation: {
      open: { effect: 'FadeZoomIn', delay: 0 },
      close: { effect: 'FadeZoomOut', delay: 0 },
    },
  };

  public getContent(contentDefault: string): HTMLElement {
    let tooltipContent: HTMLElement = document.createElement('div');
    tooltipContent.innerHTML = `<div style="background-color: #f4f4f4; color: black; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;">
        <span class="m-10">
          ${contentDefault}
        </span>
      </div>`;
    return tooltipContent;
  }

  // private setTooltip(connector: ConnectorTopology): ConnectorTopology {
  //   connector.tooltip = {
  //     content: this.convertTableTooltip(connector),
  //     position: 'TopCenter',
  //     animation: {
  //       open: { effect: 'FadeZoomIn', delay: 0 },
  //       close: { effect: 'FadeZoomOut', delay: 0 },
  //     },
  //     width: '65em',
  //   };
  //   return connector;
  // }

  // private convertTableTooltip(connector: ConnectorTopology): HTMLElement {
  //   let tooltipContent: HTMLElement = document.createElement('div');
  //   let table = document.createElement('table');
  //   table.setAttribute('class', 'table text-white fs-4');
  //   let thead = document.createElement('thead');
  //   thead.innerHTML = `
  //     <tr>
  //       <th class="col"></th>
  //       <th class="col">${connector.sourceDeviceName}</th>
  //       <th class="col">${connector.targetDeviceName}</th>
  //     </tr>
  //   `;
  //
  //   let tbody = document.createElement('tbody');
  //
  //   const bandwidth = this.convertToBandwidth(
  //     connector.trafficOutVolume,
  //     connector.trafficOutSpeed,
  //     connector.lastScan,
  //   );
  //   let bandwidthRow = document.createElement('tr');
  //   bandwidthRow.innerHTML = `
  //     <tr >
  //       <th scope="row">
  //         Băng thông
  //       </th>
  //       <td [colSpan]="2" class="text-center">
  //         ${bandwidth}
  //       </td>
  //     </tr>
  //   `;
  //
  //   let portRow = document.createElement('tr');
  //   portRow.innerHTML = `
  //     <tr>
  //       <th scope="row">
  //         Cổng
  //       </th>
  //       <td>
  //         ${connector.sourcePort}
  //       </td>
  //       <td>
  //         ${connector.targetPort}
  //       </td>
  //     </tr>
  //   `;
  //
  //   let ipRow = document.createElement('tr');
  //   ipRow.innerHTML = `
  //     <tr>
  //       <th scope="row">
  //         Địa chỉ IP
  //       </th>
  //       <td>
  //         ${connector.sourceIP || ''}
  //       </td>
  //       <td>
  //         ${connector.targetIP || ''}
  //       </td>
  //     </tr>
  //   `;
  //
  //   table.appendChild(thead);
  //   if (bandwidth) tbody.appendChild(bandwidthRow);
  //   tbody.appendChild(portRow);
  //   tbody.appendChild(ipRow);
  //   table.appendChild(tbody);
  //   tooltipContent.appendChild(table);
  //
  //   return tooltipContent;
  // }

  // private convertToBandwidth(
  //   trafficOutVolume: string,
  //   trafficOutSpeed: string,
  //   lastScan: string,
  // ): string {
  //   return !!trafficOutVolume && !!trafficOutSpeed && !!lastScan
  //     ? `Bandwidth: ${trafficOutVolume}, ${trafficOutSpeed} (${lastScan})`
  //     : '';
  // }

  public getNodeDefaults(node: any): any {
    // if (node && node.style) {
    //   node.style.strokeColor = node.status ? '#5C90DF' : 'red';
    //   node.style.fill = 'transparent';
    // }

    node.offsetX = node.coor.x ?? 0;
    node.offsetY = node.coor.y ?? 0;

    // node.ports = [
    //   {
    //     id: `port-${node.id}`,
    //     offset: node.isChildUnitExist ? { x: 1, y: 1 } : { x: 0.5, y: 0.5 },
    //     visibility: PortVisibility.Hidden,
    //     shape: 'Circle',
    //   },
    // ];

    node.annotations = [{ content: '', offset: { x: 0.5, y: 1.5 } }];

    if (node.annotations.length !== 0) {
      node.constraints = node.constraints & ~NodeConstraints.Tooltip;
      node.annotations[0].content = node.name || '';
      node.annotations[0].style.color = 'black';
      node.annotations[0].style.fontSize = 12;
      node.annotations[0].style = {
        textWrapping: 'NoWrap',
      };
    }

    node.constraints =
      NodeConstraints.InConnect |
      // NodeConstraints.Select |
      NodeConstraints.OutConnect |
      NodeConstraints.ReadOnly |
      NodeConstraints.PointerEvents |
      NodeConstraints.Tooltip;

    node.width = 40;
    node.height = 40;

    switch (node.type) {
      case Constant.TYPE_DEVICE.ROUTER:
        const category =
          node.category === Constant.CATEGORY_ROUTER.BCTT ? 'BCTT' : 'Cơ yếu';
        node.annotations[0].content = category;
        let routerSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.ROUTER;
        // if (node.hasFmsAlert && (node.hasPrtgAlert || !node.status)) {
        //   routerSvgAlert = routerSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS,
        //   );
        //   node.shape = { type: 'Native', content: routerAlert };
        // } else if (node.hasPrtgAlert || !node.status) {
        //   routerSvgAlert = routerSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
        //   );
        // } else if (node.hasFmsAlert) {
        //   routerSvgAlert = routerSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS,
        //   );
        //   node.shape = { type: 'Native', content: routerSvgAlert };
        // }
        node.shape = { type: 'Native', content: routerSvgAlert };
        break;

      case Constant.TYPE_DEVICE.FIREWALL:
        let firewallSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.FIREWALL;
        // if (!node.status) {
        //   firewallSvgAlert = firewallSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
        //   );
        // }
        node.shape = { type: 'Native', content: firewallSvgAlert };
        break;

      case Constant.TYPE_DEVICE.SWITCH:
        let switchSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.SWITCH;
        // if (node.hasFmsAlert && !node.status) {
        //   switchSvgAlert = switchSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS,
        //   );
        //   node.shape = { type: 'Native', content: routerAlert };
        // } else if (!node.status) {
        //   switchSvgAlert = switchSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
        //   );
        // } else if (node.hasFmsAlert) {
        //   switchSvgAlert = switchSvgAlert.replace(
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
        //     Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS,
        //   );
        // }
        node.shape = { type: 'Native', content: switchSvgAlert };
        break;
      default:
        break;
    }

    return node;
  }

  public getConnectorDefaults(connector: any): any {
    connector.targetDecorator = {
      shape: 'None',
    };

    // connector.sourcePortID = `port-${connector.sourceID}`;
    // connector.targetPortID = `port-${connector.targetID}`;

    // connector.constraints =
    //   ConnectorConstraints.ReadOnly |
    //   ConnectorConstraints.Select |
    //   ConnectorConstraints.PointerEvents;
    connector.constraints = ConnectorConstraints.None;
    if (connector.style) connector.style.strokeColor = '#5C90DF';
    if (
      connector.annotations &&
      connector.annotations.length !== 0 &&
      connector.annotations[0].style
    ) {
      connector.annotations[0].style.fill = 'white';
    }
    return connector;
  }

  // public selectedItems: SelectorModel = {
  //   constraints: SelectorConstraints.UserHandle,
  //   userHandles: this.handle,
  // };

  // hide the requirement user handle.
  public hideUserHandle(name: string): void {
    if (
      this.diagram &&
      this.diagram.selectedItems &&
      this.diagram.selectedItems.userHandles
    )
      for (let handle of this.diagram.selectedItems.userHandles) {
        if (handle.name === name) {
          handle.visible = false;
        }
      }
  }

  // public getCustomTool: Function = this.getTool.bind(this);
  // public getTool(action: string): ToolBase {
  //   let tool: any;
  //   if (action === Constant.DIAGRAM_TOPOLOGY.NAME.STATISTICAL) {
  //     let statisticalTool: StatisticalTool = new StatisticalTool(
  //       this.diagram.commandHandler,
  //       this.modal,
  //     );
  //     statisticalTool.diagram = this.diagram;
  //     return statisticalTool;
  //   } else if (action === Constant.DIAGRAM_TOPOLOGY.NAME.DETAIL) {
  //     let detailTool: DetailTool = new DetailTool(
  //       this.diagram.commandHandler,
  //       this.utils,
  //     );
  //     detailTool.diagram = this.diagram;
  //     return detailTool;
  //   }
  //   return tool;
  // }

  public openStatisticalView(unitId: string) {
    const modalStatistical = this.modal.open(MainStatisticalViewComponent, {
      windowClass: 'custom-modal',
    });
    modalStatistical.componentInstance._unitId = unitId;
  }

  private openModalNetworkDevice(device: IDevice): void {
    const deviceModal = this.modal.open(DetailNetworkDeviceTopologyComponent, {
      size: 'xl',
      // centered: true
    });

    deviceModal.componentInstance.device = device;
  }

  private getNetworkDeviceByDeviceId(deviceId: string): void {
    this.subscription$ = this.networkDeviceService
      .getDetail(deviceId)
      .subscribe((res: ResultAPIModel) => {
        const device: IDevice = res.data;
        this.openModalNetworkDevice(device);
      });
  }

  // public viewConnector(connector: ConnectorTopology) {
  //   const connectorModal = this.modal.open(ConnectorDetailComponent, {
  //     size: 'lg',
  //     centered: true,
  //   });
  //   connectorModal.componentInstance.connector = connector;
  // }
  //
  // private createAndAddAlertClassForRouterBCTT(): void {
  //   setTimeout(() => {
  //     this.nodes.forEach((node) => {
  //       this._createCircleAlertForRouterBCTT(node);
  //       this.addAlertClassForRouterBCTT(node);
  //     });
  //   }, 200);
  // }
  //
  // private _createCircleAlertForRouterBCTT(node: NodeTopology): void {
  //   if (!node.isChildUnitExist || node.deviceType !== Constant.TYPE_DEVICE.POS)
  //     return;
  //
  //   const group: SVGElement = document.getElementById(
  //     `${node.id}_content_groupElement`,
  //   ) as unknown as SVGElement;
  //   if (!group) return;
  //
  //   group.setAttribute('class', Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.GROUP);
  //
  //   const contentGroup: SVGRectElement = document.getElementById(
  //     `${node.id}_content`,
  //   ) as unknown as SVGRectElement;
  //   if (!contentGroup) return;
  //
  //   const groupX = contentGroup.x.baseVal.value;
  //   const groupY = contentGroup.y.baseVal.value;
  //   const groupWidth = contentGroup.width.baseVal.value;
  //   const groupHeight = contentGroup.height.baseVal.value;
  //   const circleRadius = 10;
  //   const circleId = `${Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRE_FIX_CIRCLE}${node.id}`;
  //
  //   // Check if a 'blinkingCircle' already exists within the group
  //   const existingBlinkingCircle = group.querySelector(`#${circleId}`);
  //   // Create a new <circle> element
  //   if (!existingBlinkingCircle) {
  //     // Calculate the coordinates for the blinking circle
  //     const middleX = groupX + groupWidth;
  //     const bottomY = groupY + groupHeight;
  //
  //     // Create a new <circle> element
  //     const blinkingCircle = document.createElementNS(
  //       'http://www.w3.org/2000/svg',
  //       'circle',
  //     );
  //
  //     // Set attributes for the blinking circle
  //     blinkingCircle.setAttribute('id', circleId);
  //     blinkingCircle.setAttribute('cx', middleX.toString());
  //     blinkingCircle.setAttribute('cy', bottomY.toString());
  //     blinkingCircle.setAttribute('r', circleRadius.toString());
  //     blinkingCircle.setAttribute('fill', 'none');
  //
  //     // Add the blinking circle to the <g> element
  //     group.appendChild(blinkingCircle);
  //   }
  // }
  //
  // private addAlertClassForRouterBCTT(node: NodeTopology): void {
  //   if (
  //     !node.isChildUnitExist ||
  //     node.deviceType !== Constant.TYPE_DEVICE.POS
  //   ) {
  //     return;
  //   }
  //
  //   const circleId = `${Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRE_FIX_CIRCLE}${node.id}`;
  //   const circle: SVGCircleElement = document.getElementById(
  //     circleId,
  //   ) as unknown as SVGCircleElement;
  //
  //   if (!circle) {
  //     return;
  //   }
  //
  //   const alertClasses = {
  //     PRTG_FMS: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS,
  //     PRTG_FMC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMC,
  //     PRTG_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_NAC,
  //     PRTG: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
  //     FMS: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS,
  //     FMC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMC,
  //     NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.NAC,
  //     FMS_FMC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS_FMC,
  //     FMS_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS_NAC,
  //     FMC_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMC_NAC,
  //     PRTG_FMS_FMC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS_FMC,
  //     PRTG_FMS_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS_NAC,
  //     PRTG_FMC_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMC_NAC,
  //     FMS_FMC_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS_FMC_NAC,
  //     PRTG_FMS_FMC_NAC: Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS_FMC_NAC,
  //   };
  //
  //   const alertClass = this.getAlertClass(node, alertClasses);
  //   circle.setAttribute('class', alertClass);
  // }
  //
  // private getAlertClass(
  //   node: NodeTopology,
  //   alertClasses: Record<string, string>,
  // ): string {
  //   if (
  //     (node.hasPrtgAlert || !node.status) &&
  //     node.hasFmsAlert &&
  //     node.hasFmcAlert &&
  //     node.hasNacAlert
  //   ) {
  //     return alertClasses.PRTG_FMS_FMC_NAC;
  //   }
  //
  //   if (node.hasFmsAlert && node.hasFmcAlert && node.hasNacAlert) {
  //     return alertClasses.FMS_FMC_NAC;
  //   }
  //
  //   if (
  //     (node.hasPrtgAlert || !node.status) &&
  //     node.hasFmsAlert &&
  //     node.hasNacAlert
  //   ) {
  //     return alertClasses.PRTG_FMS_NAC;
  //   }
  //
  //   if (
  //     (node.hasPrtgAlert || !node.status) &&
  //     node.hasFmcAlert &&
  //     node.hasNacAlert
  //   ) {
  //     return alertClasses.PRTG_FMC_NAC;
  //   }
  //
  //   if (
  //     (node.hasPrtgAlert || !node.status) &&
  //     node.hasFmsAlert &&
  //     node.hasFmcAlert
  //   ) {
  //     return alertClasses.PRTG_FMS_FMC;
  //   }
  //
  //   if ((node.hasPrtgAlert || !node.status) && node.hasFmsAlert) {
  //     return alertClasses.PRTG_FMS;
  //   }
  //
  //   if ((node.hasPrtgAlert || !node.status) && node.hasFmcAlert) {
  //     return alertClasses.PRTG_FMC;
  //   }
  //
  //   if ((node.hasPrtgAlert || !node.status) && node.hasNacAlert) {
  //     return alertClasses.PRTG_NAC;
  //   }
  //
  //   if (node.hasFmsAlert && node.hasFmcAlert) {
  //     return alertClasses.FMS_FMC;
  //   }
  //
  //   if (node.hasFmsAlert && node.hasNacAlert) {
  //     return alertClasses.FMS_NAC;
  //   }
  //
  //   if (node.hasFmcAlert && node.hasNacAlert) {
  //     return alertClasses.FMC_NAC;
  //   }
  //
  //   if (node.hasPrtgAlert || !node.status) {
  //     return alertClasses.PRTG;
  //   }
  //
  //   if (node.hasFmsAlert) {
  //     return alertClasses.FMS;
  //   }
  //
  //   if (node.hasFmcAlert) {
  //     return alertClasses.FMC;
  //   }
  //
  //   if (node.hasNacAlert) {
  //     return alertClasses.NAC;
  //   }
  //
  //   return '';
  // }
  //
  // findNode(args: SelectEventArgs) {
  //   if (this.diagram) {
  //     const node = args.itemData as NodeTopology;
  //     const nodeInDiagram = this.diagram.nodes.find(
  //       (item) => item.id === node.id,
  //     );
  //     if (!nodeInDiagram) return;
  //     this.diagram.select([nodeInDiagram]);
  //   }
  // }
}
