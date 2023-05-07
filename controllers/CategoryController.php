<?php

require_once '../models/CategoryModel.php';

class CategoryController
{
    private $model;

    public function __construct()
    {
        $this->model = new CategoryModel();
    }

    public function getAllCategories()
    {
        $categories = $this->model->getAllCategories();
        echo json_encode($categories);
    }
}

$controller = new CategoryController();

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
        case 'getAllCategories':
            $controller->getAllCategories();
            break;
        default:
            http_response_code(500);
            echo 'Error: Action not matched';
            break;
    }
}
