import { CitizenIndexSearchResult } from './citizen-index-search-result.interface';

export interface IAddressSearchGroupedResult {
    id: string;
    address: string;
    results: CitizenIndexSearchResult[];
}
