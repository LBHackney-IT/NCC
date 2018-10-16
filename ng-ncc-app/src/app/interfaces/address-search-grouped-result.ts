import { ICitizenIndexSearchResult } from './citizen-index-search-result';

export interface IAddressSearchGroupedResult {
    id: string;
    address: string;
    results: ICitizenIndexSearchResult[];
}
