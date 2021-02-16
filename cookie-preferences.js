/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {LitElement, html, css} from 'lit-element';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class CookiePreferences extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
      }
      :host {
        display: block;
        max-width: 75ch;
        padding: 1.5em 2em;
        border: 1px solid darkgrey;
        background-color: white;
      }
      a {
        color: inherit;
      }
      label {
        font-weight: 500;
      }
      button {
        padding: 0.5em 0.875em;
        border: 2px solid black;
        background: transparent;
        font-family: inherit;
        font-size: inherit;
        line-height: 1;
      }
      button:hover,
      button:focus {
        background: black;
        color: white;
      }
      a:focus,
      button:focus,
      input:focus {
        outline: 3px solid blue;
        outline-offset: 2px;
      }
      .inner {
        line-height: 1.4;
        background: white;
        hyphens: auto;
      }
      .inner > * + * {
        margin-top: 1em;
      }
      .success {
        margin: 0 -2rem -1.5rem -2rem;
        padding: 0.75rem 2rem;
        background-color: green;
        color: white;
        font-size: 0.75em;
      }
      .lh-low {
        line-height: 1.25;
      }
      .mt-100 {
        margin-top: 0.125rem;
      }
      .mt-500 {
        margin-top: 2rem;
      }
      .ml-300 {
        margin-left: 0.5rem;
      }
      .is-hidden {
        display: none;
      }
    `;
  }

  constructor() {
    super();
    this.status = this._getConsentStatus() || {};
    this.categories = this._getCategories();
  }

  render() {
    return html`
      <div class="inner">
          <div>
              <label><input type="checkbox" checked disabled> Technisch notwendige Cookies</label>
              <p class="lh-low mt-100"><small>Technisch notwendige Cookies ermöglichen Grundfunktionen wie z. B. Login für registrierte Nutzer*innen. Die Webseite kann ohne diese Cookies nicht richtig funktionieren.</small></p>
          </div>
          ${this.categories.statistics?
            html`
              <div>
                <label>
                  <input type="checkbox" data-cookie="statistics" ?checked="${this.status.statistics}"> Statistiken
                </label>
                <p class="lh-low mt-100">
                  <small>Mithilfe von Drittanbietern erheben und analysieren wir anonymisierte Nutzungs-Statistiken, um unser Angebot kontinuierlich zu verbessern.</small>
                </p>
              </div>`:``
          }
          ${this.categories.marketing?
            html`
              <div>
                <label>
                  <input type="checkbox" data-cookie="marketing" ?checked="${this.status.marketing}"> Marketing
                </label>
                <p class="lh-low mt-100">
                  <small>Wir finanzieren unser Angebot mit Werbeeinnahmen. Marketing-Cookies folgen Benutzer*innen auf Webseiten und sammeln Informationen, die es uns ermöglichen, personalierte und damit relevante und ansprechende Werbung zu zeigen.</small>
                </p>
              </div>`:``
          }
          <p class="mt-500"><button @click=${this._saveUserPreferences}>Einstellungen aktualisieren</button></p>
          <div class="success mt-500 is-hidden">&check; Wir haben Ihre Einstellungen aktualisiert!</div>
      </div>
    `;
  }

  _getConsentStatus() {
    return JSON.parse(window.localStorage.getItem('cookie-consent'));
  }

  _setConsentStatus() {
    this.shadowRoot.querySelectorAll('[data-cookie]').forEach(function (input) {
      this.status[input.dataset.cookie] = input.checked;
    }, this);

    window.localStorage.setItem('cookie-consent', JSON.stringify(this.status));
  }

  _getCategories() {
    let categories = {};

    document.querySelectorAll('[data-cookie]').forEach(function(script) {
      categories[script.dataset.cookie] = true;
    });

    return categories;
  }

  _saveUserPreferences() {
    this._setConsentStatus();

    this.shadowRoot.querySelector('.success').classList.remove('is-hidden');
  }
}

window.customElements.define('cookie-preferences', CookiePreferences);
