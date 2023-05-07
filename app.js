$(document).ready(() => {
  // getTodos();

  // $("#todo-form").submit((e) => todoFormSubmit(e));

  // Lấy danh sách tasks
  $("#tasks-table").ready(() => {
    getTasks();
    // Lắng nghe sự kiện nhấn xóa nhiều task
    $("#deleteManyTasksBtn").click(handleDeleteManyTasks);

    $("#select-all").click(toggleCheckAllDelete);
  });
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
    success: (data) => {
      const tasks = JSON.parse(data);
      $("#tasks-table tbody").empty();
      $.each(tasks, (index, task) => {
        const row = `
        <tr>
          <td>
            <div class="form-check">
              <input type="checkbox" class="form-check-input" name="deleteManyTask" value="${
                task.id
              }">
            </div>
          </td>
          <td>${task.id}</td>
          <td>${task.name}</td>
          <td>${task.description}</td>
          <td>${task.categoryName}</td>
          <td>${task.start_date}</td>
          <td>${task.due_date}</td>
          <td>${!!task.status ? task.status : "..."}</td>
          <td>${!!task.finished_date ? task.finished_date : "..."}</td>
          <td>
            <div class='d-flex p-2'>
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

  const idsToDelete = $('input[name="deleteManyTask"]:checked')
    .map((index, element) => {
      return $(element).val();
    })
    .get()
    .map((id) => parseInt(id));

  if (idsToDelete.length === 0) return;

  if (
    !window.confirm(
      "Bạn có muốn xóa các công việc: [" + idsToDelete.join(",") + "]"
    )
  ) {
    return;
  }

  console.log(idsToDelete);

  $.ajax({
    url: "../controllers/TaskController.php",
    type: "POST",
    data: { ids: idsToDelete, action: "deleteManyTasks" },
    success: (data) => {
      getTasks();
      $("#select-all").prop("checked", false);
    },
    error: (xhr, status, error) => {
      console.error(error);
    },
  });
};

const toggleCheckAllDelete = () => {
  const isChecked = $("#select-all").prop("checked");
  console.log(isChecked);
  $('input[name="deleteManyTask"]').prop("checked", isChecked);
};
