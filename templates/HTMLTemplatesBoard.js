function HTMLTemplateTask(task) {
    return /*html*/`<div id="task${task.createdAt}" onclick="openTask(${task.createdAt})" draggable="true" ondragstart="startDragging('task${task.createdAt}')" class="card dFlex directionColumn alignStart cursorPointer">
            <div id="boardCategory${task.createdAt}">${task.category}</div>
            <div class="fontBold">${task.title}</div>
            <div class="fontGrey" >${task.description}</div>
            <div id="subtasksBoardOverDiv${task.createdAt}" class="dFlex justBetween width100Perc">
                <div class="flex1 posRelative">
                    <div class="greyProgressBarBoard posAbsolute" id="greyProgressBar${task.createdAt}"></div>
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

function HTMLTemplatePopUpTask(task) {
    return /*html*/`<div class="dFlex alignCenter justCenter">
            <div class="card posRelative alignStart">
                <img onclick="closeTask()" class="posAbsolute cursorPointer closeImgBoard" src="./img/Close.png" alt="close">
                <div id="boardPopUpCategory${task.createdAt}">${task.category}</div>
                <div class="headline">${task.title}</div>
                <div>${task.description}</div>
                <div class="dFlex">
                    <span class="width100Px">Due date:</span>
                    <div>${task.date}</div>
                </div>
                <div class="dFlex">
                    <span class="width100Px">Priority:</span>
                    <div>${task.prio} <img class="padLeft6" src="./img/${task.prio}Prio.png" alt="priority"></div>
                </div>
                <span>Assigned To:</span>
                <div class="gap20 dFlex directionColumn" id="popUpContacts${task.createdAt}"></div>
                <span>Subtasks</span>
                <div class="padLeft16 gap10 dFlex directionColumn marTopMinus10" id="popUpSubtasks${task.createdAt}"></div>
                <div class="dFlex justEnd alignCenter width100Perc fontSize14 gap6">
                    <div class="dFlex cursorPointer" onmouseover="changeBoardTaskPopUpDeleteToBlue()" onmouseout="changeBoardTaskPopUpDeleteToBlack()">
                        <img id="boardTaskPopUpDeleteImg" class="height18" src="./img/delete.png" alt="dustbin">
                        <span id="boardTaskPopUpDeleteSpan" class="padLeft6">Delete</span>
                    </div>
                    <div class="lightGreyVerticalLine"></div>
                    <div class="dFlex cursorPointer width50" onmouseover="changeBoardTaskPopUpEditToBlue()" onmouseout="changeBoardTaskPopUpEditToBlack()">
                        <img id="boardTaskPopUpEditImg" class="height18" src="./img/edit-black.png" alt="pencil">
                        <span id="boardTaskPopUpEditSpan" class="padLeft6">Edit</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function HTMLTemplatePopUpContact(contact) {
    return /*html*/`<div class="dFlex alignCenter padLeft16">
            <div class="initialsBoard" style="background-color:${contact.color}">${contact.initials}</div>
            <div class="padLeft16">${contact.firstName} ${contact.lastName}</div>
        </div>
    `;
}

function HTMLTemplatePopUpSubtask(subtask) {
    return /*html*/`<div class="dFlex alignCenter">
            <img class="cursorPointer height20" src="./img/checkboxNotChecked.png" alt="checkbox">
            <span class="padLeft16 fontSize14">${subtask.subtask}</span>
        </div>
    `;
}