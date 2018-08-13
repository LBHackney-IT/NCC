export class NotifyTemplate {
    id: string;
    type: string;
    name: string;
    subject: string;
    body: string;
    version: number;

    constructor(id: string, type: string, name: string, subject: string, body: string, version: number = 1) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.subject = subject;
        this.body = body;
        this.version = version;
    }
};
