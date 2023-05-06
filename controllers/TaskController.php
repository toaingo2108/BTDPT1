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

    // public function addTodo()
    // {
    //     $task = $_POST['task'];
    //     $this->model->addToDo($task);
    // }
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
        default:
            http_response_code(500);
            echo 'Error: Action not matched';
            break;
    }
}
