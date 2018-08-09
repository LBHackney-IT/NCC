export class CommsSelection {
    form: string;
    method: string;

    constructor(form: string = null, method: string = null) {
        this.form = form;
        this.method = method;
    }

    /**
     * Returns true if this comm[unication]s selection is "complete".
     * (i.e. if we have a form and a method of communication selected.)
     */
    isComplete(): boolean {
        return !(null === this.form || null === this.method);
    }
};
