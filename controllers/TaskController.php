<?php

require_once '../models/TaskModel.php';

class TaskController
{
    private $model;

    public function __construct()
    {
        $this->model = new TaskModel();
    }

    public function getAllTasks()
    {
        $tasks = $this->model->getAllTasks();
        echo json_encode($tasks);
    }

    public function deleteManyTasks()
    {
        $ids = $_POST['ids'];
        $this->model->destroy($ids);
        echo 'Tasks deleted successfully';
    }

    public function addTask()
    {
        $name = $_POST['name'];
        $description = $_POST['description'];
        $start_date = $_POST['start_date'];
        $due_date = $_POST['due_date'];
        $category_id = $_POST['category_id'];

        if (
            !isset($name) ||
            !isset($description) ||
            !isset($start_date) ||
            !isset($due_date) ||
            !isset($category_id) ||
            empty($name) ||
            empty($description) ||
            empty($start_date) ||
            empty($due_date) ||
            empty($category_id)
        ) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Please complete all information']);
            exit;
        }

        $this->model->create(
            $name,
            $description,
            $start_date,
            $due_date,
            $category_id
        );
        echo 'Task create successfully';
    }

    public function getTaskById()
    {
        $id = $_GET['id'];
        if (empty($id) || !isset($id)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Task ID invalid!']);
            exit;
        }

        $task = $this->model->getById($id);

        if (!isset($task)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Task not found!']);
            exit;
        }

        echo json_encode($task);
    }

    public function updateStatusTask()
    {
        $id = $_POST['id'];
        $status = $_POST['status'];

        if (empty($id) || !isset($id)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Task ID invalid!']);
            exit;
        }

        $task = $this->model->getById($id);

        if (!isset($task)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Task not found!']);
            exit;
        }

        $finished_date = null;

        if (empty($status) || !isset($status) || $status == 'TODO') {
            $status = 'IN PROGRESS';
        } else {
            $status = 'FINISHED';
            $finished_date = date('Y-m-d H:i:s'); // Current date and time
        }

        $this->model->update(
            $task['id'],
            $task['name'],
            $task['description'],
            $task['start_date'],
            $task['due_date'],
            $finished_date,
            $task['category_id'],
            $status
        );

        echo 'Task updated successfully.';
    }

    public function updateTask()
    {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $start_date = $_POST['start_date'];
        $due_date = $_POST['due_date'];
        $category_id = $_POST['category_id'];

        $task = $this->model->getById($id);

        if (
            !isset($name) ||
            !isset($description) ||
            !isset($start_date) ||
            !isset($due_date) ||
            !isset($category_id) ||
            empty($name) ||
            empty($description) ||
            empty($start_date) ||
            empty($due_date) ||
            empty($category_id)
        ) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Please complete all information']);
            exit;
        }

        $this->model->update(
            $id,
            $name,
            $description,
            $start_date,
            $due_date,
            $task['finished_date'],
            $category_id,
            $task['status']
        );
    }
}

$controller = new TaskController();

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
        case 'getAllTasks':
            $controller->getAllTasks();
            break;
        case 'deleteManyTasks':
            $controller->deleteManyTasks();
            break;
        case 'addTask':
            $controller->addTask();
            break;
        case 'updateStatusTask':
            $controller->updateStatusTask();
            break;
        case 'updateTask':
            $controller->updateTask();
            break;
        case 'getTaskById':
            $controller->getTaskById();
            break;
        default:
            http_response_code(500);
            echo 'Error: Action not matched';
            break;
    }
}
