import { CitizenIndexSearchResult } from './citizen-index-search-result.interface';

export interface AddressSearchGroupedResult {
    id: string;
    address: string;
    results: CitizenIndexSearchResult[];
}
