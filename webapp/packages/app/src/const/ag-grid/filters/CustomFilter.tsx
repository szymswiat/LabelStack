import React from 'react';
import { AgPromise, IDoesFilterPassParams, IFilterComp, IFilterParams } from 'ag-grid-community';
import { renderToStaticMarkup } from 'react-dom/server';

import { FilterEntry } from './FilterEntry';

export interface CustomFilterParams extends IFilterParams {
  entries: FilterEntry[];
  compareIdFn: (row: any, ids: number[]) => boolean;
}

export class CustomFilter implements IFilterComp {
  filterChangedCallback: (attributes: any) => void;

  filterParams: CustomFilterParams;
  selectedEntries: number[];
  eGui: HTMLElement;

  isFilterActive(): boolean {
    return this.selectedEntries.length > 0;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.selectedEntries.length > 0) {
      return this.filterParams.compareIdFn(params.data, this.selectedEntries);
    }

    return true;
  }

  getModel() {
    return undefined;
  }

  setModel(model: any): void | AgPromise<void> {
    return undefined;
  }

  onRadioButtonChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      this.selectedEntries.push(Number(e.target.value));
    } else {
      this.selectedEntries.forEach((id, index) => {
        if (id == Number(e.target.value)) this.selectedEntries.splice(index, 1);
      });
    }
    this.filterChangedCallback(null);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  init?(params: CustomFilterParams): void | AgPromise<void> {
    this.filterParams = params;
    this.filterChangedCallback = params.filterChangedCallback;
    this.selectedEntries = [];

    const filterComponent = this.getFilterComponent();
    const htmlFilterComponent = renderToStaticMarkup(filterComponent);
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = htmlFilterComponent;

    const radioButtonIds = this.filterParams.entries.map((entry) => 'radio_' + entry.id);
    radioButtonIds.forEach((radioButtonId) => {
      let radioButton = this.eGui.querySelector('#' + radioButtonId);
      radioButton.addEventListener('change', this.onRadioButtonChange.bind(this));
    });
  }

  getFilterComponent() {
    return (
      <div className="flex justify-center">
        <div className="w-full h-full text-sm p-2">
          {this.filterParams.entries.map((entry) => (
            <div
              key={'form_check_' + entry.id}
              className="form-check p-2 rounded-md text-gray-900 dark:text-primary-light dark:border-secondary-dark hover:bg-gray-200 dark:hover:bg-secondary-dark"
            >
              <input
                className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="checkbox"
                id={'radio_' + entry.id}
                key={'check_input_' + entry.id}
                value={entry.id}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-primary-light"
                htmlFor={'radio_' + entry.id}
                key={'check_label_' + entry.id}
              >
                {entry.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
