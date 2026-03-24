export function getChatbotReply(text: string) {
  const value = text.toLowerCase();

  if (
    value.includes("track") ||
    value.includes("order") ||
    value.includes("where is my order")
  ) {
    return "Please send your order number and phone number so we can help track your order.";
  }

  if (
    value.includes("return") ||
    value.includes("exchange") ||
    value.includes("refund")
  ) {
    return "Please tell us the item name, order number, and reason for return or exchange.";
  }

  if (
    value.includes("price") ||
    value.includes("cost") ||
    value.includes("how much")
  ) {
    return "Please tell us the braid style or product name you want, and we will share the price.";
  }

  if (
    value.includes("braids") ||
    value.includes("hair") ||
    value.includes("style")
  ) {
    return "We can help you choose the best braid style. Tell us the color, length, or texture you want.";
  }

  if (
    value.includes("agent") ||
    value.includes("support") ||
    value.includes("human")
  ) {
    return "A support request has been logged. We can continue here, and if WhatsApp sync is configured an agent will also be notified.";
  }

  return "Thanks for your message. A Royal Braids assistant is ready to help. You can also continue on WhatsApp for faster support.";
}
