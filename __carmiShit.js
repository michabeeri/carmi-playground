var model = (function () {
          return function model($model, $funcLibRaw, $batchingStrategy) {
    let $funcLib = $funcLibRaw;

    if (/* DEBUG */true) {
      $funcLib = !$funcLibRaw || typeof Proxy === 'undefined' ? $funcLibRaw : new Proxy($funcLibRaw, {
        get: (target, functionName) => {
          if (target[functionName]) {
            return target[functionName];
          }

          throw new TypeError(`Trying to call undefined function: ${functionName} `);
        }
      });
      var timeMachine = [mergeDeep({}, $model)];

      function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
      }

      function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
          for (const key in source) {
            if (isObject(source[key])) {
              if (!target[key]) Object.assign(target, { [key]: {} });
              mergeDeep(target[key], source[key]);
            } else {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }

        return mergeDeep(target, ...sources);
      }

      function snapShot() {

        if(timeMachineHolder.length) {
          const res = mergeDeep({}, ...timeMachineHolder)
          timeMachine.push(res)
          timeMachineHolder = []
        }
      }
    }

    function mathFunction(name, source) {
      return arg => {
        const type = typeof arg;

        if (type !== 'number') {
          throw new TypeError(`Trying to call ${JSON.stringify(arg)}.${name}. Expects number, received ${type} at ${source}`);
        }

        return Math[name](arg);
      };
    }

    function checkTypes(input, name, types, functionName, source) {
      function checkType(type) {
        const isArray = Array.isArray(input);
        return type == 'array' && isArray || type === typeof input && !isArray;
      }

      if (types.some(checkType)) {
        return;
      }

      const asString = typeof input === 'object' ? JSON.stringify(input) : input;
      throw new TypeError(`${functionName} expects ${types.join('/')}. ${name} at ${source}: ${asString}.${functionName}`);
    }

    const $res = {
      $model
    };
    const $listeners = new Set();
    function mapValues(func, src, context) {
    return Object.keys(src).reduce((acc, key) => {
      acc[key] = func(src[key], key, context);
      return acc;
    }, {});
  }

  function filterBy(func, src, context) {
    return Object.keys(src).reduce((acc, key) => {
      if (func(src[key], key, context)) {
        acc[key] = src[key];
      }

      return acc;
    }, {});
  }

  function groupBy(func, src, context) {
    if (Array.isArray(src)) {
      throw new Error('groupBy only works on objects');
    }

    return Object.keys(src).reduce((acc, key) => {
      const newKey = func(src[key], key, context);
      acc[newKey] = acc[newKey] || {};
      acc[newKey][key] = src[key];
      return acc;
    }, {});
  }

  function mapKeys(func, src, context) {
    return Object.keys(src).reduce((acc, key) => {
      const newKey = func(src[key], key, context);
      acc[newKey] = src[key];
      return acc;
    }, {});
  }

  function map(func, src, context) {
    return src.map((val, key) => func(val, key, context));
  }

  function any(func, src, context) {
    return src.some((val, key) => func(val, key, context));
  }

  function filter(func, src, context) {
    return src.filter((val, key) => func(val, key, context));
  }

  function anyValues(func, src, context) {
    return Object.keys(src).some(key => func(src[key], key, context));
  }

  function keyBy(func, src, context) {
    return src.reduce((acc, val, key) => {
      acc[func(val, key, context)] = val;
      return acc;
    }, {});
  }

  function keys(src) {
    return Array.from(Object.keys(src));
  }

  function values(src) {
    return Array.from(Object.values(src));
  }

  function assign(src) {
    return Object.assign({}, ...src);
  }

  function size(src) {
    return Array.isArray(src) ? src.length : Object.keys(src).length;
  }

  function range(end, start = 0, step = 1) {
    const res = [];

    for (let val = start; step > 0 && val < end || step < 0 && val > end; val += step) {
      res.push(val);
    }

    return res;
  }

  function defaults(src) {
    return Object.assign({}, ...[...src].reverse());
  }

  function loopFunction(resolved, res, func, src, context, key) {
    if (!resolved[key]) {
      resolved[key] = true;
      res[key] = func(src[key], key, context, loopFunction.bind(null, resolved, res, func, src, context));
    }

    return res[key];
  }

  function sum(src) {
    return src.reduce((sum, val) => sum + val, 0);
  }

  function flatten(src) {
    return [].concat(...src);
  }

  function recursiveMap(func, src, context) {
    const res = [];
    const resolved = src.map(x => false);
    src.forEach((val, key) => {
      loopFunction(resolved, res, func, src, context, key);
    });
    return res;
  }

  function recursiveMapValues(func, src, context) {
    const res = {};
    const resolved = {};
    Object.keys(src).forEach(key => resolved[key] = false);
    Object.keys(src).forEach(key => {
      loopFunction(resolved, res, func, src, context, key);
    });
    return res;
  }

  const objBuilder = (path, value) => {
    let retVal = value
    return path.slice().reverse().reduce((acc, v) => {
      const p = {[v]: acc}
      return p
    }, value)
  }

  let timeMachineHolder = []
  function set(path, value) {
    console.log(path.join(','), value)
    timeMachineHolder.push(objBuilder(path, value))
    ensurePath(path);
    applySetter(getAssignableObject(path, path.length - 1), path[path.length - 1], value);
  }

  function splice(pathWithKey, len, ...newItems) {
    ensurePath(pathWithKey);
    const key = pathWithKey[pathWithKey.length - 1];
    const path = pathWithKey.slice(0, pathWithKey.length - 1);
    const arr = getAssignableObject(path, path.length);
    arr.splice(key, len, ...newItems);
  }


    function isBlocked$0(val, key, context) {
    return ((val)&&(!($model["todos"][val]["done"])));
  }

function isBlocked$7(val, key, context) {
    return val["blockedBy"];
  }

function $isBlocked() {
    return mapValues(isBlocked$0, mapValues(isBlocked$7, $model["todos"], null), null);
  }

function isBlocked205(val, key, context) {
    return val["done"];
  }

function isBlocked20(val, key, context) {
    return ((val)&&(!(mapValues(isBlocked205, $model["todos"], null)[val])));
  }

function isBlocked$7(val, key, context) {
    return val["blockedBy"];
  }

function $isBlocked2() {
    return mapValues(isBlocked20, mapValues(isBlocked$7, $model["todos"], null), null);
  }

function isBlocked38$21(val, key, context) {
    return !(val["done"]);
  }

function isBlocked38(val, key, context) {
    return filterBy(isBlocked38$21, $model["todos"], null)[val];
  }

function isBlocked$7(val, key, context) {
    return val["blockedBy"];
  }

function $isBlocked3() {
    return mapValues(isBlocked38, mapValues(isBlocked$7, $model["todos"], null), null);
  }

function isBlocked$7(val, key, context) {
    return val["blockedBy"];
  }

function $blockedBy() {
    return mapValues(isBlocked$7, $model["todos"], null);
  }

function isBlocked205(val, key, context) {
    return val["done"];
  }

function canBeWorkedOn$25(val, key, context) {
    return ((!(val["done"]))&&(((!(val["blockedBy"]))||(mapValues(isBlocked205, $model["todos"], null)[val["blockedBy"]]))));
  }

function $canBeWorkedOn() {
    return mapValues(canBeWorkedOn$25, $model["todos"], null);
  }

function isBlocked205(val, key, context) {
    return val["done"];
  }

function canBeWorkedOn$25(val, key, context) {
    return ((!(val["done"]))&&(((!(val["blockedBy"]))||(mapValues(isBlocked205, $model["todos"], null)[val["blockedBy"]]))));
  }

function isBlocked38$21(val, key, context) {
    return !(val["done"]);
  }

function $shownTodo() {
    return (((($model["showCompleted"])&&(mapValues(canBeWorkedOn$25, $model["todos"], null))))||(filterBy(isBlocked38$21, $model["todos"], null)));
  }

function isBlocked38$21(val, key, context) {
    return !(val["done"]);
  }

function $pendingTodos() {
    return filterBy(isBlocked38$21, $model["todos"], null);
  }

function blockedGrouped$38$40(val, key, context) {
    return (val["blockedBy"]) === (context);
  }

function blockedGrouped$38(val, key, context) {
    return filterBy(blockedGrouped$38$40, $model["todos"], key);
  }

function isBlocked38$21(val, key, context) {
    return !(val["done"]);
  }

function $blockedGrouped() {
    return mapValues(blockedGrouped$38, filterBy(isBlocked38$21, $model["todos"], null), null);
  }


    let $inBatch = false;
    let $batchPending = [];
    let $inRecalculate = false;

    function recalculate() {
      if ($inBatch) {
        return;
      }

      $inRecalculate = true;
      $res.isBlocked =  $isBlocked();
$res.isBlocked2 =  $isBlocked2();
$res.isBlocked3 =  $isBlocked3();
$res.blockedBy =  $blockedBy();
$res.canBeWorkedOn =  $canBeWorkedOn();
$res.shownTodo =  $shownTodo();
$res.pendingTodos =  $pendingTodos();
$res.blockedGrouped =  $blockedGrouped();

      /* RESET */

      $listeners.forEach(callback => callback());
      $inRecalculate = false;

      if ($batchPending.length) {
        $res.$endBatch();
      }

      if (/* DEBUG */true) {
        snapShot();
      }
    }

    function ensurePath(path) {
      if (path.length < 2) {
        return;
      }

      if (path.length > 2) {
        ensurePath(path.slice(0, path.length - 1));
      }

      const lastObjectKey = path[path.length - 2];
      const assignable = getAssignableObject(path, path.length - 2);

      if (assignable[lastObjectKey]) {
        return;
      }

      const lastType = typeof path[path.length - 1];
      assignable[lastObjectKey] = lastType === 'number' ? [] : {};
    }

    function getAssignableObject(path, index) {
      return path.slice(0, index).reduce((agg, p) => agg[p], $model);
    }

    function push(path, value) {
      ensurePath([...path, 0]);
      const arr = getAssignableObject(path, path.length);
      splice([...path, arr.length], 0, value);
    }

    function applySetter(object, key, value) {
      if (typeof value === 'undefined') {
        delete object[key];
      } else {
        object[key] = value;
      }
    }

    function $setter(func, ...args) {
      if ($inBatch || $inRecalculate || $batchingStrategy) {
        if (!$inBatch && !$inRecalculate && $batchingStrategy) {
          $batchingStrategy.call($res);
          $inBatch = true;
        }

        $batchPending.push({
          func,
          args
        });
      } else {
        func.apply($res, args);
        recalculate();
      }
    }

    Object.assign($res, {
      setTodo: $setter.bind(null, (arg0,...additionalArgs) => set(["todos",arg0], ...additionalArgs)),setShowCompleted: $setter.bind(null, (...additionalArgs) => set(["showCompleted"], ...additionalArgs)),setCurrentTask: $setter.bind(null, (...additionalArgs) => set(["currentTask"], ...additionalArgs))
    }, {
      $startBatch: () => {
        $inBatch = true;
      },
      $endBatch: () => {
        $inBatch = false;

        if ($batchPending.length) {
          $batchPending.forEach(({
            func,
            args
          }) => {
            func.apply($res, args);
          });
          $batchPending = [];
          recalculate();
        }
      },
      $runInBatch: func => {
        $res.$startBatch();
        func();
        $res.$endBatch();
      },
      $addListener: func => {
        $listeners.add(func);
      },
      $removeListener: func => {
        $listeners.delete(func);
      },
      $setBatchingStrategy: func => {
        $batchingStrategy = func;
      }
    });

    if (/* DEBUG */true) {
      Object.assign($res, {
        $ast: () => {
          return ;
        },
        $source: () => null,
        timeMachine
      });
    }

    recalculate();
    return $res;
  }

        }())
