$(document).ready(() => {
  const urlParams = getParams(window.location.href);
  const page = urlParams.page;
  const id = urlParams.id;

  $("#search-form").submit((e) => handleSearch(e));

  if (page == "list") {
    // Lấy danh sách tasks
    $("#tasks-table").ready(() => {
      getTasks();
      // Lắng nghe sự kiện nhấn xóa nhiều task
      $("#deleteManyTasksBtn").click(handleDeleteManyTasks);

      $("#select-all").click(toggleCheckAllDelete);
    });
  }

  if (page == "taskForm") {
    $("#task-form").ready(() => {
      if (id) {
        handleFillDataTaskUpdate(id);
      }

      getCategories();

      $("#task-form-start_date").on("change", function () {
        const startDateValue = $(this).val();
        $("#task-form-due_date").attr("min", startDateValue);
      });

      $("#task-form-due_date").on("change", function () {
        const dueDateValue = $(this).val();
        $("#task-form-start_date").attr("max", dueDateValue);
      });
    });

    $("#task-form").submit((e) => taskFormSubmit(e));
  }

  if (page == "info") {
    $("#task-info").ready(handleGetTask);
  }

  if (page == "categories") {
    $("#categories-list").ready(() => {
      getCategories();
    });
  }
});

const taskFormSubmit = (e) => {
  e.preventDefault();
  const urlParams = getParams(window.location.href);
  const id = urlParams.id;
  let action = "addTask";
  const formData = {
    name: $("#task-form-name").val(),
    description: $("#task-form-description").val(),
    category_id: parseInt($("#task-form-category_id").val()),
    start_date: $("#task-form-start_date").val(),
    due_date: $("#task-form-due_date").val(),
  };
  if (id) {
    formData.id = id;
    action = "updateTask";
  }
  $.ajax({
    url: "../controllers/TaskController.php",
    type: "POST",
    data: { action, ...formData },
    success: (data) => {
      $("#task-form-name").val("");
      $("#task-form-description").val("");
      $("#task-form-category_id").val("");
      $("#task-form-start_date").val("");
      $("#task-form-due_date").val("");
      getTasks();
      window.location.href = `${window.location.pathname}?page=list`;
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const handleSearch = (e) => {
  e.preventDefault();
  getTasks();
};

const getTasks = () => {
  let searchText = $("#search-text").val();
  if (searchText == null || searchText == "") {
    searchText = "%";
  }
  $.ajax({
    url: "../controllers/TaskController.php",
    type: "GET",
    data: { action: "getAllTasks", searchText },
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
          <td>
            <button type="button" 
            class="btn ${
              task.status == null || task.status == "TODO"
                ? "btn btn-secondary"
                : task.status == "IN PROGRESS"
                ? "btn btn-primary"
                : "btn btn-success"
            } btn-sm ml-2" 
            data-task-id="${task.id}" 
            data-task-status="${task.status}"
            onClick="handleChangeStatusTask(event)"
            >
              ${task.status || "TODO"}
            </button>
          </td>
          <td>${!!task.finished_date ? task.finished_date : "..."}</td>
          <td>
            <div class='d-flex p-2'>
              <button type="button" class="btn btn-outline-info btn-sm ml-2" onClick="handleRedirect(event)" data-task-id="${
                task.id
              }" data-page="taskForm">Update</button>
              <button type="button" class="btn btn-info btn-sm ml-2" onClick="handleRedirect(event)" data-task-id="${
                task.id
              }" data-page="info">Info</button>
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

  if (idsToDelete.length === 0) {
    return alert("Vui lòng chọn ít nhất 1 công việc");
  }

  if (
    !window.confirm(
      "Bạn có muốn xóa các công việc: [" + idsToDelete.join(",") + "]"
    )
  ) {
    return;
  }

  $.ajax({
    url: "../controllers/TaskController.php",
    type: "POST",
    data: { ids: idsToDelete, action: "deleteManyTasks" },
    success: (data) => {
      getTasks();
      $("#select-all").prop("checked", false);
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const toggleCheckAllDelete = () => {
  const isChecked = $("#select-all").prop("checked");
  $('input[name="deleteManyTask"]').prop("checked", isChecked);
};

const getCategories = () => {
  const urlParams = getParams(window.location.href);
  const page = urlParams.page;
  $.ajax({
    url: "../controllers/CategoryController.php",
    type: "GET",
    data: { action: "getAllCategories" },
    success: (data) => {
      const categories = JSON.parse(data);
      if (page == "taskForm") {
        $("#task-form-category_id").empty();
        $.each(categories, (index, category) => {
          const option = `
          <option value="${category.id}">${category.name}</option>
          `;
          $("#task-form-category_id").append(option);
        });
      } else {
        $("#categories-list").empty();
        $.each(categories, (index, category) => {
          const li = `
          <li class="d-flex w">
            ${category.name} 
            <button class="btn btn-danger btn-sm" onclick="handleDeleteCategory(event)" data-category-id="${category.id}">x</button>
          </li>
          `;
          $("#categories-list").append(li);
        });
      }
    },
  });
};

const handleChangeStatusTask = (event) => {
  const id = $(event.target).data("task-id");
  const status = $(event.target).data("task-status");
  if (status == "FINISHED") {
    return alert("Công việc đã hoàn thành!");
  }
  $.ajax({
    url: "../controllers/TaskController.php",
    type: "POST",
    data: { action: "updateStatusTask", id, status },
    success: (data) => {
      getTasks();
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const handleRedirect = (event) => {
  const id = $(event.target).data("task-id");
  const page = $(event.target).data("page");
  window.location.href = `${window.location.pathname}?page=${page}&id=${id}`;
};

const getParams = (url) => {
  const params = {};
  const parser = document.createElement("a");
  parser.href = url;
  const query = parser.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

const handleGetTask = () => {
  const urlParams = getParams(window.location.href);
  const id = urlParams.id;

  if (!id) return;

  $.ajax({
    url: "../controllers/TaskController.php",
    method: "GET",
    data: { action: "getTaskById", id: id },
    success: (response) => {
      const task = JSON.parse(response);
      console.log(response);
      const html = `
      <h2>${task.name}</h2>
        <p>${task.description}</p>
        <p>Loại: <span>${task.categoryName}</span></p>
        <p>Trạng thái: <span>${task.status || "TODO"}</span></p>
        <div>
          <div>
            Ngày bắt đầu: <span>${task.start_date}</span>
          </div>
          <div>
            Ngày hạn: <span>${task.due_date}</span>
          </div>
          <div>
            Ngày hoàn thành: <span>${task.finished_date}</span>
          </div>
        </div>
      `;
      $("#task-info").empty().append(html);
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const handleCreateCategory = (event) => {
  event.preventDefault();
  const name = $("#category-new").val();

  $.ajax({
    url: "../controllers/CategoryController.php",
    method: "POST",
    data: { action: "createCategory", name },
    success: (response) => {
      getCategories();
      $("#category-new").val("");
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const handleDeleteCategory = (event) => {
  const id = $(event.target).data("category-id");

  if (!window.confirm("Bạn có muốn xóa loại công việc này không")) {
    return;
  }

  $.ajax({
    url: "../controllers/CategoryController.php",
    method: "POST",
    data: { action: "deleteCategory", id },
    success: (response) => {
      getCategories();
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};

const handleFillDataTaskUpdate = (id) => {
  $("#task-form-header").empty().append("Cập nhật công việc");
  $("#task-form-btn-submit").empty().append("Cập nhật");

  if (!id) return;

  $.ajax({
    url: "../controllers/TaskController.php",
    method: "GET",
    data: { action: "getTaskById", id: id },
    success: (response) => {
      const task = JSON.parse(response);
      $("#task-form-name").val(task.name);
      $("#task-form-description").val(task.description);
      $("#task-form-category_id").val(task.category_id);
      $("#task-form-start_date").val(task.start_date);
      $("#task-form-due_date").val(task.due_date);
    },
    error: (xhr, status, error) => {
      // Handle error response
      if (xhr.status === 400) {
        alert(xhr.responseText);
      } else {
        alert("An error occurred: " + error);
      }
    },
  });
};
