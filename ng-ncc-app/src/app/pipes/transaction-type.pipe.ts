import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transactionType',
    pure: false
})
export class TransactionTypePipe implements PipeTransform {

    transform(items: { type: string }[], args?: any): any {
        if (items && args && args.type) {
            return items.filter(item => -1 !== item.type.indexOf(args.type));
        }
        return items;
    }

}
