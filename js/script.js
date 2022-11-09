var chart = Snap("#chart");

let thcChart = "../chronic-thc-chart.svg";
let dmChart = "../dm3.svg";

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


const btn2 = document.querySelector(".button2");;
btn2.addEventListener("click", loadSVG)

const btn1 = document.querySelector(".button1");
btn1.addEventListener("click", function () {
})


this.elements = [];
this.td = "";
this.selectedRectArray = [];

function onSVGLoaded(data) {
    chart.append(data);
    // console.log(chart.select("svg").attr().id)

    let chartType = chart.select("svg").attr().id;
    Snap("#" + chartType).drag()
    Snap("#" + chartType).mouseover((event) => {
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "path") {
            // console.log(Snap(event.srcElement).parent().attr().id)
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

    function connectClickedRects() {



        // console.log(selectedRectArray);
        for (let i = 0; i < this.selectedRectArray.length; i++) {
            let rect = selectedRectArray[i];
            rectID = rect.parent().attr().id;
            let relatedRectIDs = getRectsFromElements(rectID, "source");
            let index = relatedRectIDs.indexOf(sourceGroupID)
            if (index != -1) {
                let targetRectID = relatedRectIDs[index];
                console.log(index);
                let line = getLineByRectIDs(sourceGroupID, targetRectID);
                if (line) {
                    line.addClass("selected-in-lines");
                } else {
                    console.log("no result");
                }
            }
        }
    }

    function clickOnRect(rectID) {
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
                console.log(element)
                console.log(this.selectedRectArray)
                processRect(element);
            }


        })
        connectClickedRects()

    }

    function processRect(element) {
        let rect = Snap.select("#" + element.id).select("rect");
        let flag = element.clickState;
        rect.toggleClass("clicked", flag)

    }

    function getLineByRectIDs(id1, id2) {
        Snap.selectAll("g").forEach((lineGroup) => {
            if (lineGroup.attr("source")) {
                let stuff = [lineGroup.attr("source")].concat(lineGroup.attr("target"))
                let includes1 = stuff.indexOf(id1)
                let includes2 = stuff.indexOf(id2)
                if (includes1 != -1 && includes2 != -1) {
                    let lineID = lineGroup.attr().id
                    return lineID;
                }

            }
        })
    }
    function clickRectOutLines(rectID) {
        let clickedRect = Snap.select("#" + rectID).select("rect");
        if (clickedRect.hasClass("clicked")) {
            clickedRect.removeClass("clicked")
        } else {
            clickedRect.addClass("clicked")
        }
        let sourceLineTargets = getRectsFromElements(rectID, "target");
        // selectRects(sourceLineTargets, 1, "clicked");
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
            switchLineClass(tagetLines, 1, "selected-in-lines");
            switchLineClass(sourceLines, 0);
            selectRects(sourceLineTargets, 0);
            selectRects(targetLineTargets, 1, "selected-in");
        } else if (state == 3) {
            sourceRect.addClass("selected-all");
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

    function connectRects(rectIDArray) {

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

    /*
        function testDiagram() {
            let array = this.elements;
            let string = ""
            for (let i = 0; i < 20; i++) {
                let elementData = array[i];
                let slicedText1 = elementData.text.slice(0, 16).trim();
                for (let j = 0; j < elementData.sources.length; j++) {
                    let sourceID = elementData.sources[j]
                    let sourceText = getInnerText(sourceID)
                    let slicedText2 = sourceText.slice(0, 16).trim();
                    string = string.concat("[", slicedText1, "]->[", slicedText2, "]","\n")
                }
    
            }
            console.log(string)
        }
        */

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
        return blockObject;
    }

    function getClickState(id) {
        let state = 0;
        this.elements.find((element) => {
            if (element.id === id) {
                state = element.clickState;
            }
        })
        return state;
    }

    function setClickState(id, state) {
        this.elements.find((element) => {
            if (element.id === id) {
                if (state > 2) {
                    element.clickState = -1;
                } else {
                    element.clickState = state;
                }
            }
        })
    }

    // function drawCountCircle(rectElement, count, classTye) {
    //     let parentG = rectElement.parent();
    //     if (parentG.select(".circle")) {
    //         if (count < 1) {
    //             parentG.select(".circle").remove();
    //             parentG.select(".count").remove();
    //         } else {
    //             parentG.select(".count").node.textContent = count;
    //         }
    //     } else {
    //         let rectElementPosX = rectElement.attr("x");
    //         let rectElementPosY = rectElement.attr("y");
    //         let x = +rectElementPosX - 5;
    //         let y = +rectElementPosY - 5;
    //         var countCircle = Snap().circle(x, y, 12).addClass("circle");
    //         countCircle.attr({
    //             // fillOpacity: "0.5",
    //             fill: "#bada55",
    //             stroke: "#000",
    //             strokeWidth: 1
    //         })
    //         rectElement.after(countCircle);
    //         parentG.append(countCircle);
    //         let text = countCircle.paper.text(x - 4, y + 6, count).addClass("count");
    //         text.attr({ fontWeight: "bold", fill: "blue" })
    //         parentG.append(text);
    //     }
    // }

    function drawCirclesOnRect(rect) {
        let parentG = rect.parent();
        let id = parentG.attr().id;
        let rectPosX = rect.attr("x");
        let rectPosY = rect.attr("y");
        let xBlue = +rectPosX - 5;
        let yBlue = +rectPosY - 5;
        let xGreen = +rectPosX + 15;
        let yGreen = +rectPosY - 5;
        // let countCircleBlue = Snap().circle(xBlue, yBlue, 12).addClass("circle-out");

        let countCircleBlue = parentG.circle(xBlue, yBlue, 12).appendTo(parentG);

        // let countCircleGreen = Snap().circle(xGreen, yGreen, 12).addClass("circle-in");
        rect.after(countCircleBlue);

        let textBlue = parentG.text(xBlue - 4, yBlue + 6, 0).addClass("circle-out");
        textBlue.attr({ fontWeight: "bold", fill: "black" })
        // parentG.append(countCircleBlue);
        countCircleBlue.append(textBlue);
        countCircleBlue.click((event) => {
            let clickState = getClickState(id) + 1;
            console.log(clickState);
            setElementsByState(id, clickState)
            setClickState(id, clickState);
        });

    }

    function removeCountCircle(rect) {
        rect.parent().select(".circle").remove();
        rect.parent().select(".count").remove();
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
    //bug here - need to check for multiple clones on each line
    function switchLineClass(arrayOfLineIDs, add, classType) {
        arrayOfLineIDs.forEach(function (id) {
            let lineGroupArr = Snap.select("#" + id).selectAll("path");
            if (add) {
                let lineGroupArrClone = lineGroupArr.clone();
                lineGroupArrClone.forEach((path) => {
                    path.addClass("clone");
                    path.addClass(classType);
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
        // drawCountCircle(element, count);
    }

    function deductSelectionCount(element, classType) {
        let currentCount = parseInt(element.attr("selectionCount"));
        element.attr("selectionCount", currentCount - 1);
        let count = +element.attr("selectionCount");
        let rectValue = getRectGID(element);
        console.log("rect: " + rectValue + " selected: " + count);
        switchClass(element, classType);
        // drawCountCircle(element, count);
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




}

function glow(id) {
    Snap.select("#" + id).addClass("glow")

}










