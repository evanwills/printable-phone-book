import { LitElement, css, html, type TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js';
import type { pair } from './types/general';
import './components/name-phone-pair.ts';
import './components/read-only-pair.ts';
import type { NamePhonePair } from './components/name-phone-pair.ts';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('printed-phone-book')
export class PrintedPhoneBook extends LitElement {

  /**
   * The number of times the button has been clicked.
   */
  @state()
  _entries : pair[] = [
  ];

  @state()
  _sliceAt : number = 10;

  @state()
  _count : number = 0;

  @state()
  _newIndex : number = -1;

  @state()
  _copies : number = 6;

  _resetNewIndex() {
    this._newIndex = -1;
    setTimeout(this._setFocus.bind(this), 150);
  }

  _setFocus() {
    const target : NamePhonePair | null = this.renderRoot.querySelector('#new-entry');

    if (target !== null) {
      target.focusWithin();
    }
  }

  _updateEntry(event : CustomEvent) : void {
    // console.group('<printed-phone-book>._updateEntry()');
    const oldC = this._entries.length;
    // console.log('event:', event);
    // console.log('entry:', event.detail);
    // console.log('this._entries (before):', this._entries);
    // console.log('this._entries.length (before):', this._entries.length);
    if ((event.detail as pair).index == -1) {
      if (oldC < this._sliceAt * 2) {
        this._entries.push({
          ...event.detail,
          index: this._entries.length,
        });
        this._newIndex = Date.now();
        setTimeout(this._resetNewIndex.bind(this), 50);
      }
    } else if (typeof this._entries[event.detail.index] !== 'undefined') {
      this._entries[event.detail.index] = event.detail;
    } else {
      throw new Error('Could not determine what to do');
    }
    this._count = this._entries.length;
    // console.log('this._entries.length (after):', this._entries.length);
    // console.log('this._entries (after):', this._entries);
    // console.groupEnd();
  }

  _print() { window.print(); }

  renderPrint (left : pair[], right : pair[], only : boolean = true) : TemplateResult {
    const _only = (only === true)
      ? ' print-only'
      : '';
    return html`
        <article class="print${_only}">
          <ul>
            ${left.map(
              (pair) => html`<read-only-pair
                name="${pair.name}"
                phone="${pair.phone}"></read-only-pair>`
            )}
          </ul>
          <ul>
            ${right.map(
              (pair) => html`<read-only-pair
                name="${pair.name}"
                phone="${pair.phone}"></read-only-pair>`
            )}
          </ul>
        </article>`
  }

  renderPrintExtra (left : pair[], right : pair[], only : boolean = true) : TemplateResult[] {
    console.group('<printed-phone-book>.render()');
    const first = this.renderPrint(left, right, only);
    const output : TemplateResult[] = [];
    for (let a = 1; a < this._copies; a += 1) {
      output.push(first);
    }
    console.log('first:', first);
    console.log('output:', output);
    console.groupEnd();

    return output;
    // return ([] as TemplateResult[]).fill(this.renderPrint(left, right, only), 0, this._copies - 1);
  }

  render() {
    console.group('<printed-phone-book>.render()');
    const leftCol = this._entries.slice(0, this._sliceAt);
    const rightCol = this._entries.slice(this._sliceAt, (this._sliceAt * 2));

    console.groupEnd();
    return html`
      <div class="wrap" style="--row-count: ${this._sliceAt}">
        <div class="ui">
          <h1>Pocket phone book</h1>
          <p>This is for when technology fails us (or those in our care).</p>
          <details name="ui">
            <summary>How to use</summary>
            <ol>
              <li>Add up to ${this._sliceAt * 2} phone numbers</li>
              <li>Click the "Print" button (or trigger the print window some other way)</li>
              <li>Set your page orientation to landscape</li>
              <li>Make sure you have the scaling set to 100%</li>
              <li>Make sure you have "Print backgrounds" on (otherwise, you'll loose the borders and zebra striping.)</li>
              <li>Print the page</li>
              <li>Cut out each double column block</li>
              <li>Fold in half along the centre line then unfold</li>
              <li>Glue the back and refold so the paper is double thickenss.</li>
              <li>If you have a laminator, laminate each copy</li>
            </ol>
          </details>

          <details name="ui" open>
            <summary>Enter names &amp; phone numbers </summary>
            <ol>
              ${this._entries.map(
                (pair) => html`<name-phone-pair
                  index="${pair.index}"
                  name="${pair.name}"
                  phone="${pair.phone}"
                  @change=${this._updateEntry}></name-phone-pair>`
              )}
              ${(this._entries.length < (this._sliceAt * 2) && this._newIndex === -1)
                ? html`<name-phone-pair index="-1" @change=${this._updateEntry} id="new-entry"></name-phone-pair>`
                : ''
              }

            </ol>
          </details>
          <details name="ui">
            <summary>About the code</summary>
            <h2>Repository</h2>
            <p><a href="https://github.com/evanwills/printable-phone-book">https://github.com/evanwills/printable-phone-book</a></p>

            <h2>Installation</h2>
            <h3>NPM</h3>
            <pre>git clone https://github.com/evanwills/printable-phone-book.git;
npm install;
npm run dev;</pre>

            <h3>Deno</h3>
            <pre>
git clone https://github.com/evanwills/printable-phone-book.git;
deno install;
deno task dev;</pre>
        </div>
        ${this.renderPrint(leftCol, rightCol, false)}
        ${this.renderPrintExtra(leftCol, rightCol)}
      </div>
      <button
        ?disabled=${(this._entries.length === 0)}
        type="button"
        @click=${this._print} >Print</button>
    `;
  }

  static styles = css`
  * { box-sizing: border-box; }
  .wrap {
    --wrap-border-colour: #000;
    --wrap-border-style: dashed;
    --wrap-border-width: 0.05rem;
    --wrap-width: 26rem;
    --wrap-padding: 0.5rem;
    --wrap-height: calc((var(--row-count) * 2) + (var(--wrap-padding) * 2));
    --wrap-col-width: 12rem;
    --wrap-col-gap: 1rem;
    --wrap-font-size: inherit;

    --row-bg: #fff;
    --row-bg-alt: #ddd;
    --row-gap: 0.5rem;

    --phone-width: 6rem;

    display: flex;
    flex-wrap: wrap;
    place-items: center;
    gap: 2rem;
    font-size: var(--wrap-font-size, 1rem);
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .ui {
    max-width: 25rem;
  }
  .print {
    background-color: #fff;
    border-color: var(--wrap-border-colour);
    border-style: solid;
    border-width: var(--wrap-border-width);
    color: #000;
    display: flex;
    padding: 0;
    column-gap: 0;
    width: var(--wrap-width);
    height: var(--wrap-height);
    position: relative;

    ul {
      width: 50%;
      padding: var(--wrap-padding);

      > :nth-child(odd) {
        --row-bg: var(--row-bg-alt);
      }

      + ul {
        border-left-color: var(--wrap-border-colour);
        border-left-style: solid;
        border-left-width: var(--wrap-border-width);
      }
    }
  }
  .print-only {
    display: none;
  }
  @media print {
    .print { --wrap-font-size: 13px; }
    .wrap {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      justify-content: space-around;
      align-items: space-around;
    }
    .ui, button { display: none; }
    .print-only {
      display: flex;
    }
    .print::before {
      width: var(--wrap-border-width);
    }
  }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'printed-phone-book': PrintedPhoneBook
  }
}
