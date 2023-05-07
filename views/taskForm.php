<section>
    <h4 class="my-4" id='task-form-header'>Tạo công việc mới</h4>
    <form id='task-form'>
        <div class="form-group">
            <label for="name">Tên</label>
            <input class="form-control" id="task-form-name" aria-describedby="nameHelp" placeholder="abc" required>
        </div>
        <div class="form-group">
            <label for="task-form-description">Mô tả</label>
            <textarea class="form-control" id="task-form-description" rows="3" required></textarea>
        </div>
        <div class="form-group">
            <label for="category_id">Example select</label>
            <select class="form-control" id="task-form-category_id" required>
                <!-- Get categories -->
            </select>
        </div>
        <div class="form-group">
            <label for="task-form-start_date">Bắt đầu</label>
            <input type="datetime-local" class="form-control" id="task-form-start_date" aria-describedby="start_dateHelp" placeholder="" required>
        </div>
        <div class="form-group">
            <label for="task-form-due_date">Ngày hạn</label>
            <input type="datetime-local" class="form-control" id="task-form-due_date" aria-describedby="start_dateHelp" placeholder="" required>
        </div>

        <button type="submit" class="btn btn-primary btn-lg btn-block mt-4" id='task-form-btn-submit'>Tạo</button>
    </form>
</section>