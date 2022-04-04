import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AccountApi } from '../../../../api';
import { Order } from '../../../../interfaces/order';
import { UrlService } from '../../../../services/url.service';

export interface PageOrderSuccessParams {
    orderToken: string;
}

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss'],
})
export class PageOrderSuccessComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    order!: Order;

    constructor(
        private route: ActivatedRoute,
        private accountApi: AccountApi,
        public url: UrlService,
    ) { }

    ngOnInit(): void {
        const params$ = this.route.params as Observable<PageOrderSuccessParams>;

        params$.pipe(
            map((params: PageOrderSuccessParams) => params.orderToken || (this.route.snapshot.data['orderToken'] as string)),
            switchMap(orderToken => this.accountApi.getOrderByToken(orderToken)),
            takeUntil(this.destroy$),
        ).subscribe(order => this.order = order);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
