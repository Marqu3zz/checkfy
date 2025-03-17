import {Injectable, signal, WritableSignal} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    _visible: WritableSignal<boolean> = signal(false);
    _message: string = "";
    _loading: boolean = false;

    constructor(private router: Router) {
        // Router navigation loading
        this.router.events.subscribe(event => {
            if (!this._loading) {
                if (event instanceof NavigationStart) {
                    this._visible.set(true);
                } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                    this._visible.set(false);
                }
            }
        });
    }

    // Manual loading
    public visible(visible: boolean, message: string = "") {
        this._loading = visible;

        this._message = message;
        this._visible.set(visible);
    }
}
