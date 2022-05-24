const obj1 = {
  one: 1,
  two: 2,
};

const obj2 = {
  three: 3,
  four: 4,
  func: () => console.log('hello'),
  obj: {
    one: 1,
    two: 2,
  },
  objLink: obj1,
};

const copy = { ...obj2 };

console.log('1 --', 'copy -->', copy, 'origin', obj2);

copy.obj.one = 100;
copy.objLink.one = 150;

console.log('2 --', 'copy -->', copy, 'origin', obj2);
