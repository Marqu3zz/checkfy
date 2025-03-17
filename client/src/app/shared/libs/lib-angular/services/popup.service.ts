import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DialogButtons, DialogComponent, DialogIcon} from "../components/dialog/dialog.component";
import {firstValueFrom} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class PopupService {

    constructor(
        private snackbar: MatSnackBar,
        private dialog: MatDialog) {
    }

    openSnackBar(message: string, options?: { type?: SnackBarType, duration?: number }) {
        const configs: { [key: string]: MatSnackBarConfig } = {
            success: {
                panelClass: ["snackBarSuccess"],
                duration: 4000,
            },
            info: {
                panelClass: ["snackBarInfo"],
                duration: 5000,
            },
            error: {
                panelClass: ["snackBarError"],
                duration: 6000,
            }
        };

        if (message) {
            let config: MatSnackBarConfig = configs[options?.type || "info"];

            if (options?.duration) {
                config.duration = options?.duration;
            }

            this.snackbar.open(message, "✖", config || {
                duration: 3000
            });
        }
    }

    async openDialog(title: string, content: string, options?: {
        buttons?: DialogButtons,
        icon?: DialogIcon
    }): Promise<boolean> {
        if (!options) {
            options = {
                buttons: "ok"
            }
        }

        if (!options.buttons) {
            options.buttons = "ok";
        }

        let dialogRef = this.dialog.open(DialogComponent, {
            maxHeight: "90vh",
            disableClose: false
        });

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.content = content;
        dialogRef.componentInstance.buttons = options.buttons;
        dialogRef.componentInstance.icon = options.icon;

        return firstValueFrom(dialogRef.afterClosed());
    }
}

type SnackBarType = "success" | "error" | "warning" | "info";
