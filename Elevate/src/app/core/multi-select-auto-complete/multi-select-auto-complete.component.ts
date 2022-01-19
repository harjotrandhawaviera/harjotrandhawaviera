import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';

import { ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { OptionVM } from '../../model/option.model';

@Component({
  selector: 'app-multi-select-auto-complete',
  templateUrl: './multi-select-auto-complete.component.html',
  styleUrls: ['./multi-select-auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectAutoCompleteComponent),
      multi: true
    }
  ]
})
export class MultiSelectAutoCompleteComponent implements OnChanges, ControlValueAccessor {
  @ViewChild(MatAutocompleteTrigger) autoTrigger!: MatAutocompleteTrigger;
  @Input() uniqueId: string | undefined | null;
  @Input() label: string | undefined | null;
  @Input() wildcardSearch: boolean | undefined | null;
  @Input() required: boolean | null = false;
  filteredOptionsObservable: Observable<OptionVM[]> | undefined | null;
  _filteredOptions: OptionVM[] | undefined | null;
  @Input()
  set filteredOptions(value: OptionVM[]) {
    this._filteredOptions = value;
    if (this._filteredOptions && this.static) {
      this.bindObservableValueFilter();
    }
    if (!this._filteredOptions) {
      this._filteredOptions = [];
    }
    if (
      this.wildcardSearch &&
      this.multiPick &&
      this.multiPick.value &&
      typeof this.multiPick.value === 'string' &&
      this._filteredOptions.findIndex(
        a =>
          a.text &&
          a.text.toString().toUpperCase() === this.multiPick.value.toUpperCase() &&
          a.isWild === true
      ) === -1
    ) {
      let wildcardOption: OptionVM;
      wildcardOption = {
        isWild: true,
        text: '*' + this.multiPick.value.trim(),
        value: this.multiPick.value.trim()
      };
      wildcardOption.isWild = true;
      this._filteredOptions.splice(0, 0, wildcardOption);
    }
  }
  get filteredOptions() {
    return this._filteredOptions ? this._filteredOptions : [];
  }
  @Input()
  static = false;
  _selected: OptionVM[] = [];
  writtenValue: string[] | number[] | undefined = [];
  @Input()
  set selected(value: OptionVM[]) {
    this._selected = value;
    if (
      this.filterTextEle &&
      this.filterTextEle.nativeElement &&
      this.filterTextEle.nativeElement.value
    ) {
      this.filterTextEle.nativeElement.value = '';
    }
  }
  get selected(): OptionVM[] {
    return this._selected;
  }
  // @Output()
  // selectionChange: EventEmitter<OptionVM[]> = new EventEmitter();
  @Output()
  valueChanges: Observable<any>;
  multiPick: FormControl = new FormControl();
  @ViewChild('filterText')
  filterTextEle!: ElementRef;
  separatorKeysCodes: number[] = [ENTER];
  constructor() {
    this.selected = [];
    this.valueChanges = this.onInputChanges();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.static) {
      if (this.static) {
        this.bindObservableValueFilter();
      }
    }
    if (changes.filteredOptions) {
      this.updateValueFromChange();
    }
  }
  writeValue(obj: string[] | number[]): void {
    this.writtenValue = obj;
    this.updateValueFromChange();
  }
  updateValueFromChange() {
    if (this.writtenValue) {
      if (this._filteredOptions) {
        const options = this._filteredOptions.filter(a => this.writtenValue && this.writtenValue.findIndex((x: string | number) => x === a.value) !== -1);
        this.selected = options;
        this.multiPick.patchValue(options);
      } else {
        this.selected = [];
        this.multiPick.patchValue([]);
      }
    }
  }
  propagateChange = (_f: any) => { };
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

  bindObservableValueFilter() {
    // this.filteredOptionsObservable = Observable_of(this.filteredOptions);
    this.filteredOptionsObservable = this.multiPick.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value?: string): OptionVM[] {
    if (value && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.filteredOptions
        ? this.filteredOptions.filter(option =>
          option.text && option.text.toString().toLowerCase().includes(filterValue)
          && (!this.selected || this.selected.findIndex(x => x.value === option.value) === -1)
        )
        : [];
    } else {
      return this.filteredOptions.filter(option => (!this.selected || this.selected.findIndex(x => x.value === option.value) === -1));
    }
  }
  onInputChanges(): Observable<any> {
    return this.multiPick.valueChanges
      .pipe(filter(a => a && typeof a === 'string'), debounceTime(400));
  }
  onSelected(event: any) {
    // const account: any = this.filteredOptions.find(
    //   a => a.value === event.option.value
    // );
    if (!this.selected) {
      this.selected = [];
    }
    this.filterTextEle.nativeElement.value = '';
    if (event.option.value && event.option.value.isWild) {
      const index: number = this.selected.indexOf(event.option.value);
      if (index === -1) {
        this.selected.push(event.option.value);
      }
    } else {
      this.selected.push(event.option.value);
    }
    this.bindObservableValueFilter();
    this.propagateChange(this.selected.map(a => a.value));
    this.writtenValue = undefined;
    setTimeout(() => {
      this.autoTrigger.openPanel();
    }, 1);

  }
  removeItem(account: any) {
    if (!this.selected) {
      this.selected = [];
    }
    const index: number = this.selected.indexOf(account);
    if (index !== -1) {
      this.selected.splice(index, 1);
      this.bindObservableValueFilter();
      this.propagateChange(this.selected.map(a => a.value));
      this.writtenValue = undefined;
    }
  }
  displayFn(selected?: OptionVM | any): string {
    // return selected ? selected.text : undefined;
    return selected && (selected.text || selected.info)
      ? selected.text +
      (selected.info
        ? (selected.text ? ' (' : '') +
        selected.info +
        (selected.text ? ')' : '')
        : '')
      : '';
  }
}
