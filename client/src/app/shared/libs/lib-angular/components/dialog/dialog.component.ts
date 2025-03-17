import {Component} from "@angular/core";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: "limber-dialog",
    standalone: true,
    imports: [
        MatDialogTitle,
        MatIconModule,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule
    ],
    templateUrl: "./dialog.component.html",
    styleUrl: "./dialog.component.scss"
})
export class DialogComponent {
    title: string;
    content: string;
    icon: DialogIcon;
    buttons: DialogButtons;

    constructor(public dialogRef: MatDialogRef<DialogComponent>) {
    }
}

export type DialogIcon = "help" | "error" | "warning" | "info";
export type DialogButtons = "ok" | "okCancel" | "yesNo";
