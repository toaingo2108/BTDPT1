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

    public function createCategory()
    {
        $name = $_POST['name'];
        $categories = $this->model->getAllCategories();
        $category_names = array_column($categories, 'name');
        if (in_array($name, $category_names)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Category already exists!']);
            exit;
        }

        $this->model->create($name, date('Y-m-d H:i:s'));
        echo 'Category created successfully';
    }

    public function deleteCategory()
    {
        $id = $_POST['id'];

        $categories = $this->model->getAllCategories();
        $category_id = array_column($categories, 'id');
        if (!in_array($id, $category_id)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Category not exists!']);
            exit;
        }

        $this->model->destroy([$id]);
        echo 'Category deleted successfully';
    }
}

$controller = new CategoryController();

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
        case 'getAllCategories':
            $controller->getAllCategories();
            break;
        case 'createCategory':
            $controller->createCategory();
            break;
        case 'deleteCategory':
            $controller->deleteCategory();
            break;
        default:
            http_response_code(500);
            echo 'Error: Action not matched';
            break;
    }
}
