export const useStripe = () => ({
  initPaymentSheet: async () => ({
    error: { code: 'Unsupported', message: 'Оплата недоступна в веб-версии' },
  }),
  presentPaymentSheet: async () => ({
    error: { code: 'Unsupported', message: 'Оплата недоступна в веб-версии' },
  }),
});
