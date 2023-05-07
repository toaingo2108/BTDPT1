<section>
    <div id='tasks-header' class="d-flex align-items-center justify-content-between">
        <h4 class="my-4">Loại công việc</h4>
    </div>
    <form class="d-flex align-items-center">
        <input type="text" id='category-new'>
        <button id='deleteManyTasksBtn' type="submit" class="btn btn-primary btn-sm ml-2" onclick="handleCreateCategory(event)">Thêm</button>
    </form>
    <ul id='categories-list' class='mt-4'>
        <!-- Fill data -->
    </ul>
</section>