function HTMLTemplateAddTaskEditSubtasks(i, subtask) {
    return /*html*/`<div ondblclick="addTaskEditTaskSubtask(${i})" id="addTaskSubtaskParent${i}" onmouseout="hideImgSubtasksDeleteAndEdit(${i})" onmouseover="showImgSubtasksDeleteAndEdit(${i})" class="cursorPointer height17 hoverGrey padBot5 borderRadius10 padTop5 dFlex alignCenter justBetween">
            <li class="fontSize12 padLeft16 cursorPointer">${subtask.subtask}</li>
            <div id="editTaskSubtask${i}" class="dFlex directionRow padRight10 d-none">
                <img onclick="addTaskEditTaskSubtask(${i})" class="height17" src="./img/edit-black.png" alt="edit">
                <div class="greyVerticalLineSubtasks17 marLeft3"></div>
                <img onclick="deleteAddTaskSubtask(${i})" class="height17 marLeft3" src="./img/delete.png" alt="delete">
            </div>
        </div>
    `;
}
function HTMLTemplateAddTaskEditSubtasksEdit(i) {    
    return /*html*/`<input onfocus="addTaskSetBlueBorderBottom(${i})" onfocusout="addTaskRemoveBlueBorderBottom(${i})" id="editEditSubtaskInput${i}" class="editEditSubtaskInput padLeft16" value="${addTasksSubtasks[i].subtask}">
        <div class="dFlex directionRow padRight10 alignCenter">
            <img onclick="deleteAddTaskSubtask(${i})" class="height17 cursorPointer" src="./img/delete.png" alt="delete">
            <div class="greyVerticalLineSubtasks17 marLeft3"></div>
            <img onclick="addTaskEditSubtaskInputValue(${i})" class="height10 marLeft6 cursorPointer" src="./img/checkBlack.png" alt="check">
        </div>
    `;
}