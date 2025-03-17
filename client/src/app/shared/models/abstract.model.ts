export abstract class Abstract {
  assign(props: object, obj?: object) {
    for (let key of Object.keys(props)) {
      obj = obj || this;
      if (obj.hasOwnProperty(key)) {
        if (obj[key] instanceof Object) {
          this.assign(props[key], obj[key]);
        } else {
          obj[key] = props[key];
        }
      }
    }
  }
}
