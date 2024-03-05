function HTMLTemplateTask(task) {
    return /*html*/`<div id="task${task.createdAt}" draggable="true" ondragstart="startDragging('task${task.createdAt}')" class="card dFlex directionColumn alignStart">
            <div id="boardCategory${task.createdAt}">${task.category}</div>
            <div>${task.title}</div>
            <div>${task.description}</div>
            <div class="dFlex">
                <div id="progressBar${task.createdAt}"></div>
                <div>0/${task.subtasks.length} Subtasks</div>
            </div>
            <div class="dFlex">
                <div id="contacts${task.createdAt}"></div>
                <div id="priority${task.createdAt}"></div>
            </div>
        </div>
    `;
}