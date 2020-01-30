
const privatePropertySet = Symbol('privatePropertySet');

const numberTypeStrings = [
  'number',
  '[object Number]'
];
function isNumber(o) {
  let ty = typeof o;
  if (numberTypeStrings.indexOf(ty) > -1) {
    return true;
  }
  ty = {}.toString.call(o);
  if (numberTypeStrings.indexOf(ty) > -1) {
    return true;
  }
  return false;
}

function validateMatrix(arr) {
  if (!(arr instanceof Array)) {
    throw new Error('Invalid matrix structure!');
  }
  let m = arr.length;
  if (arr.some(elem => {
    return !(elem instanceof Array);
  })) {
    throw new Error('Invalid matrix structure!');
  }
  let n = arr[0].length;
  if (arr.some(elem => {
    return elem.length !== n;
  })) {
    throw new Error('Invalid matrix structure!');
  }
  //校验矩阵的个个元素类型是否是数字，如果不是转换成数字，无法转换的或者是undefined、null的设置为0
  for (let i = 0; i < m; ++i) {
    for (let j = 0; j < n; ++j) {
      let o = arr[i][j];
      if (!isNumber(o)) {
        let no = Number(o);
        if (isNaN(no)) {
          no = 0;
        }
        arr[i][j] = no;
      }
    }
  }
}

export default class MatrixClass {
  constructor(arr) {
    validateMatrix(arr);
    this[privatePropertySet] = {
      elementListList: arr
    };
  }

  get rowCount() {
    return this[privatePropertySet].elementListList.length;
  }

  get columnCount() {
    return this[privatePropertySet].elementListList[0].length;
  }

  element(i, j) {
    if (i < 0 || i >= this.rowCount) {
      throw new Error('Invalid row index');
    }
    if (j < 0 || j >= this.columnCount) {
      throw new Error('Invalid column index');
    }
    return this[privatePropertySet].elementListList[i][j];
  }

  toString() {
    let arr = this[privatePropertySet].elementListList.map(elem => {
      return `(${elem.toString()})`;
    });
    return `(${arr.toString()})`;
  }

  add(o) {
    if (o instanceof MatrixClass) {
      if (this.rowCount !== o.rowCount || this.columnCount !== o.columnCount) {
        throw new Error('Left matrix row&column count is not same to right matrix row&column count, it can not be added!');
      }
      let left = this[privatePropertySet].elementListList, right = o[privatePropertySet].elementListList;
      let m = this.rowCount, n = this.columnCount;
      let resultListList = [];
      for (let i = 0; i < m; ++i) {
        resultListList[i] = [];
        for (let j = 0; j < n; ++j) {
          resultListList[i][j] = left[i][j] + right[i][j];
        }
      }
      return new MatrixClass(resultListList);
    }
    else {
      throw new Error('Invalid parameter type!');
    }
  }

  multiply(o) {
    if (isNumber(o)) {
      this[privatePropertySet].elementListList = this[privatePropertySet].elementListList.map(elementList => {
        return elementList.map(element => {
          return element * o;
        });
      });
      return this;
    }
    else if (o instanceof MatrixClass) {
      if (this.columnCount !== o.rowCount) {
        throw new Error('Left matrix column count is not same to right matrix row count, it can not be multiplied!');
      }
      let left = this[privatePropertySet].elementListList, right = o[privatePropertySet].elementListList;
      let m = this.rowCount, l = this.columnCount, n = o.columnCount;
      let resultListList = [];
      for (let i = 0; i < m; ++i) {
        resultListList[i] = [];
        for (let j = 0; j < n; ++j) {
          let r = 0;
          for (let t = 0; t < l; ++t) {
            r += left[i][t] * right[t][j];
          }
          resultListList[i][j] = r;
        }
      }
      return new MatrixClass(resultListList);
    }
    else {
      throw new Error('Invalid parameter type!');
    }
  }
}
