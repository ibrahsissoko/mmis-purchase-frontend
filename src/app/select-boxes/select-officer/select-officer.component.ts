import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { OfficerService } from '../../purchase/share/officer.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-select-officer',
  templateUrl: './select-officer.component.html',
  styles: []
})
export class SelectOfficerComponent implements OnInit {

  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Input() public officerTypeId: any;

  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: any[] = [];

  constructor(private officeService: OfficerService, private alertService: AlertService) { }

  async ngOnInit() {
    await this.getItems();
  }

  async getItems() {
    try {
      this.loading = true;
      let rs: any = await this.officeService.findAll();
      this.loading = false;
      if (rs.ok) {
        this.items = _.filter(rs.rows, { 'type_id': +this.officerTypeId });
        if (this.items.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.items, { people_id: +this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              this.onChange.emit(this.items[0]);
            }
          } else {
            this.selectedId = this.items[0].people_id;
            this.onChange.emit(this.items[0]);
          }
        }

      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error()
    }
  }

  setSelected(event: any) {
    const idx = _.findIndex(this.items, { people_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.items[idx]);
    }
  }
}