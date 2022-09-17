import { subclassResponsibility } from "./errors";

class Optional {

  static fromNullable(anElement) {
    return anElement == null
      ? this.empty()
      : this.with(anElement);
  }

  static with(anElement) {
    return new NonEmptyOptional(anElement);
  }

  static empty() {
    return new EmptyOptional();
  }

  ifPresent(aFunction) {
    subclassResponsibility();
  }

}

class NonEmptyOptional extends Optional {

  constructor(element) {
    super();
    this._element = element;
  }

  ifPresent(aFunction) {
    return aFunction(this._element);
  }

}

class EmptyOptional extends Optional {

  ifPresent(aFunction) {
    return this;
  }
  
}

export default Optional;