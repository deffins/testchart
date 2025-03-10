var chart = Snap("#chart");

let thcChart = "../chronic-thc-chart.svg";
let dmChart = "../dm3.svg";

this.elements = [];
this.td = "";
this.selectedRectArray = [];

Snap.load(dmChart, onSVGLoaded);

function loadSVG() {
    let svg = chart.select("svg");
    if (svg != null) {
        let id = svg.attr().id;
        chart.children().forEach((element) => element.remove())
        if (id == "dmd") {
            Snap.load(thcChart, onSVGLoaded);
        } else {
            Snap.load(dmChart, onSVGLoaded);
        }
    } else {
        Snap.load(dmChart, onSVGLoaded);
    }

}

function onSVGLoaded(data) {
    chart.append(data);
    fixPointerEventsInSVG();
    loadPaths(); // Ielādē saglabātos ceļus
    let savedRects = loadSelectedRects();
    savedRects.forEach(rectID => {
        clickOnRect(rectID);
    });
    let chartType = chart.select("svg").attr().id;
    Snap("#" + chartType).zpd();
    Snap("#" + chartType).mouseover((event) => {
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "path") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "circle") {
            document.body.style.cursor = "pointer";
        }
    })

    if (Snap("#dmd") == null) {
        console.log("no dm diagram")
        return
    }

    Snap.selectAll("rect").forEach(function (element) {
        drawCirclesOnRect(element);
        this.elements.push(buildElementMap(element));
        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            clickOnRect(sourceGroupID);
        });
    });

    Snap.selectAll("path").forEach(function (element) {
        element.addClass("default")
    });
}



const btn2 = document.querySelector(".button2");;
btn2.addEventListener("click", loadSVG)

const btn1 = document.querySelector(".button1");
btn1.addEventListener("click", function () {
    document.getElementById("chart").replaceChildren()
    Snap.load(dmChart, onSVGLoaded)
})

const btn3 = document.querySelector(".button3");;
btn3.addEventListener("click", clearAllHighlights)


function clearAllHighlights() {
    let highlightedIDs = getAllHighlightedID()
    console.log(highlightedIDs)
    highlightedIDs.forEach((id) => {
        setElementsByState(id, 0)
        setHighLightState(id, 0)
    })

}

function getAllHighlightedID() {
    let highlighted = [];
    this.elements.find((element) => {
        if (element.highLightState > 0) {
            highlighted.push(element.id)
        }
    })
    console.log(highlighted)
    return highlighted;
}

function setElementsByState(sourceID, state) {

    let sourceRect = Snap.select("#" + sourceID).select("rect");
    let sourceLines = getLinesFromElements(sourceID, "source");
    let tagetLines = getLinesFromElements(sourceID, "target");
    let sourceLineTargets = getRectsFromElements(sourceID, "source");
    let targetLineTargets = getRectsFromElements(sourceID, "target");
    if (state == 1) {
        sourceRect.addClass("selected-out");
        switchLineClass(sourceLines, 1, "selected-out-lines");
        switchLineClass(tagetLines, 0);
        selectRects(sourceLineTargets, 1, "selected-out");
        selectRects(targetLineTargets, 0);
    } else if (state == 2) {
        sourceRect.addClass("selected-in");
        switchLineClass(sourceLines, 0);
        switchLineClass(tagetLines, 1, "selected-in-lines");
        selectRects(sourceLineTargets, 0);
        selectRects(targetLineTargets, 1, "selected-in");
    } else if (state == 3) {
        sourceRect.addClass("selected-all");
        switchLineClass(tagetLines, 0);
        switchLineClass(sourceLines, 1, "selected-all-lines");
        switchLineClass(tagetLines, 1, "selected-all-lines");
        selectRects(sourceLineTargets, 1, "selected-all");
        selectRects(targetLineTargets, 1, "selected-all");
    } else {
        sourceRect.removeClass("selected-all selected-in selected-out");
        switchLineClass(sourceLines, 0);
        switchLineClass(tagetLines, 0);
        selectRects(sourceLineTargets, 0);
        selectRects(targetLineTargets, 0);
    }

}



