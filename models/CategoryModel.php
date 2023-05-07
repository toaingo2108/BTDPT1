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

    public function create($name, $date_created)
    {
        $sql =  'INSERT INTO 
                CATEGORY (name, date_created) 
                values  (:name, :date_created)';
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':date_created', $date_created);
        $stmt->execute();
    }

    public function destroy($ids)
    {
        $sql = "DELETE FROM CATEGORY WHERE id = ?";
        foreach ($ids as $id) {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
        }
    }
}
