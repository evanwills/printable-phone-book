import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('read-only-pair')
export class ReadOnlyPair extends LitElement {
  @property({ type: String, attribute: 'name' })
  name : string = '';

  @property({ type: String, attribute: 'phone' })
  phone : string = '';

  render() {
    return html`<li>
      <span class="name">${this.name}</span>
      <span class="phone">${this.phone}</span>
    </li>`;
  }

  static styles = css`
    li {
      background-color: var(--row-bg);
      display: flex;
      flex-direction: row;
      font-size: var(--wrap-font-size);
      padding: 0.25rem 0.5rem;
      gap: var(--row-gap);

      span { display: block; }
    }
    .name {
      flex-grow: 1;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      width: calc(100% - 1rem - var(--row-gap) - var(--phone-width));
    }
    .phone {
      width: var(--phone-width);
      text-align: right;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'read-only-pair': ReadOnlyPair
  }
}