function connectClickedRects(lastClickedRectID) {
    for (let i = 0; i < this.selectedRectArray.length; i++) {
        let line = "";
        if (this.selectedRectArray.length > 0) {
            let clickedRectID = this.selectedRectArray[i];
            let state = rectClicked(lastClickedRectID)
            if (clickedRectID != lastClickedRectID) {
                line = getLineByRectIDs(lastClickedRectID, clickedRectID)
                if (line != "" && line != undefined) {
                    processLine(line, state)
                }
            }
        }
    }
}
function rectClicked(id) {
    let stuff = this.elements.find((element) => element.id === id)
    return stuff.clickState;
}

function processLine(lineID, state) {
    if (lineID == "") {
        return
    }
    console.log(lineID + "..." + state);
    let group = Snap.select("#" + lineID).selectAll("path");
    for (let i = 0; i < group.length; i++) {
        let path = group[i];
        let hasClone = path.hasClass("clone");
        if (hasClone) {
        } else {
            path.toggleClass("clicked", state)
        }
        console.log(path)
    }
}


function show(arr) {
    arr.forEach((id) => {
        let something = Snap.select("#" + id);
        if (something) {
            Snap.select("#" + id).remove();
        } else {
            console.log("deleted")
        }
    })
}

function clickOnRect(rectID, skipSave = false) {
    this.elements.find((element) => {
        if (element.id === rectID) {
            if (element.clickState === 0) {
                element.selectionCount += 1;
                element.clickState = 1;
                this.selectedRectArray.push(rectID);
            } else {
                element.selectionCount -= 1;
                element.clickState = 0;
                let i = this.selectedRectArray.indexOf(rectID);
                this.selectedRectArray.splice(i, 1);
            }
            processRect(element);
            console.log(element.selectionCount);
        }
    });
    connectClickedRects(rectID);
    if (!skipSave) {
        saveSelectedRects(this.selectedRectArray); // Saglabā atlasītos taisnstūrus tikai tad, ja `skipSave` ir `false`
    }
}

function processRect(element) {
    let rect = Snap.select("#" + element.id).select("rect");
    let flag = element.clickState;
    rect.toggleClass("clicked", flag)
}

function getLineByRectIDs(id1, id2) {
    let lineID = "";
    Snap.selectAll("g").forEach((lineGroup) => {
        let stuff = [lineGroup.attr("source")].concat(lineGroup.attr("target"))
        let includes1 = stuff.indexOf(id1)
        let includes2 = stuff.indexOf(id2)
        if (includes1 != -1 && includes2 != -1) {
            lineID = lineGroup.attr().id
        }
        // console.log(lineID)
    })
    if (lineID != "") {
        return lineID;
    }


}
function clickRectOutLines(rectID) {
    let clickedRect = Snap.select("#" + rectID).select("rect");
    if (clickedRect.hasClass("clicked")) {
        clickedRect.removeClass("clicked")
    } else {
        clickedRect.addClass("clicked")
    }
    let sourceLineTargets = getRectsFromElements(rectID, "target");
    let sourceLines = getLinesFromElements(rectID, "source");
    switchLineClass(sourceLines, 1, "clicked");
    selectAllOutward(sourceLineTargets)
}

function selectAllOutward(arr) {
    for (let i = 0; i < arr.length; i++) {
        let rectID = arr[i];
        let clickedRect = Snap.select("#" + rectID).select("rect");
        if (clickedRect.hasClass("clicked")) {
            return
        } else {
            clickRectOutLines(rectID);
        }
    }
}

function selectRects(arr, add, classType) {
    arr.forEach((id) => {
        let rect = Snap.select("#" + id).select("rect");
        if (add) {
            rect.toggleClass(classType, !!add);
        } else {
            rect.removeClass("selected-out selected-in selected-all");
        }
    })
}

