const { v4: uuidv4 } = require('uuid');
const { ACTIVE, WAITING_PAYMENT, UNSUBSCRIBED, UNSUBSCRIBED_PENDING, PENDING } = require('../utils/utils');

const trasnformToNewStatus = wpStatus => {
  if (wpStatus === 'wc-active') return ACTIVE;
  if (wpStatus === 'wc-pending') return PENDING;
  if (wpStatus === 'wc-cancelled') return UNSUBSCRIBED;
  if (wpStatus === 'wc-pending-cancel') return UNSUBSCRIBED_PENDING;
  if (wpStatus === 'wc-on-hold') return WAITING_PAYMENT;
  return PENDING;
}

const transformMethodPayment = wpPaymentMethod => {
  if (wpPaymentMethod === "woo-mercado-pago-basic") return "mercado-pago-manual";
  if (wpPaymentMethod === "bacs") return "transfer-wise-payoneer-cripto-paypal-westernUnion"
  return "mercado-pago-manual";
}

const createSubscriptionDataFromCSVRow = csvRowJson => {
  let subscriptionReadyToFB = {};
  subscriptionReadyToFB.idLaFlota = csvRowJson.subscription_id;
  subscriptionReadyToFB.status = trasnformToNewStatus(csvRowJson.subscription_status);
  subscriptionReadyToFB.userIdLaFlota = csvRowJson.customer_id;
  subscriptionReadyToFB.startDate = csvRowJson.start_date;
  subscriptionReadyToFB.nextPayment = csvRowJson.next_payment_date;
  subscriptionReadyToFB.lastPaymentDate = csvRowJson.last_payment_date;
  subscriptionReadyToFB.cancelledDate = csvRowJson.cancelled_date;
  subscriptionReadyToFB.billingPeriod = csvRowJson.billing_period;
  subscriptionReadyToFB.billingInterval = csvRowJson.billing_interval;
  subscriptionReadyToFB.orderTotal = csvRowJson.order_total;
  subscriptionReadyToFB.orderCurrency = csvRowJson.order_currency;
  subscriptionReadyToFB.paymentMethod = transformMethodPayment(csvRowJson.payment_method);
  subscriptionReadyToFB.requiresManualRenewal = csvRowJson.requires_manual_renewal;
  subscriptionReadyToFB.billingName = csvRowJson.billing_first_name;
  subscriptionReadyToFB.billingSurname = csvRowJson.billing_last_name;
  subscriptionReadyToFB.billingEmail = csvRowJson.billing_email;
  subscriptionReadyToFB.orderItems = csvRowJson.order_items;
  subscriptionReadyToFB.id = uuidv4();

  return subscriptionReadyToFB;
}

module.exports = { createSubscriptionDataFromCSVRow };