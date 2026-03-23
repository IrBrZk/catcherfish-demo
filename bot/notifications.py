"""Notification helpers for CatcherFish."""

from __future__ import annotations

from typing import Any, Iterable, Sequence

from bot.telegram_bot import bot
from config import settings


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _format_money(value: Any) -> str:
    try:
        return f"{float(value or 0):.2f}"
    except Exception:
        return str(value or 0)


def format_items(items: Iterable[dict[str, Any]]) -> str:
    lines = []
    for item in items or []:
        name = _clean_text(item.get("name") or item.get("title") or "Товар")
        qty = int(item.get("quantity") or item.get("qty") or 1)
        price = _format_money(item.get("price") or 0)
        lines.append(f"• {name} ×{qty} — {price} ₽")
    return "\n".join(lines) if lines else "• Товары не указаны"


def send_sms(phone: str, message: str) -> bool:
    """
    Placeholder SMS sender.

    In production this should be wired to the chosen provider. For now we
    keep the interface stable and return False when no provider is set.
    """
    provider = _clean_text(getattr(settings.app, "sms_provider", ""))
    if not provider:
        return False
    return False


def send_email(email: str, subject: str, body: str) -> bool:
    """
    Placeholder email sender.

    The project can later plug SMTP/Sendgrid/etc. without changing callers.
    """
    sender = _clean_text(getattr(settings.app, "email_provider", ""))
    if not sender:
        return False
    return False


def render_email_template(template_name: str, order: dict[str, Any]) -> str:
    items = format_items(order.get("items") or [])
    return (
        f"<h2>CatcherFish</h2>"
        f"<p>Заказ <strong>{_clean_text(order.get('order_id'))}</strong> принят.</p>"
        f"<p>Клиент: {_clean_text(order.get('customer_name'))}<br>"
        f"Телефон: {_clean_text(order.get('customer_phone'))}<br>"
        f"Сумма: {_format_money(order.get('total_amount') or order.get('final_total'))} ₽</p>"
        f"<pre>{items}</pre>"
    )


def send_telegram_message(chat_ids: str | Sequence[str], message: str, *, parse_mode: str = "HTML") -> bool:
    if isinstance(chat_ids, str):
        chat_list = [chat_ids]
    else:
        chat_list = [str(chat_id) for chat_id in chat_ids]
    sent = False
    for chat_id in chat_list:
        if not chat_id:
            continue
        sent = bot.send(message, chat_id=chat_id) or sent
    return sent


def send_customer_confirmation(order: dict[str, Any]) -> bool:
    """
    Send customer confirmation via SMS + email placeholders.
    """
    sms_message = (
        f"CatcherFish: Заказ {order['order_id']} принят!\n"
        f"Сумма: {order['total_amount']} ₽\n"
        f"Доставка: {order['delivery_method']}\n"
        f"Трекинг придёт на email после отгрузки."
    )
    send_sms(order.get("customer_phone", ""), sms_message)

    email_template = render_email_template("order_confirmation", order)
    send_email(order.get("customer_email", ""), f"Заказ {order['order_id']}", email_template)
    return True


def send_admin_notification(order: dict[str, Any]) -> bool:
    """
    Telegram notification to admins.
    """
    message = (
        "📦 *Новый заказ (гость)*\n\n"
        f"🔢 Заказ: `{order['order_id']}`\n"
        f"💰 Сумма: {order['total_amount']} ₽\n"
        f"👤 Клиент: {order['customer_name']}\n"
        f"📞 Телефон: {order['customer_phone']}\n"
        f"📧 Email: {order['customer_email']}\n\n"
        f"🚚 Доставка: {order['delivery_method']}\n"
        f"💳 Оплата: {order['payment_method']}\n\n"
        f"🛍 Товары:\n{format_items(order['items'])}\n"
    )
    admin_ids = getattr(settings.telegram, "admin_ids", "") or settings.telegram.chat_id
    return send_telegram_message(admin_ids, message, parse_mode="Markdown")


def notify(text: str) -> bool:
    return bot.send(text)


def notify_error(title: str, error: Exception | str) -> bool:
    return bot.send_error(title, error)


def notify_success(title: str, details: str = "") -> bool:
    return bot.send_success(title, details)


def notify_report(title: str, lines: Iterable[str]) -> bool:
    return bot.send_report(title, list(lines))