function selectLines(sourceID, targetIDs) { //source id = id, targetIDs = array
    let lines = Snap.selectAll("g").forEach((group) => {
        if (group.attr("source") == sourceID) {
            group.addClass("selected-out-lines");
        }

    })
}

function buildElementMap(rectElement) {
    let rectElementID = Snap(rectElement).parent().attr().id;
    let targetLines = getLines(rectElementID, "target");
    let sourceLines = getLines(rectElementID, "source");
    let innerText = getInnerText(rectElementID);
    let targets = getLineRectIDs(targetLines, "source");
    let sources = getLineRectIDs(sourceLines, "target");
    let blockObject = {};
    blockObject.id = rectElementID;
    blockObject.targetLines = targetLines;
    blockObject.sourceLines = sourceLines;
    blockObject.text = innerText;
    blockObject.targets = targets;
    blockObject.sources = sources;
    blockObject.clickState = 0;
    blockObject.selectionCount = 0;
    blockObject.highLightState = 0;
    return blockObject;
}

function getHighLightState(id) {
    let state = 0;
    this.elements.find((element) => {
        if (element.id === id) {
            state = element.highLightState;
        }
    })
    return state;
}

function setHighLightState(id, state) {
    this.elements.find((element) => {
        if (element.id === id) {
            if (state > 3) {
                element.highLightState = -1;
            } else {
                element.highLightState = state;
            }
            console.log("HS---> " + element.highLightState)
        }
    })
}

function drawCirclesOnRect(rect) {
    let parentG = rect.parent();
    let id = parentG.attr().id;
    let rectPosX = rect.attr("x");
    let rectPosY = rect.attr("y");
    let xBlue = +rectPosX - 3;
    let yBlue = +rectPosY - 3;
    let countCircleBlue = parentG.circle(xBlue, yBlue, 12).appendTo(parentG);
    countCircleBlue.addClass("circle-out");
    rect.after(countCircleBlue);
    let textBlue = parentG.text(xBlue - 4, yBlue + 6, 0).addClass("circle-out");
    textBlue.attr({ fontWeight: "bold", fill: "black" })
    countCircleBlue.append(textBlue);
    countCircleBlue.click((event) => {
        let nextHighLightState = getHighLightState(id) + 1;
        if (nextHighLightState > 3) {
            nextHighLightState = 0
        }
        // console.log(highLightState);
        setElementsByState(id, nextHighLightState)
        setHighLightState(id, nextHighLightState);

        getAllHighlightedID();
        // console.log(highlighted);
    });
}

function sourceLinesSelected(sourceLines) {
    if (Array.isArray(sourceLines) && sourceLines.length > 0) {
        let firstLineID = sourceLines[0];
        let hasClass = Snap.select("#" + firstLineID).hasClass("selectedLines");
        console.log(sourceLines + " hasClass: " + hasClass)
        return hasClass;
    }
}

function getTargetRect(lineID) {
    console.log(lineID)
    let targetRect = Snap.select("#" + lineID).attr("target");
    console.log(targetRect);
}

function getLineRectIDs(arrayOfLineIDs, attr) {
    let rectIDs = [];
    arrayOfLineIDs.forEach(function (id) {
        let rectID = Snap.select("#" + id).attr(attr);
        rectIDs.push(rectID);
    })
    return rectIDs;
}

function switchLineClass(arrayOfLineIDs, add, classType) {
    arrayOfLineIDs.forEach(function (id) {
        let lineGroupArr = Snap.select("#" + id).selectAll("path");
        if (add) {
            let lineGroupArrClone = lineGroupArr.clone();
            lineGroupArrClone.forEach((path) => {
                path.removeClass("clicked");
                path.addClass("clone");
                path.addClass(classType);
                path.insertBefore(lineGroupArr[0]);

            })
        } else {
            lineGroupArr.forEach((path) => {
                if (path.hasClass("clone")) {
                    path.remove();
                }
            });
        }
    })

}



function getLines(rectID, attr) {
    let result = [];
    Snap.selectAll("g").forEach(function (element) {
        let lineID = element.attr(attr);
        if (lineID == rectID) {
            result.push(element.attr().id);
        }
    })
    return result;
}

