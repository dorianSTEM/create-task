import { Directive } from '@angular/core';
import { TextInput, Platform } from 'ionic-angular';

@Directive({
    selector: '[elasticTextArea]'
})
export class ElasticTextArea {
    isIos: boolean;
    iosTextAreaMinHeight = 40;
    mdTextAreaMinHeight = 38;

    constructor(private textInput: TextInput, private platform: Platform) {
        this.isIos = this.platform.is('ios');
    }

    ngOnInit() {
        // Wait for TextInput _native property to initialize.
        setTimeout(() => {
            this.textInput._native.valueChange.subscribe((inputValue: any) => {
                this.resize();
            });

            this.resize();
        });
    }

    resize() {
        let height = this.getTextAreaHeight(this.textInput, this.isIos ? this.iosTextAreaMinHeight : this.mdTextAreaMinHeight);
        this.textInput._native._elementRef.nativeElement.style.height = height + 'px';
    }

    getTextAreaHeight(textArea: TextInput, minHeight: number): number {
        // Get textarea styles.
        let body = <HTMLElement>document.querySelector('body'),
            textAreaElement = textArea._native._elementRef.nativeElement,
            style = window.getComputedStyle(textAreaElement, null),
            paddingHeight = parseInt(style.getPropertyValue('padding-top')) + parseInt(style.getPropertyValue('padding-bottom')),
            paddingWidth = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')),
            borderHeight = parseInt(style.getPropertyValue('border-top-width')) + parseInt(style.getPropertyValue('border-bottom-width')),
            width = parseInt(style.getPropertyValue('width')) - paddingWidth,
            lineHeight = style.getPropertyValue('line-height');

        // IE and Firefox do not support 'font' property, so we need to get it ourselves.
        let font = style.getPropertyValue('font-style') + ' ' +
            style.getPropertyValue('font-variant') + ' ' +
            style.getPropertyValue('font-weight') + ' ' +
            style.getPropertyValue('font-size') + ' ' +
            style.getPropertyValue('font-height') + ' ' +
            style.getPropertyValue('font-family');

        // Prepare a temporary textarea to determine the height for a real one.
        let newTextAreaElement = <HTMLTextAreaElement>document.createElement('TEXTAREA'),
            newTextAreaElementId = '__newTextAreaElementId__';
        newTextAreaElement.setAttribute('rows', '1');
        newTextAreaElement.setAttribute('id', newTextAreaElementId);
        newTextAreaElement.style.font = font;
        newTextAreaElement.style.width = width + 'px';
        newTextAreaElement.style.border = '0';
        newTextAreaElement.style.overflow = 'hidden';
        newTextAreaElement.style.padding = '0';
        newTextAreaElement.style.outline = '0';
        newTextAreaElement.style.resize = 'none';
        newTextAreaElement.style.lineHeight = lineHeight;

        // To measure sizes we need to add the textarea to DOM.
        body.insertAdjacentHTML('beforeend', newTextAreaElement.outerHTML);
        newTextAreaElement = <HTMLTextAreaElement>document.getElementById(newTextAreaElementId);
        newTextAreaElement.value = textArea.value;

        // Measure the height.
        newTextAreaElement.style.height = 'auto';
        newTextAreaElement.style.height = newTextAreaElement.scrollHeight + 'px';
        let height = parseInt(newTextAreaElement.style.height) + paddingHeight + borderHeight;

        if (height < minHeight) {
            height = minHeight;
        }

        // Remove the remporary textarea.
        body.removeChild(newTextAreaElement);

        return height;
    }
}