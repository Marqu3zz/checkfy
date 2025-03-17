import {Component} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {MatCard} from "@angular/material/card";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'loading',
    standalone: true,
    imports: [
        MatCard,
        MatProgressSpinner
    ],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent {
    constructor(public loadingService: LoadingService) {
    }
}
