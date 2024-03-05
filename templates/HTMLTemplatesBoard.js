function HTMLTemplateTask(task, subtasksDone) {
    return /*html*/`<div id="task${task.createdAt}" draggable="true" ondragstart="startDragging('task${task.createdAt}')" class="card dFlex directionColumn alignStart">
            <div id="boardCategory${task.createdAt}">${task.category}</div>
            <div class="fontBold">${task.title}</div>
            <div class="fontGrey" >${task.description}</div>
            <div class="dFlex justBetween width100Perc">
                <div class="flex1 posRelative">
                    <div class="greyProgressBarBoard posAbsolute width100Perc"></div>
                    <div class="blueProgressBarBoard posAbsolute" id="blueProgressBar${task.createdAt}"></div>
                </div>
                <div class="padLeft8 fontSize12" id="subtasksBoard${task.createdAt}"></div>
            </div>
            <div class="dFlex justBetween width100Perc alignCenter">
                <div class="dFlex" id="contacts${task.createdAt}"></div>
                <div id="priority${task.createdAt}"></div>
            </div>
        </div>
    `;
}