export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err);
      console.error(err.message);
    },
  },
};
