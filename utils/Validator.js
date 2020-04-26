
export default class Validator {
  constructor (value, name = '') {
    this.value = value
    this.name = name
    this.errors = []
  }

  addError (message) {
    this.errors.push({ errorMessage: message })
  }

  isEmpty () {
    if (!this.value || !this.value.trim()) {
      this.addError(`Значение ${this.name} не должно быть пустым`)
    }
    return this
  }

  maxSize (size) {
    if (this.value > size) {
      this.addError(`Значение ${this.name} не должно быть больше ${size}`)
    }
    return this
  }

  notZero () {
    if (this.value <= 0) {
      this.addError(`Значение ${this.name} должно быть больше 0`)
    }
    return this
  }

  getResult () {
    return {
      result: this.value,
      errors: this.errors
    }
  }
}
