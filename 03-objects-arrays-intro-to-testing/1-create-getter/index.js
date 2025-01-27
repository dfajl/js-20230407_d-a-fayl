/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */

export function createGetter(path) {
  const arrayPath = path.split(".");

  return function showObjectProp(obj) {
    let res = obj;

    for (const item of arrayPath) {
      if (res === undefined) {
        break;
      }
      res = res[item];
    }

    return res;
  };
}

// немного про замыкание
{
  function makeWorker() {
    let name = "Pete";

    return function () {
      console.log(name);
    };
  }

  let name = "John";

  // create a function
  let work = makeWorker();

  // call it
  work();
}

//решение ДЗ
{
  const object = {
    user: {
      name: "Dmitriy",
      surname: "Fayl",
    },
  };

  function createGetter(path) {
    const arrayPath = path.split(".");
    console.log(arrayPath);

    return function showObjectProp(obj) {
      let res = obj;

      //const arrayPath = path.split(".");
      // данный сплит лучше делать в родительской функции 1 раз. ЧТо интересно,
      // замыкание в данной ситуации будет работать и на входящий параметр path

      for (const item of arrayPath) {
        if (res === undefined) {
          break;
        }
        res = res[item];
      }

      return res;
    };
  }

  const getter = createGetter("user.name");

  console.log(getter(object));
}

//рекурсивный вариант решения
{
  const object = {
    user: {
      name: "Dmitriy",
      surname: "Fayl",
    },
  };

  function createGetter(path) {
    const arrayPath = path.split(".");

    return function showObjectProp(obj) {
      let res = obj;

      /* const getValue = (index) => {

        if (index === arrayPath.length || res === undefined) {
          return res;
        }

        res = res[arrayPath[index]];

        return getValue(index + 1);
      }; */

      function getValue(index) {
        console.log(`вызов getValue с индексом ${index}`);
        if (index === arrayPath.length || res === undefined) {
          console.log(`заход в условие внутри getValue с индексом ${index}`);
          console.log(`${res} ВНУТРИ УСЛОВИЯ`);
          return res; // этот return относится к третьему вызову getValue(index)
        }
        res = res[arrayPath[index]];
        console.log(res);

        return getValue(index + 1); //т.е тут return getValue(2), а getValue(2) вернет res == Dmitriy
      }

      return getValue(0); //первый вызов
    };
  }

  const getter = createGetter("user.name");

  console.log(getter(object));
  /* 
    я тут немного запутался с количеством return. но теперь понял. если не написать return getValue(index + 1), 
    то мы не сможем получить  результат вызова getValue(index), т.е. результат ее вызова в самый первый раз
  */
}

//пара слов о контексте
{
  const obj = {
    color: "blue",
    getColor() {
      return this.color;
    },
    getColorOneMore: () => {
      return this.color;
    }, //у стрелок нет своего контекста и он равен window, в модуле он равен undefined
  };
  console.log(obj.getColor()); //blue
  console.log(obj.getColorOneMore()); //undefined

  //теперь передам метод getColor в др. функцию
  function log(method) {
    const res = method();
    console.log(res);
  }
  log(obj.getColor); //undefined
  log(obj.getColorOneMore); //undefined

  log(obj.getColor.bind(obj)); //blue
  // obj.getColor.bind(obj) вернет новую функцию в железобетонной связке с контекстом
}

// ситуация выше, но для apply и bind
{
  const obj = {
    color: "blue",
    getColor() {
      return this.color;
    },
  };
  console.log(obj.getColor()); //blue

  //теперь передам метод getColor в др. функцию
  //функция должна еще принимать контекст в качестве параметра
  function log(method, context) {
    const res = method.apply(context);
    //const res = method.call(context);
    console.log(res);
  }
  log(obj.getColor, obj); //blue
}
