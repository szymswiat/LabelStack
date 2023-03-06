import { AgPromise } from 'ag-grid-community';
import { CustomFilter, CustomFilterParams } from './CustomFilter';
import { FilterEntry } from './FilterEntry';

const booleanRepresentation = {
  ['false']: 0,
  ['true']: 1
};

export class BooleanFilter extends CustomFilter {
  init?(params: CustomFilterParams): void | AgPromise<void> {
    const entries: FilterEntry[] = [
      {
        label: 'false',
        id: booleanRepresentation['false']
      },
      {
        label: 'true',
        id: booleanRepresentation['true']
      }
    ];

    const compareIdFn = (row: any, ids: number[]) => {
      if (row && ids.includes(booleanRepresentation[row[params.colDef.field]])) return true;
      return false;
    };

    const newParams = { ...params, entries: entries, compareIdFn: compareIdFn };

    super.init(newParams);
  }
}