function getLinesFromElements(rectID, value) {
    let lines = [];
    this.elements.find((element) => {
        if (element.id === rectID) {
            if (value == "source") {
                lines = element.sourceLines;
            } else {
                lines = element.targetLines;
            }
        }
    })
    return lines;
}
function getRectsFromElements(rectID, type) {
    let arr = [];
    this.elements.find((element) => {
        if (element.id === rectID) {
            if (type == "source") {
                arr = element.sources
            } else if (type == "target") {
                arr = element.targets
            } else {
                arr = element.sources.concat(element.targets);
            }

        }
    })
    // console.log(arr)
    return arr;
}

function selectTargetRect(arrayOfLineIDs, add, classType) {
    arrayOfLineIDs.forEach(function (id) {
        console.log(id)
        let targetRectID = Snap.select("#" + id).attr("target");
        let targetRect = Snap.select("#" + targetRectID).select("rect")
        if (add) {
            addSelectionCount(targetRect, classType);
        } else {
            deductSelectionCount(targetRect, classType);
        }
    })
}

function selectSourceRect(arrayOfLineIDs, add, classType) {
    arrayOfLineIDs.forEach(function (id) {
        console.log(id)
        let sourceRectID = Snap.select("#" + id).attr("source");
        let sourceRect = Snap.select("#" + sourceRectID).select("rect")
        if (add) {
            addSelectionCount(sourceRect, classType);
        } else {
            deductSelectionCount(sourceRect, classType);
        }
    })
}


function switchClass(element, className) {
    let currentCount = parseInt(element.attr("selectionCount"));
    if (Number.isNaN(currentCount)) {
        currentCount = +(element.attr("selectionCount"));
    }
    if (currentCount > 0) {
        element.addClass(className);
    } else {
        element.removeClass(className);
    }
}

function addSelectionCount(element, classType) {
    let currentCount = parseInt(element.attr("selectionCount"));
    element.attr("selectionCount", currentCount + 1);
    let count = +element.attr("selectionCount");
    let rectValue = getRectGID(element);
    switchClass(element, classType);
}

function deductSelectionCount(element, classType) {
    let currentCount = parseInt(element.attr("selectionCount"));
    element.attr("selectionCount", currentCount - 1);
    let count = +element.attr("selectionCount");
    let rectValue = getRectGID(element);
    console.log("rect: " + rectValue + " selected: " + count);
    switchClass(element, classType);
}

function getRectGID(rectElement) {
    return rectElement.parent().attr().id;
}

function getTextDiv(id) {
    return Snap.select("#" + id).select("foreignObject").select("div").select("div").select("div");
}

function getInnerText(rectID) {
    if (rectID != null) {
        return Snap.select("#" + rectID).select("foreignObject").select("div").children("text")[1].node.innerText;

    }
}

function getRectFromG(id) {
    let element = document.getElementById(id)
    if (element) {
        let rect = element.getElementsByTagName("rect")[0];
        return rect;
    }

}

function fixPointerEventsInSVG() {
    let rects = document.getElementsByTagName("rect");
    for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        let pointerEvent = rect.getAttribute("pointer-events");
        if (pointerEvent == "none") {
            rect.setAttribute("pointer-events", "all");
        }
    }

    let divs = document.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let div = divs[i];
        let pointerEventValue = div.style.getPropertyValue("pointer-events");
        if (pointerEventValue == "all") {
            div.style.setProperty("pointer-events", "none");
        }
    }

    const btn4 = document.querySelector(".button4");
    btn4.addEventListener("click", function () {
        let savedRects = loadSelectedRects();
        savedRects.forEach(rectID => {
            clickOnRect(rectID, true);
        });
    });



};


function clearAllSelectedRects() {
    this.selectedRectArray.forEach(rectID => {
        clickOnRect(rectID, true); // Pievienojiet otro parametru, lai norādītu, ka nevajag saglabāt
    });
    this.selectedRectArray = [];
}









