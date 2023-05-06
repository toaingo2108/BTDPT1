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
        $sql = "SELECT * FROM TASK ORDER BY id DESC";
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

    // public function addToDo($task)
    // {
    //     $stmt = $this->db->prepare('INSERT INTO todos (task) values (:task)');
    //     $stmt->bindValue(':task', $task);
    //     $stmt->execute();
    // }
}
