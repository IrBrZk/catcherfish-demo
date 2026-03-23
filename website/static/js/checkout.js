/**
 * Guest checkout helper for CatcherFish.
 * This file is intentionally standalone so it can be reused in templates
 * without depending on the large frontend bundle.
 */

function saveCartToStorage(cart) {
  localStorage.setItem('catcherfish_cart', JSON.stringify(cart || []));
}

function loadCartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('catcherfish_cart') || '[]');
  } catch (error) {
    return [];
  }
}

function goToCheckout() {
  const target = document.getElementById('mod-ov');
  if (target && typeof target.classList?.add === 'function') {
    target.classList.add('open');
    return;
  }
  if (typeof openOrder === 'function') {
    openOrder();
  }
}

async function submitGuestOrder(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const cartItems = loadCartFromStorage();
  if (cartItems.length === 0) {
    alert('Корзина пуста!');
    return;
  }

  data.items = cartItems;

  try {
    const apiBase = (window.API_BASE || '').replace(/\/$/, '');
    const endpoint = apiBase ? `${apiBase}/api/guest-order` : '/api/guest-order';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success || result.order_id) {
      const checkoutForm = document.getElementById('guest-checkout-form');
      const successBox = document.getElementById('order-success');
      const orderNumber = document.getElementById('order-number');

      if (checkoutForm) {
        checkoutForm.classList.add('hidden');
      }
      if (successBox) {
        successBox.classList.remove('hidden');
      }
      if (orderNumber) {
        orderNumber.textContent = result.order_id || '';
      }

      localStorage.removeItem('catcherfish_cart');
      if (typeof closeCart === 'function') {
        closeCart();
      }

      if (result.payment_url) {
        setTimeout(() => {
          window.location.href = result.payment_url;
        }, 2000);
      }
      return;
    }

    alert('Ошибка: ' + (result.error || 'не удалось оформить заказ'));
  } catch (error) {
    alert('Ошибка сети. Попробуйте позже.');
  }
}

window.saveCartToStorage = saveCartToStorage;
window.loadCartFromStorage = loadCartFromStorage;
window.submitGuestOrder = submitGuestOrder;
window.goToCheckout = goToCheckout;
