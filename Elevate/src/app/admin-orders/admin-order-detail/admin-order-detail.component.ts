import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { OrderMappingService } from '../../services/mapping-services';
import { OrderService } from './../../services/order.service';
import { OrderVM } from './../../model/order.model';

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-detail.component.html',
  styleUrls: ['./admin-order-detail.component.scss']
})
export class AdminOrderDetailComponent implements OnInit {
  order: OrderVM | undefined;
  orderId: string = '';
  custom_properties: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private orderMappingService: OrderMappingService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.orderId = res.id;
        this.orderService.getOrderById({
          id: res.id,
          include: ['client,budget.client,budget.orders'],
        }).subscribe(budgetResponse => {
          if (budgetResponse.data) {
            this.order = this.orderMappingService.orderResponseToVM(budgetResponse.data);
            this.custom_properties = this.order.client?.custom_properties;
          }
        });
      }
    });
  }

}
