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

    public function destroy(array $ids)
    {
        $sql = "DELETE FROM TASK WHERE id = ?";
        foreach ($ids as $id) {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
        }
    }

    // public function create($task)
    // {
    //     $stmt = $this->db->prepare('INSERT INTO todos (task) values (:task)');
    //     $stmt->bindValue(':task', $task);
    //     $stmt->execute();
    // }

    public function create($name, $description, $start_date, $due_date, $category_id)
    {
        $stmt = $this->db->prepare(
            'INSERT INTO 
                TASK    (name, description, start_date, due_date, category_id) 
                values  (:name, :description, :start_date, :due_date, :category_id)'
        );
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':start_date', $start_date);
        $stmt->bindValue(':due_date', $due_date);
        $stmt->bindValue(':category_id', $category_id);
        $stmt->execute();
    }
}
