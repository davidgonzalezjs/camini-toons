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

  get() {
    subclassResponsibility();
  }

  map(aMappingFunction) {
    subclassResponsibility();
  }

  getOrElse(elseFunction) {
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

  map(aMappingFunction) {
    return Optional.with(aMappingFunction(this._element));
  }

  get() {
    return this._element;
  }

  getOrElse(elseFunction) {
    return this.get();
  }

}

class EmptyOptional extends Optional {

  ifPresent(aFunction) {
    return this;
  }

  get() {
    throw "Cannot get an element of an empty optional";
  }

  getOrElse(elseFunction) {
    return elseFunction();
  }

  map(aMappingFunction) {
    return this;
  }
  
}

export default Optional;