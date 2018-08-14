export class CommsTemplate {
    id: string;
    subject: string;
    body: string;
    version: number;

    constructor(id: string, subject: string, body: string, version: number) {
        this.id = id;
        this.subject = subject;
        this.body = body;
        this.version = version;
    }

}
