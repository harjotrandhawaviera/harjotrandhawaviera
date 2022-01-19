import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Observable, of, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OptionVM } from './../../model/option.model';

@Component({
  selector: 'app-static-auto-complete',
  templateUrl: './static-auto-complete.component.html',
  styleUrls: ['./static-auto-complete.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: StaticAutoCompleteComponent },
  ],
})
export class StaticAutoCompleteComponent
  implements
  MatFormFieldControl<StaticAutoCompleteComponent>,
  ControlValueAccessor,
  OnChanges,
  OnDestroy {
  @ViewChild('filterText') filterTextEle?: ElementRef;

  @Output() valueChanges?: Observable<string>;

  @Input() id: string = 'static-auto-complete';
  @Input() error: string = '';
  @Input() clearSelection: boolean = false;
  formControl = new FormControl();

  stateChanges: Subject<void> = new Subject<void>();
  private _disabled = false;
  @Input()
  set disabled(disabled) {
    this._disabled = disabled;
    disabled ? this.formControl.disable() : this.formControl.enable();
    this.stateChanges.next();
  }
  get disabled() {
    return this._disabled;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _placeholder: string = '';
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input() options: OptionVM[] = [];
  filteredOptionsObservable: Observable<OptionVM[]> = of([]);
  value: any;
  writerValue: any;
  focused: boolean = false;
  get empty() {
    return !this.value && !this.formControl.value;
  }
  get errorState() {
    return !!this.error;
  }
  controlType?: string | undefined = 'text';
  autofilled?: boolean | undefined = false;
  userAriaDescribedBy?: string | undefined;
  constructor(
    @Optional() @Self() public ngControl: NgControl | null,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() public parentFormField: MatFormField
  ) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    // value change emitter
    this.valueChanges = this.formControl.valueChanges.pipe(
      filter((a) => (a && typeof a === 'string') || !a)
    );
    this.formControl.valueChanges
      .pipe(filter((a) => (a && typeof a === 'string') || !a))
      .subscribe((res) => {
        this.filteredOptionsObservable = of(this._filter(res));
        this.undefinedValue();
      });

    // this.filteredOptionsObservable = this.formControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
  }
  private undefinedValue() {
    if (this.value) {
      this.value = undefined;
      this.propagateChange(undefined);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.filteredOptionsObservable = of(this._filter(this.formControl.value));
      this.updateValueFromChange();
    }
  }
  private _filter(value?: string): OptionVM[] {
    if (value && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.options
        ? this.options.filter(
          (option) =>
            option.text && option.text.toString().toLowerCase().includes(filterValue)
        )
        : [];
    } else {
      return this.options;
    }
  }
  ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef);
  }
  writeValue(obj: any): void {
    this.writerValue = obj;
    this.updateValueFromChange();
  }
  updateValueFromChange() {
    if (this.writerValue && this.options) {
      if (this.options.length > 0) {
        const option = this.options.find((a) => a.value === this.writerValue);
        if (option) {
          this.value = option;
          this.formControl.patchValue(option);
        } else {
          this.value = undefined;
          this.formControl.patchValue(undefined);
        }
      }
    }
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDescribedByIds(ids: string[]): void {
    const controlElement = this.elRef.nativeElement.querySelector(
      '.app-static-auto-complete-container'
    )!;
    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }
  focus(options?: FocusOptions): void {
    this.elRef.nativeElement.focus(options);
  }
  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   const ele = this.elRef.nativeElement.querySelector('input');
    //   if (ele) {
    //     ele.focus();
    //   }
    // }
    if (!this.focused) {
      this.focus();
    }
  }
  displayWith(value: any): string {
    return value ? value.text : '';
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    if (event && event.option && event.option.value) {
      const newValue = event.option.value.value;
      this.updateValue(newValue);
      // this.filteredOptionsObservable = of(
      //   this._filter(event.option.value.text)
      // );
      this.filteredOptionsObservable = of(this._filter(''));
    } else {
      this.undefinedValue();
      this.filteredOptionsObservable = of(this._filter(''));
    }
  }

  private updateValue(newValue: any) {
    if (this.value !== newValue) {
      this.value = newValue;
      this.propagateChange(this.value);
      this.writerValue = undefined;
    }
  }
  checkValueAndRemove() {
    // if (typeof this.formControl.value === 'string') {
    //   this.formControl.patchValue(undefined);
    //   this.updateValue(null);
    // } else {
    // }
  }
  clearValue() {
    this.formControl.patchValue(undefined);
    this.updateValue(null);
  }
}
