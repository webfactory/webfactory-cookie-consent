import {LitElement, html, css} from 'lit-element';

export class CookieBanner extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        outline: none;
      }
      :host {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
        display: none;
      }
      :host(.is-visible) {
        display: flex;
        justify-content: center;
        align-items: center;
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
        max-width: 640px;
        margin: auto;
        padding: 2.5em 3em;
        line-height: 1.4;
        background: white;
        hyphens: auto;
      }
      .inner > * + * {
        margin-top: 1em;
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
    `;
  }

  static get properties() {
    return {
      datenschutzUrl: {type: String},
      impressumUrl: {type: String},
    };
  }

  constructor() {
    super();
    this.status = this._getConsentStatus() || {};
    this.categories = this._getCategories();
  }

  render() {
    return html`
      <div class="inner" tabindex="-1">
        <h2>Diese Webseite nutzt Cookies</h2>
        <p>
          Diese Website verwendet Cookies, um grundlegende Funktionen wie z. B. Login für registrierte Nutzer*innen zu ermöglichen. 
          Desweiteren nutzen wir Dienste von Drittanbietern, die uns helfen, unseren Service zu verbessern. Für die Verwendung
          bestimmter Dienste benötigen wir Ihre Einwilligung. Sie können diese Einwilligung jederzeit widerrufen. 
          ${this.datenschutzUrl?html`Weitere Informationen finden Sie in unserer <a href="${this.datenschutzUrl}">Datenschutzerklärung</a>.`:``}
        </p>
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
        
        <p class="mt-500"><button @click=${this._saveUserPreferences}>Speichern & schließen</button></p>
        
        ${this.datenschutzUrl||this.impressumUrl?
          html`<p class="mt-500">
            <small>
              ${this.datenschutzUrl?html`<a href="${this.datenschutzUrl}">Datenschutz</a>`:``}
              ${this.impressumUrl?html`<a class="ml-300" href="${this.impressumUrl}">Impressum</a>`:``}
            </small>
          </p>`:
          html``}
      </div>  
    `;
  }

  firstUpdated() {
    if (this._isEmpty(this.status)) {
      this._showBanner();
    } else {
      this._loadScripts(this.status);
    }
  }

  _showBanner() {
    this.classList.add('is-visible');
    this.shadowRoot.querySelector('.inner').focus();
  }

  _hideBanner() {
    this.classList.remove('is-visible');
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
    this._loadScripts(this.status);
    this._hideBanner();
  }

  _loadScripts(status) {
    if (!status) { return; }

    let head = document.getElementsByTagName('head')[0];

    Object.keys(status).forEach(function(key) {
      if (status[key]) {
        document.querySelectorAll('script[data-cookie]').forEach(function(script) {
          if (script.dataset.cookie === key) {
            script.setAttribute('type', 'text/javascript');

            if (script.dataset.src && !script.getAttribute('src')) {
              script.setAttribute('src', script.dataset.src);
            }

            head.removeChild(script);
            head.appendChild(script);
          }
        });
      }
    });
  }

  _isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }
}

window.customElements.define('cookie-banner', CookieBanner);
