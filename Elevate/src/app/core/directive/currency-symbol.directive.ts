import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslatePipe } from '../pipe/translate.pipe';

@Directive({
  selector: '[appCurrencySymbol]',
  providers: [TranslatePipe]
})
export class CurrencySymbolDirective implements OnChanges {
  @Input()
  prefixCurrency = false;
  @Input()
  suffixCurrency = false;
  @Input('appCurrencySymbol')
  appCurrencySymbolVar: string | undefined = "EUR";
  constructor(public el: ElementRef, private pipe: TranslatePipe) {}
  
  ngOnChanges(change: SimpleChanges): void {
    if(!this.appCurrencySymbolVar) {
      this.appCurrencySymbolVar = "EUR";
    }
    if (!this.prefixCurrency && !this.suffixCurrency) {
      this.pipe.transform(`currency.${this.appCurrencySymbolVar}`);
      setTimeout(() => {
        let symbol = this.pipe.transform(`currency.${this.appCurrencySymbolVar}`);
        symbol = symbol ? symbol : '';
        this.el.nativeElement.innerHTML = '&nbsp;' + symbol + '&nbsp;';        
      }, 1000);
    }
  }
}
