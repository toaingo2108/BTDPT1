<?php

class CategoryModel
{
    private $db;

    public function __construct()
    {
        $this->db = new PDO('mysql:host=127.0.0.1;dbname=TaskManagementDB', 'root', '210801');
    }

    public function getAllCategories()
    {
        $sql = "SELECT * FROM CATEGORY ORDER BY id DESC;";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
}
