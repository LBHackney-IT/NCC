import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.css']
})
export class PagePlaygroundComponent implements OnInit {

    show: boolean;
    constructor() { }

    ngOnInit() {
        this.show = false;
    }

    openModal() {
        this.show = true;
    }

    handleClose() {
        console.log('Modal was closed.');
    }

    selectedTemplate(option: any) {
        console.log(option.name, option.isSensitive());
    }

    beginPayment() {
        const return_data = [
            'CAS-775515-M9F2QZ',
            '3cb039e7-f421-e811-a4ef-005056986-64',
            '10.00'
        ];
        const return_url = `${window.location.origin}/payment.html?${return_data.join('$')}`;

        const parameters = {
            returnurl: return_url,
            payforbasketmode: true,
            returntext: encodeURIComponent('Back to Something'),
            ignoreconfirmation: true,
            data: encodeURIComponent('Keep this and return it at the end'),
            recordxml: '<records><record><reference>006884</reference><fund>02</fund><amount>10.00</amount><text></text></record></records>'
        };

        const url = `https://hackney.paris-epayments.co.uk/paymentstest/sales/launchinternet.aspx?${this._buildQueryString(parameters)}`;
        console.log(this._buildQueryString(parameters));
        console.log(url);

        window.location.href = url;

        /*
        https://hackney.paris-epayments.co.uk/paymentstest/sales/launchinternet.aspx
            ?returnurl=http://lbhcrmappd01:802/Licensing/Thankyou.aspx?NCCData=CAS-775515-M9F2QZ$3cb039e7-f421-e811-a4ef-005056986-64$10.00
            &payforbasketmode=true
            &returntext=Back to Something
            &ignoreconfirmation=true
            &data=Keep this and return it at the end
            &recordxml=<records><record><reference>006884</reference><fund>02</fund><amount>10.00</amount><text></text></record></records>
        */
    }

    private _buildQueryString(parameters: { [propKey: string]: any }): string {
        const output = Object.keys(parameters).map((key) => -1 === [undefined, null].indexOf(parameters[key]) ?
            `${key}=${parameters[key].toString()}` : null);
        return output.join('&');
    }
}
