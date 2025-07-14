const config = window.customSnippetsConfig || {};

function checkboxConfirmationHTML(text) {
    return `
        <div class="checkout_steps--section section--extra">
            <div class="checkout_list--group">
                <div class="checkout_list">
                    <div class="checkout_list--row">
                        <div class="checkout_list--item">
                            <div class="checkout_list--item_content">
                                <div class="control">
                                    <label class="checkbox">
                                        <input type="checkbox" name="term_agree" id="term_agree" required="true">
                                        <span>
                                            ${text}
                                        </span>
                                    </label>
                                    <label id="age_agree-error" class="error error-block" for="term_agree" style="display: none"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function extraSidebarHTML(html) {
    return `
        <div class="extra-sidebar">
            ${html}
        </div>
    `
}

function addCheckboxConfirmation() {
    if (config.paymentButtonAboveCheckbox) {
        const paymentBtn = document.querySelector('#paymentBtn');
        if (paymentBtn) {
            const checkboxHTML = checkboxConfirmationHTML(config.paymentButtonAboveCheckbox);
            paymentBtn.insertAdjacentHTML('beforebegin', checkboxHTML);

            // Disable payment button initially
            paymentBtn.disabled = true;

            // Listen for checkbox changes
            const checkbox = document.getElementById('term_agree');
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    paymentBtn.disabled = !this.checked;
                });
            }
        }
    }
}

function verifyCheckboxAndButtonState() {
    const checkbox = document.getElementById('term_agree');
    const paymentBtn = document.querySelector('#paymentBtn');
    if (checkbox && paymentBtn) {
        // If checkbox is unchecked and button is not disabled, disable it
        if (!checkbox.checked && !paymentBtn.disabled) {
            paymentBtn.disabled = true;
        }
    }
}

function monitorPaymentBtnDisabledState() {
    const paymentBtn = document.querySelector('#paymentBtn');
    if (!paymentBtn) return;
    const observer = new MutationObserver(() => {
        verifyCheckboxAndButtonState();
    });
    observer.observe(paymentBtn, { attributes: true, attributeFilter: ['disabled'] });
}

function injectAbovePaymentButton() {
    const paymentBtn = document.querySelector('#paymentBtn');
    if (paymentBtn) {
        const footerDiv = paymentBtn.closest('.checkout_steps--footer-next_link');
        if (footerDiv) {
            const customHTML = config.paymentButtonHTMLAbove || '';
            footerDiv.insertAdjacentHTML('beforebegin', customHTML);
        }
    }
}

function injectBelowPaymentBtn() {
    const paymentBtn = document.querySelector('#paymentBtn');
    if (paymentBtn) {
        const customHTML = config.paymentButtonHTMLBelow || '';
        paymentBtn.insertAdjacentHTML('afterend', customHTML);
    }
}

function injectSidebarExtraHTML() {
    const summaryInner = document.querySelector('.checkout_summary--inner');
    if (summaryInner) {
        const customHTML = config.sidebarSummaryBelow || '';
        summaryInner.insertAdjacentHTML('beforeend', customHTML);
    }
}

function paymentBtnAndInject() {
    const intervalId = setInterval(() => {
        const paymentBtn = document.querySelector('#paymentBtn');
        if (paymentBtn) {
            addCheckboxConfirmation();
            injectAbovePaymentButton();
            injectBelowPaymentBtn();
            clearInterval(intervalId);
            // monitor the payment button's disabled state and checkout
            monitorPaymentBtnDisabledState()
        }
    }, 1000);
}


