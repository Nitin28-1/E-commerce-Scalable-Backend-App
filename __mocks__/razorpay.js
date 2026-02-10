module.exports = jest.fn().mockImplementation(() => {
  return {
    orders: {
      create: jest.fn().mockResolvedValue({
        id: "rzp_test_order_123"
      })
    }
  };
});
