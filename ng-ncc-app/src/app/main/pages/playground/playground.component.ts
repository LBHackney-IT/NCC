import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { PAGES } from '../../../common/constants/pages.constant';
import { NOTES } from '../../../common/constants/notes.constant';
import { IAccountDetails } from '../../../common/interfaces/account-details';
import { PageTitleService } from '../../../common/services/page-title.service';
import { AccountService } from '../../../common/services/account.service';
import { AnonymousCaller } from '../../../common/classes/anonymous-caller.class';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.css']
})
export class PagePlaygroundComponent implements OnInit {

    private _w: Window;

    noteTypes = NOTES;

    account: IAccountDetails = {
        propertyReferenceNumber: '00013513',
        benefit: 118.75,
        tagReferenceNumber: '000015/01',
        paymentReferenceNumber: '1003001502',
        accountid: 'e3d050d8-169f-e711-8100-70106faa4841',
        currentBalance: 760.19,
        rent: 129.98,
        housingReferenceNumber: '000015',
        directdebit: null,
        tenancyStartDate: '1970-07-06',
        agreementType: 'M',
        isAgreementTerminated: false,
        tenuretype: 'Secure',
        accountType: '1'
    };
    show: boolean;
    amount = 10;
    number_value: string;
    taList = [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
    ];
    taValue: string;
    user = new AnonymousCaller;
    data: IAccountDetails;

    // Listen to the window's storage event.
    // This is fired whenever a localStorage property (it has access to?) is *changed*.
    @HostListener('window:storage', ['$event'])
    onLocalstorageUpdate(e) {
        if ('ncc-payment' === e.key) {
            const response = e.newValue;
            // console.log('Paris response query:', response);

            // Remove the item.
            localStorage.removeItem('ncc-payment');

            // Close the window we opened below.
            this._w.close();

            // Go to the transaction (completed) page, passing the returned information.
            this.router.navigateByUrl(`${PAGES.TRANSACTION.route}/${response}`);
        }
    }

    constructor(private Account: AccountService, private router: Router, private PageTitle: PageTitleService) { }

    /**
     *
     */
    ngOnInit() {
        this.PageTitle.set(PAGES.PLAYGROUND.label);
        this.show = false;

        this.Account.getFor(this.user)
            .pipe(take(1))
            .subscribe((account: IAccountDetails) => {
                this.account = account;
            });
    }

    /**
     *
     */
    openModal() {
        this.show = true;
    }

    /**
     *
     */
    handleClose() {
        // console.log('Modal was closed.');
    }

    /**
     *
     */
    selectedTemplate(option: any) {
        if (option) {
            // console.log(option.name, option.isSensitive());
        }
    }

    /**
     *
     */
    beginPayment() {
        const return_data = [
            '327F0B75-11D9-E811-A96E-002248072CC3', // Interaction ID (obtained from a note).
            'sshetty',  // An agent's username.
            this.amount // The amount to pay (which can't be changed once we go to Paris).
        ];
        const return_url = `${window.location.origin}/payment.html?${return_data.join('$')}`;
        // The URL Paris will navigate to once the payment is made.

        const parameters = {
            returnurl: return_url,
            payforbasketmode: true,
            returntext: encodeURIComponent('Back to Something'),
            ignoreconfirmation: true,
            data: encodeURIComponent('Keep this and return it at the end'),
            recordxml: '<records><record><reference>006884</reference><fund>02</fund><amount>' + this.amount +
                '</amount><text></text></record></records>'
        };

        const url = `https://hackney.paris-epayments.co.uk/paymentstest/sales/launchinternet.aspx?${this._buildQueryString(parameters)}`;

        // The huge concern was that redirecting the browser window to Paris would mean losing the current Call, and that we would have to
        // rebuild the call once we return to the app.

        // Paris doesn't like IFRAMES: placing the site within a conditionally visible IFRAME appeared to work, until it redirected to the
        // return_url specified above. It will target the topmost window for redirection, resulting in moving away from the app anyway.

        // HOWEVER we can counteract this behaviour by opening Paris in a new browser window/tab. The return_url (to payment.html) will
        // then communicate with the app using localStorage, meaning we don't have to revuild the current Call.

        this._w = window.open(url, 'NCCPayment');

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

    /**
     *
     */
    private _buildQueryString(parameters: { [propKey: string]: any }): string {
        const output = Object.keys(parameters).map((key) => -1 === [undefined, null].indexOf(parameters[key]) ?
            `${key}=${parameters[key].toString()}` : null);
        return output.join('&');
    }

    selectedTypeahead(result: string) {
        this.taValue = result;
    }
}
