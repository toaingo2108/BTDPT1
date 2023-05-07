$(document).ready(() => {
  // getTodos();

  // Lấy danh sách tasks
  $("#tasks-table").ready(() => {
    getTasks();
    // Lắng nghe sự kiện nhấn xóa nhiều task
    $("#deleteManyTasksBtn").click(handleDeleteManyTasks);

    $("#select-all").click(toggleCheckAllDelete);
  });

  $("#task-form").ready(() => {
    getCategories();
  });

  $("#task-form").submit((e) => taskFormSubmit(e));
});

const taskFormSubmit = (e) => {
  e.preventDefault();
  const formData = {
    name: $("#task-form-name").val(),
    description: $("#task-form-description").val(),
    category_id: parseInt($("#task-form-category_id").val()),
    start_date: $("#task-form-start_date").val(),
    due_date: $("#task-form-due_date").val(),
  };
  console.log(formData);
  $.ajax({
    url: "../controllers/TaskController.php",
    type: "POST",
    data: { action: "addTask", ...formData },
    success: (data) => {
      console.log(data);
      // getTodos();
      $("#task-form-name").val("");
      $("#task-form-description").val("");
      $("#task-form-category_id").val("");
      $("#task-form-start_date").val("");
      $("#task-form-due_date").val("");
    },
  });
};

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

const getCategories = () => {
  $.ajax({
    url: "../controllers/CategoryController.php",
    type: "GET",
    data: { action: "getAllCategories" },
    success: (data) => {
      const categories = JSON.parse(data);
      console.log(categories);

      $("#task-form-category_id").empty();
      $.each(categories, (index, category) => {
        const option = `
        <option value="${category.id}">${category.name}</option>
        `;
        $("#task-form-category_id").append(option);
      });

      // $.each(tasks, (index, task) => {
      //   const row = `
      //   <tr>
      //     <td>
      //       <div class="form-check">
      //         <input type="checkbox" class="form-check-input" name="deleteManyTask" value="${
      //           task.id
      //         }">
      //       </div>
      //     </td>
      //     <td>${task.id}</td>
      //     <td>${task.name}</td>
      //     <td>${task.description}</td>
      //     <td>${task.categoryName}</td>
      //     <td>${task.start_date}</td>
      //     <td>${task.due_date}</td>
      //     <td>${!!task.status ? task.status : "..."}</td>
      //     <td>${!!task.finished_date ? task.finished_date : "..."}</td>
      //     <td>
      //       <div class='d-flex p-2'>
      //         <button type="button" class="btn btn-outline-info btn-sm ml-2">Update</button>
      //       </div>
      //     </td>
      //   </tr>
      //   `;
      //   $("#tasks-table tbody").append(row);
      // });
    },
  });
};
