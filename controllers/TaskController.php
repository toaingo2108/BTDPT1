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
        default:
            http_response_code(500);
            echo 'Error: Action not matched';
            break;
    }
}
