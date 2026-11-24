export class Checkout {
  #pending = null;

  get pending() {
    return this.#pending;
  }

  request(flight) {
    this.#pending = Object.freeze({ ...flight });
    return this.#pending;
  }

  cancel() {
    this.#pending = null;
  }

  confirm() {
    const receipt = this.#pending;
    this.cancel();
    return receipt;
  }
}
