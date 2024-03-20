function HTMLTemplateTask(task) {
    return /*html*/`<div id="task${task.createdAt}" onclick="openTask(${task.createdAt}), addAnimationRightSlideIn('boardPopUpCard')" draggable="true" ondragstart="startDragging('task${task.createdAt}')" ontouchstart="startDragging('task${task.createdAt}')" ontouchmove="drag(event)" ontouchend="drop()" class="card width250 dFlex directionColumn alignStart cursorPointer dragbox">
            <div class="pointerEventsNone" id="boardCategory${task.createdAt}">${task.category}</div>
            <div class="fontBold pointerEventsNone">${task.title}</div>
            <div class="fontGrey task-description-text pointerEventsNone" >${task.description}</div>
            <div id="subtasksBoardOverDiv${task.createdAt}" class="dFlex justBetween width100Perc">
                <div class="flex1 posRelative" onmouseout="hideDetailedProgressInformation(${task.createdAt})" onmouseover="showDetailedProgressInformation(${task.createdAt})">
                    <div class="greyProgressBarBoard posAbsolute" id="greyProgressBar${task.createdAt}"></div>
                    <div class="blueProgressBarBoard posAbsolute" id="blueProgressBar${task.createdAt}"></div>
                    <div class="moreDetailsProgressInformation d-none" id="moreDetailsProgressInformation${task.createdAt}"></div>
                </div>
                <div class="padLeft8 fontSize12" id="subtasksBoard${task.createdAt}"></div>
            </div>
            <div class="dFlex justBetween width100Perc alignCenter pointerEventsNone">
                <div class="dFlex" id="contacts${task.createdAt}"></div>
                <div id="priority${task.createdAt}"></div>
            </div>
        </div>
    `;
}

