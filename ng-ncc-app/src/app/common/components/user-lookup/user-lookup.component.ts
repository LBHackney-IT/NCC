import { Component, EventEmitter, Output, Input, HostListener, ViewChild, ElementRef, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { IActiveDirectoryUserResult } from '../../interfaces/active-directory-user-result';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, finalize } from 'rxjs/operators';
import { NCCAPIService } from '../../API/NCCAPI/ncc-api.service';

@Component({
    selector: 'app-user-lookup',
    templateUrl: './user-lookup.component.html',
    styleUrls: ['./user-lookup.component.scss']
})
export class UserLookupComponent implements OnChanges {
    @Input() model: string;
    @Output() modelChange = new EventEmitter<string>();

    @Input() placeholder: string;
    @Input() disabled: boolean;

    @ViewChild('resultsList') resultsList: ElementRef;
    @ViewChild('.active') activeItem: ElementRef;

    protected minLength: number;
    protected debounceTime: number;
    protected focusIndex: number;
    protected selected: IActiveDirectoryUserResult;
    protected txtQueryChanged = new Subject<string>();

    isLoading: boolean;
    txtQuery: string; // bind this to input with ngModel
    userList: IActiveDirectoryUserResult[];

    constructor(private cdRef: ChangeDetectorRef, private NCCAPI: NCCAPIService) {

        this.focusIndex = 0;
        this.userList = [];
        this.debounceTime = 1000;
        this.minLength = 3;

        this.txtQueryChanged
            .pipe(
                debounceTime(this.debounceTime), // wait for this time after the last event before emitting.
                distinctUntilChanged()           // only emit if value is different from previous value.
            )
            .subscribe(() => {
                if (this.txtQuery && this.txtQuery.length >= this.minLength) {
                    this.updateList();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model) {
            this.txtQuery = changes.model.currentValue;
        }
    }

    /**
     * Hide the list of results.
     */
    @HostListener('document:click')
    hideResults() {
        // A small "debounce" is added here, to allow time for an item in the list to be selected.
        setTimeout(() => {
            this.userList = [];
        }, 50);
    }

    /**
     * Called when the value of the INPUT field changes.
     */
    onFieldChange(query: string) {
        this.selected = null;
        this.selectedOption(null);
        this.txtQueryChanged.next(query);
    }

    /**
     * Update the list of people.
     */
    updateList() {
        this.isLoading = true;
        this.NCCAPI.getUsersListFromActiveDirectory(this.txtQuery)
            .pipe(take(1))
            .pipe(finalize(() => { this.isLoading = false; }))
            .subscribe((list: IActiveDirectoryUserResult[]) => {
                list.sort((a: IActiveDirectoryUserResult, b: IActiveDirectoryUserResult) => {
                    const nameCmp = (a.name === b.name) ? 0 : (a.name > b.name) ? 1 : -1;
                    const emailCmp = (a.email === b.email) ? 0 : (a.email > b.email) ? 1 : -1;

                    return nameCmp ? nameCmp : emailCmp;
                })
                this.userList = list;
            });
    }

    /**
     * Focus on the previous item in the list.
     */
    prevItem() {
        if (this.userList.length) {
            this.focusIndex = Math.max(0, this.focusIndex - 1);
            this.scrollToActive(false);
        }
    }

    /**
     * Focus on the next item in the list.
     */
    nextItem() {
        if (this.userList.length) {
            this.focusIndex = Math.min(this.userList.length - 1, this.focusIndex + 1);
            this.scrollToActive(true);
        }
    }

    /**
     * Ensure the active item is visible within the list of results.
     */
    scrollToActive(downward: boolean) {
        this.cdRef.detectChanges();
        const resultListElement: HTMLElement = this.resultsList.nativeElement;
        const activeItemElement: HTMLElement = resultListElement.querySelector('.active');
        if (activeItemElement) {
            if (downward) {
                resultListElement.scrollTop = Math.max(
                    resultListElement.scrollTop,
                    activeItemElement.offsetTop - resultListElement.clientHeight
                );
            } else {
                resultListElement.scrollTop = Math.min(
                    resultListElement.scrollTop,
                    activeItemElement.offsetTop - activeItemElement.clientHeight
                );
            }
        }
    }

    /**
     * Use the currently active item.
     */
    selectItem() {
        const item = this.userList[this.focusIndex];
        if (item) {
            this.selectedOption(this.userList[this.focusIndex]);
        } else {
            this.selectedOption(this.selected);
        }
    }

    /**
     * Fires the model change event emitter.
     */
    selectedOption(option: IActiveDirectoryUserResult) {
        const newValue = option ? option.email : this.txtQuery;
        // i.e. if an option hasn't been selected, use whatever is in the text field.
        this.modelChange.emit(newValue);
        this.hideResults();
        this.txtQuery = newValue;   // display the result in the INPUT field.
        this.focusIndex = 0;
    }
}
