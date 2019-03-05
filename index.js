const countItems = 6;

const random = i => Math.floor(Math.random() * i)
function randomTodoItem(idx) {
  return {
    text: `todo_${idx}`,
    done: random(2) === 0,
    blockedBy: random(4) === 2 ? `${(idx + random(countItems - 1)) % countItems}` : false
  };
}

function generateTestTodoItems(count) {
  const res = {};
  for (let idx = 0; idx < count; idx++) {
    res[`${idx}`] = randomTodoItem(idx);
  }
  return res;
}
const initialState = {
  todos: generateTestTodoItems(countItems),
  currentTask: '1',
  showCompleted: false
};
var carmiInstance = model(initialState)

// // debugger
// carmiInstance.setShowCompleted(1)
// carmiInstance.setShowCompleted(2)
// carmiInstance.setShowCompleted(3)
// carmiInstance.setTodo({
//     text: 'outOfBatch',
//     done: true,
//     blockedBy: false
// })

// carmiInstance.setTodo('30', {
//     text: 'insideOfBatch',
//     done: false,
//     blockedBy: 1
// })
// // debugger
// carmiInstance.$startBatch()
// carmiInstance.setShowCompleted(4)
// carmiInstance.setShowCompleted(5)
// carmiInstance.setShowCompleted(6)
// carmiInstance.setTodo('30', {
//     text: 'insideOfBatch',
//     done: false,
//     blockedBy: 1
// })
// carmiInstance.setTodo('mashebalecha', {
//     text: 'insideOfBatch2',
//     done: true,
//     blockedBy: false
// })
// carmiInstance.$endBatch()
