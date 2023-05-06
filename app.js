$(document).ready(() => {
  // getTodos();

  // $("#todo-form").submit((e) => todoFormSubmit(e));

  // Lấy danh sách tasks
  $("#tasks-table").ready(() => {
    getTasks();
  });

  // Lắng nghe sự kiện nhấn xóa nhiều task
  $("#deleteManyTasksBtn").click(handleDeleteManyTasks);
});
// const todoFormSubmit = (e) => {
//   e.preventDefault();
//   var task = $("#task").val();
//   $.ajax({
//     url: "../controllers/ToDoController.php",
//     type: "POST",
//     data: { action: "addTodo", task },
//     success: (data) => {
//       getTodos();
//     },
//   });
//   $("#task").val("");
// };

const getTasks = () => {
  $.ajax({
    url: "../controllers/TaskController.php",
    type: "GET",
    data: { action: "getAllTasks" },
    success: function (data) {
      const tasks = JSON.parse(data);
      console.log(tasks);
      $("#tasks-table tbody").empty();
      $.each(tasks, (index, task) => {
        const row = `
        <tr>
          <td>
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1">
            </div>
          </td>
          <td>${task.name}</td>
          <td>${task.description}</td>
          <td>${task.start_date}</td>
          <td>${task.due_date}</td>
          <td>${!!task.status ? task.status : "..."}</td>
          <td>${!!task.finished_date ? task.finished_date : "..."}</td>
          <td>
            <div class='d-flex p-2'>
              <button type="button" class="btn btn-outline-danger btn-sm">Delete</button>
              <button type="button" class="btn btn-outline-info btn-sm ml-2">Update</button>
            </div>
          </td>
        </tr>
        `;
        $("#tasks-table tbody").append(row);
      });
    },
  });
};

const handleDeleteManyTasks = (e) => {
  e.preventDefault();

  console.log(123123);
};
