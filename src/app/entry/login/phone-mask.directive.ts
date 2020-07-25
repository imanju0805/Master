import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appPhoneMask]',
})
export class PhoneMaskDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }
  

  onInputChange(event, backspace) {
    if(event!=null){
    let newVal = event.replace(/\D/g, '');
    // if (backspace && newVal.length <= 6) {
    //   newVal = newVal.substring(0, newVal.length - 1);
    // }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 10) {

      //newVal=newVal.replace(/^(\d{0,9})+(\.+)/,'$1');
      newVal=newVal.replace(/^(\d{0,9})/,'$1');
    } else {
      newVal = newVal.substring(0, 10);
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}

}
