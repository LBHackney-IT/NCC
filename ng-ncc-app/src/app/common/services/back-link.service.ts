import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BackLinkService {

    target: string;
    visible: boolean;

    constructor(private router: Router) { }

    /**
     * Set the target of the back link (i.e. where it will take the user).
     */
    setTarget(new_target: string) {
        this.target = new_target;
    }

    /**
     * Make the back link visible.
     */
    enable() {
        this.visible = true;
    }

    /**
     * Make the back link invisible.
     */
    disable() {
        this.visible = false;
    }

    /**
     * Navigate to the back link's specified target.
     */
    navigate() {
        this.router.navigateByUrl(this.target);
    }

}