function HTMLTemplatePopUpTask(task) {
    return /*html*/`<div class="dFlex alignCenter justCenter">
            <div class="card posRelative alignStart" id="boardPopUpCard" onclick="event.stopPropagation()">
                <img onclick="closeTask()" class="posAbsolute cursorPointer closeImgBoard" src="./img/Close.png" alt="close">
                <div id="boardPopUpCategory${task.createdAt}">${task.category}</div>
                <div class="headline-board wordBreakBreakAll">${task.title}</div>
                <div>${task.description}</div>
                <div class="dFlex">
                    <span class="width100Px">Due date:</span>
                    <div id="boardPopUpDate">${task.date}</div>
                </div>
                <div id="boardPopUpPriority${task.createdAt}" class="dFlex"></div>
                <div class="width100PercMinus26Px">
                    <span>Assigned To:</span>
                    <div class="dFlex directionColumn width100Perc padTop10" id="popUpContacts${task.createdAt}"></div>
                </div>
                <div>
                    <span>Subtasks</span>
                    <div class="dFlex directionColumn marTopMinus10 padTop20" id="popUpSubtasks${task.createdAt}"></div>
                </div>
                <div class="dFlex justEnd alignCenter width100Perc fontSize14 gap6">
                    <div onclick="boardDeleteTask('${task.createdAt}')" class="dFlex cursorPointer" onmouseover="changeBoardTaskPopUpDeleteToBlue()" onmouseout="changeBoardTaskPopUpDeleteToBlack()">
                        <img id="boardTaskPopUpDeleteImg" class="height18" src="./img/delete.png" alt="dustbin">
                        <span id="boardTaskPopUpDeleteSpan" class="padLeft6">Delete</span>
                    </div>
                    <div class="lightGreyVerticalLine"></div>
                    <div class="dFlex cursorPointer width50" onclick="boardPopUpEdit('${task.createdAt}')" onmouseover="changeBoardTaskPopUpEditToBlue()" onmouseout="changeBoardTaskPopUpEditToBlack()">
                        <img id="boardTaskPopUpEditImg" class="height18" src="./img/edit-black.png" alt="pencil">
                        <span id="boardTaskPopUpEditSpan" class="padLeft6">Edit</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function HTMLTemplatePopUpContact(contact) {
    return /*html*/`<div class="dFlex alignCenter padLeft16 padTop10 padBot10 borderRadius10 hoverGrey width100Perc">
            <div class="initialsBoard" style="background-color:${contact.color}">${contact.initials}</div>
            <div class="padLeft16">${contact.firstName} ${contact.lastName}</div>
        </div>
    `;
}

function HTMLTemplatePopUpSubtask(task, subtask, i) {
    return /*html*/`<div onclick="boardChangeSubtasksDoneOrNot('${task.createdAt}', ${i})" class="borderRadius5 padLeft16 padRight18 padTop5 padBot5 dFlex alignCenter hoverGrey cursorPointer">
            <img id="boardPopUpSubtask${task.createdAt}${i}" class="cursorPointer height20" src="./img/checkboxNotChecked.png" alt="checkbox">
            <span class="padLeft16 fontSize14">${subtask.subtask}</span>
        </div>
    `;
}

function HTMLTemplatePopUpPriority(task) {
    return /*html*/`<span class="width100Px">Priority:</span>
        <div>${task.prio} 
            <img class="padLeft6" src="./img/${task.prio}Prio.png" alt="priority">
        </div>
    `;
}

function HTMLTemplatePopUpBoardEdit(task){
    return /*html*/`<div class="dFlex alignCenter justCenter">
            <form id="popUpBoardEdit" onsubmit="processEditedTask('${task.createdAt}', event)" onclick="event.stopPropagation(), closeAssignedToDiv()" class="card posRelative alignStart">
                <img onclick="closeTask()" class="posAbsolute cursorPointer closeImgBoard" src="./img/Close.png" alt="close">
                <div class="dFlex directionColumn padTop35 width100Perc">
                    <label for="boardPopUpInputTitle" class="padBot5">Title</label>
                    <input required id="boardPopUpInputTitle" class="inputBoardEdit focusBlueBorder" value="${task.title}" type="text">
                </div>
                <div class="dFlex directionColumn width100Perc">
                    <label for="boardPopUpInputDescription" class="padBot5">Description</label>
                    <textarea id="boardPopUpInputDescription" class="inputBoardEdit focusBlueBorder" type="text" cols="10" rows="3">${task.description}</textarea>
                </div>
                <div class="dFlex directionColumn width100Perc">
                    <label for="boardPopUpInputDate" class="padBot5">Due date</label>
                    <div class="posRelative cursorPointer">
                        <input required id="boardPopUpInputDate" value="${task.date}" pattern="([0][1-9]|[1][0-9]|3[01]|[2][0-9])/([0][1-9]|[1][0-2])/([2][0][2][4-8])" placeholder="dd/mm/yyyy" class="inputBoardEdit width100PercMinus26Px focusBlueBorder" type="text">
                        <img onclick="focusOn('boardPopUpInputDate')" class="posAbsolute height17 top7 right7" src="./img/event.png" alt="calendar">
                    </div>
                </div>
                <div class="dFlex directionColumn width100Perc">
                    <div class="padBot5">Priority</div>
                    <div class="dFlex gap5">
                        <div id="boardPopUpEditUrgentBtn" class="cursorPointer boardPrioBtn" onclick="changePrioBtn('urgent', '${task.createdAt}')">Urgent <img src="./img/urgentPrio.png" alt="urgent"></div>
                        <div id="boardPopUpEditMediumBtn" class="cursorPointer boardPrioBtn marLeft15" onclick="changePrioBtn('medium', '${task.createdAt}')">Medium <img class="marBot2" src="./img/mediumPrio.png" alt="medium"></div>
                        <div id="boardPopUpEditLowBtn" class="cursorPointer boardPrioBtn marLeft15" onclick="changePrioBtn('low', '${task.createdAt}')">Low <img src="./img/lowPrio.png" alt="low"></div>
                    </div>
                </div>
                <div class="dFlex directionColumn width100Perc">
                    <div class="padBot5">Assigned to</div>
                    <div onclick="event.stopPropagation()" id="boardPopUpSelectContactsToAssignDiv" class="posRelative">
                        <div onclick="boardEditTaskAssignContacts('${task.createdAt}')" class="inputBoardEdit cursorPointer">Select contacts to assign</div>
                        <img class="posAbsolute top15 right15" src="./img/selectionToOpen.png" alt="close selection">
                    </div>
                    <div onclick="event.stopPropagation()" class="marRight28 d-none posRelative">
                        <input onclick="event.stopPropagation()" onclick="closeBoardEditTaskContacts()" onkeyup="boardEditTaskSearchContacts('${task.createdAt}')" id="boardPopUpSelectContactsInput" class="inputBoardEdit width100Perc focusBlueBorder" type="text">
                        <div onclick="closeBoardEditTaskContacts()" class="dFlex justCenter alignCenter posAbsolute top0 rightMinus26 height33 width33 cursorPointer">
                            <img src="./img/selectionToClose.png" alt="open selection">
                        </div>
                    </div>
                    <div onclick="event.stopPropagation()" class="dFlex directionColumn padBot5 padTop5 gap1 d-none" id="boardPopUpSelectContacts"></div>
                    <div class="dFlex padTop5" id="boardPopUpEditColorfulContacts${task.createdAt}"></div>
                </div>
                <div class="dFlex directionColumn width100Perc">
                    <label for="boardPopUpInputSubtasks" class="padBot5">Subtasks</label>
                    <div class="posRelative marRight28 cursorPointer">
                        <input placeholder="Add new subtask" id="boardPopUpInputSubtasks" onkeydown="addSubtaskOnEnter(event, ${task.createdAt})" class="inputBoardEdit width100Perc focusBlueBorder" type="text">
                        <div id="boardPopUpInputSubtasksImg" class="posAbsolute dFlex justCenter alignCenter height33 width33 rightMinus26 top0">
                            <img onclick="focusOnInputOrAddSubtask('${task.createdAt}')" class="height10" src="./img/add-2.png" alt="plus">
                        </div>
                    </div>
                    <div class="dFlex directionColumn gap5 padTop5" id="boardPopUpAllSubtasks"></div>
                </div>
                <div class="dFlex justEnd width100Perc">
                    <button id="editingTaskSaveButton" class="darkBtn cursorPointer fontBold">Ok <img class="padLeft2 height10" src="./img/check.png" alt="check"></button>
                </div>
            </form>
        </div>
    `;
}

function HTMLTemplatePopUpBoardEditSelectContacts(contact, task, search) {
    return /*html*/`<div onclick="boardEditTaskAddOrRemoveContact(${contact.createdAt}, '${task.createdAt}', ${search})" class="dFlex justBetween alignCenter hoverGrey borderRadius5 padTop5 padBot5">
            <div class="dFlex alginCenter">
                <div style="background: ${contact.color}" class="initialsBoard marLeft10 marRight10">${contact.initials}</div> 
                <div class="dFlex alignCenter">${contact.firstName} ${contact.lastName}</div> 
            </div>
            <img id="boardEditTaskContactsCheckbox${contact.createdAt}" class="height20 marRight10" src="./img/checkboxNotChecked.png" alt="checkbox">
        </div>
    `;
}

function HTMLTemplatePopUpBoardEditSubtasks(i, subtask, task) {
    return /*html*/`<div ondblclick="editEditTaskSubtask(${i}, '${task.createdAt}')" id="editTaskSubtaskParent${i}" onmouseout="hideImgSubtasksDeleteAndEdit(${i})" onmouseover="showImgSubtasksDeleteAndEdit(${i})" class="height17 hoverGrey padBot5 borderRadius10 padTop5 dFlex alignCenter justBetween">
            <li class="fontSize12 padLeft16 cursorPointer">${subtask.subtask}</li>
            <div id="editTaskSubtask${i}" class="dFlex directionRow padRight10 d-none">
                <img onclick="editEditTaskSubtask(${i}, '${task.createdAt}')" class="height17" src="./img/edit-black.png" alt="edit">
                <div class="greyVerticalLineSubtasks17 marLeft3"></div>
                <img onclick="deleteEditTaskSubtask(${i}, '${task.createdAt}')" class="height17 marLeft3" src="./img/delete.png" alt="delete">
            </div>
        </div>
    `;
}

function HTMLTemplatePopUpBoardEditSubtasksEdit(i, taskCreatedAt) {
    return /*html*/`<input onfocus="setBlueBorderBottom(${i})" onfocusout="removeBlueBorderBottom(${i})" id="editEditSubtaskInput${i}" class="editEditSubtaskInput padLeft16" value="${editTaskSubtasks[i].subtask}">
        <div class="dFlex directionRow padRight10 alignCenter">
            <img onclick="deleteEditTaskSubtask(${i}, ${taskCreatedAt})" class="height17 cursorPointer" src="./img/delete.png" alt="delete">
            <div class="greyVerticalLineSubtasks17 marLeft3"></div>
            <img onclick="editEditSubtaskInputValue(${i}, '${taskCreatedAt}')" class="height10 marLeft6 cursorPointer" src="./img/checkBlack.png" alt="check">
        </div>
    `;
}

// function HTMLTemplateAddTask() {
//     return /*html*/`
// `;
// }