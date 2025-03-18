import {Component} from '@angular/core';
import {TableComponent} from '../../../shared/libs/lib-angular/components/table/table.component';
import {IColumn} from '../../../shared/libs/lib-angular/interfaces/table.interface';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {UserService} from '../../../shared/services/user.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatInput} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {Router} from '@angular/router';
import {ActiveComponent} from '../../../shared/components/user-list-table/active/active.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        TableComponent,
        MatIcon,
        MatMiniFabButton,
        MatTooltip,
        MatInput,
        MatCard
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent {
    columns: IColumn[] = [
        {
            key: "id",
            title: "Id",
        },
        {
            key: "name",
            title: "Nome",
        },
        {
            key: "email",
            title: "E-mail",
        },
        {
            key: "permission",
            title: "Permissão",
        },
        {
            key: "active",
            title: "Ativo",
            component: ActiveComponent
        }
    ];

    data: any[] = [];
    filteredData: any[] = [];

    constructor(private userService: UserService,
                private router: Router) {
        this.userService.users$.subscribe((data) => {
            this.data = data;
            this.filteredData = this.data;
        });

        this.userService.get();
    }

    async add() {
        await this.router.navigate(['/admin/users', 'new']);
    }

    async edit(userId: string) {
        await this.router.navigate(['/admin/users', userId]);
    }

    filter(event: Event) {
        const input = event.target as HTMLInputElement;
        const filter = input.value;
        this.filteredData = this.data.filter(item =>
            this.normalizeStr(JSON.stringify(item).toLowerCase()).includes(this.normalizeStr(filter.toLowerCase()))
        );
    }

    normalizeStr(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
