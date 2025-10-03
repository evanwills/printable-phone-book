import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { srOnly } from '../assets/css/sr-only.css';
import { formatPhone, sanitisePhone } from '../utils/phone.utils';

@customElement('name-phone-pair')
export class NamePhonePair extends LitElement {

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number, attribute: 'index' })
  index : number = 0;

  @property({ type: String, attribute: 'name' })
  name : string = '';

  @property({ type: String, attribute: 'phone' })
  phone : string = '';

  @state()
  _name : string = '';

  @state()
  _phone : string = '';

  _nameRegex : RegExp = /^[\w ()-]{1,20}$/;
  _phoneRegex : RegExp = /^0[2-9]\d{8}$/;

  _sanitisePhone(event: KeyboardEvent) : void {
    const value :string = (event.target as HTMLInputElement).value;
    (event.target as HTMLInputElement).value = sanitisePhone(value);
  }

  _sanitiseName(event: KeyboardEvent) : void {
    const value :string = (event.target as HTMLInputElement).value;
      (event.target as HTMLInputElement).value = value.replace(/[^\w ()\-]+/g, '');
  }

  handleChange(event: InputEvent) : void {
    // console.group('<name-phone-pair>.handleChange()');
    // console.log('event:', event);
    // console.log('event.target:', event.target);
    // console.log('event.target.dataset:', (event.target as HTMLInputElement).dataset);
    // console.log('event.target.dataset.field:', (event.target as HTMLInputElement).dataset.field);
    switch ((event.target as HTMLInputElement).dataset.field) {
      case 'name':
        this._name = (event.target as HTMLInputElement).value;
        break;

      case 'phone':
        this._phone = (event.target as HTMLInputElement).value;
        break;
    }

    if (this._nameRegex.test(this._name) && this._nameRegex.test(this._phone)) {
      this.dispatchEvent(new CustomEvent(
        'change',
        {
          bubbles: true,
          composed: true,
          detail: {
            index: this.index,
            name: this._name,
            phone: formatPhone(this._phone),
          },
        },
      ));
    }
    // console.groupEnd
  }

  focusWithin() {
    // console.group('<name-phone-pair>.focusWithin()');
    const target : HTMLInputElement | null = this.renderRoot.querySelector(
      `#name-${this.index}`,
    );
    console.log('target:', target);

    if (target !== null) {
      target.focus();
    }
    // console.groupEnd();
  }

  render() {
    // console.group('<name-phone-pair>.render()');
    // console.log('this.index:', this.index);
    // console.log('this.name:', this.name);
    // console.log('this.phone:', this.phone);
    // console.log('(this.index > -1):', (this.index > -1));
    const cls : string | null = (this.index > -1)
      ? ' sr-only'
      : 'null';
    // console.log('cls:', cls);
    // console.groupEnd();
    return html`<li>
      <label for="name-${this.index}" class="name-label${cls}">
        Name
        <span class="sr-only">${this.index}</span>
      </label>
      <input
        class="name-input"
        type="text"
        id="name-${this.index}"
        value="${this.name}"
        pattern="[\\w \\(\\)\\-]{1,20}"
        maxlength="20"
        data-field="name"
        size="15"
        @keyup=${this._sanitiseName}
        @change=${this.handleChange} />

      <label for="phone-${this.index}" class="phone-label${cls}">
        Phone
        <span class="sr-only">${this.index}</span>
      </label>
      <input
        class="phone-input"
        type="tel"
        id="phone-${this.index}"
        value="${sanitisePhone(this.phone)}"
        pattern="0[2-9]\\d{8}"
        maxlength="10"
        minlength="10"
        data-field="phone"
        size="10"
        @keyup=${this._sanitisePhone}
        @change=${this.handleChange} />
    </li>`;
  }

  static styles = css`
  li {
    margin: 0;
    padding: 0.25rem 0;
    display: grid;
    grid-template-areas: 'name-label phone-label'
                         'name-input phone-input';
    gap: 0.5rem;
  }
  .name-label { grid-area: name-label; }
  .name-input { grid-area: name-input; }
  .phone-label { grid-area: phone-label; }
  .phone-input { grid-area: phone-input; }

  ${srOnly}`;
}

declare global {
  interface HTMLElementTagNameMap {
    'name-phone-pair': NamePhonePair
  }
}
