<?php

class TaskModel
{
    private $db;

    public function __construct()
    {
        $this->db = new PDO('mysql:host=127.0.0.1;dbname=TaskManagementDB', 'root', '210801');
    }

    public function getAllTasks()
    {
        $sql = "SELECT t.*, c.name as categoryName FROM TASK t, CATEGORY c 
                WHERE t.category_id = c.id
                ORDER BY t.id DESC;";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function getById($id)
    {
        $sql = "SELECT t.*, c.name as categoryName FROM TASK t, CATEGORY c 
                WHERE t.category_id = c.id AND t.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function destroy(array $ids)
    {
        $sql = "DELETE FROM TASK WHERE id = ?";
        foreach ($ids as $id) {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
        }
    }

    public function create($name, $description, $start_date, $due_date, $category_id)
    {
        $sql =  'INSERT INTO 
                TASK (name, description, start_date, due_date, category_id, status) 
                values  (:name, :description, :start_date, :due_date, :category_id, "TODO")';
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':start_date', $start_date);
        $stmt->bindValue(':due_date', $due_date);
        $stmt->bindValue(':category_id', $category_id);
        $stmt->execute();
    }

    public function update($id, $name, $description, $start_date, $due_date, $finished_date, $category_id, $status)
    {
        $sql = 'UPDATE TASK 
                SET name = :name, 
                    description = :description, 
                    start_date = :start_date, 
                    due_date = :due_date, 
                    finished_date = :finished_date, 
                    category_id = :category_id, 
                    status = :status 
                WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':start_date', $start_date);
        $stmt->bindValue(':due_date', $due_date);
        $stmt->bindValue(':finished_date', $finished_date);
        $stmt->bindValue(':category_id', $category_id);
        $stmt->bindValue(':status', $status);
        $stmt->execute();
    }
}
