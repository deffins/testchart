var chart = Snap("#chart");
Snap.load("../dm3.svg", onSVGLoaded);

this.elements = [];
this.td = ""
// this.glow = glow();

function onSVGLoaded(data) {
    chart.append(data);


    Snap("#svgchart").drag()
    Snap("#svgchart").mouseover((event) => {
        // let sourceGroupID = Snap(event.srcElement).parent().attr().id;
        // console.log(sourceGroupID);
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
            document.body.style.cursor = "default";
            // let fontAttr1 = { color: "blue", fontWeight: "bold" }
            // let fontAttr2 = { color: "black", fontWeight: "" }
            // let sourceGroupText = getTextDiv(sourceGroupID);
            // if (sourceGroupText) {
            //     sourceGroupText.attr(fontAttr1);
            // } else {

            // }

        } else {
            document.body.style.cursor = "default";
        }
    })

    Snap.selectAll("rect").forEach(function (element) {
        drawCirclesOnRect(element);
        this.elements.push(buildElementMap(element));
        element.attr("selectionCount", 0);
        element.click(function (event) {
            console.log(this.elements);
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            // let sourceLines = getLinesFromElements(sourceGroupID, "source");
            // let targetRects = getRectsFromElements(sourceGroupID);
            // addSelectionCount(clickedRect, classType);
            // selectLines(sourceGroupID, targetRects)
            // if (!clickedRect.hasClass(classType)) {//if not selected before
            //     clickedRect.addClass(classType);
            //     addSelectionCount(clickedRect, classType);
            //     switchLineClass(sourceLines, 1);
            //     selectTargetRect(sourceLines, 1);
            // } else { //selected
            //     let selectionCount = clickedRect.attr("selectionCount")
            //     console.log("clickedRect selectionCount: " + selectionCount);
            //     let linesSelected = sourceLinesSelected(sourceLines);
            //     console.log("are lines selected: " + linesSelected);
            //     switchLineClass(sourceLines, !linesSelected);
            //     selectTargetRect(sourceLines, !linesSelected);
            //     if (sourceLines.length > 0) {
            //         if (linesSelected) {
            //             deductSelectionCount(clickedRect, classType);
            //         } else {
            //             addSelectionCount(clickedRect, classType);
            //         }
            //     } else {
            //         deductSelectionCount(clickedRect, classType);
            //     }
            // }

        });
        element.dblclick(function (event) {
            return
        })
    });


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

        // console.log(blockObject);
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

    function drawCountCircle(rectElement, count, classTye) {
        let parentG = rectElement.parent();

        if (parentG.select(".circle")) {
            if (count < 1) {
                parentG.select(".circle").remove();
                parentG.select(".count").remove();
            } else {
                parentG.select(".count").node.textContent = count;
            }
        } else {
            let rectElementPosX = rectElement.attr("x");
            let rectElementPosY = rectElement.attr("y");
            let x = +rectElementPosX - 5;
            let y = +rectElementPosY - 5;
            var countCircle = Snap().circle(x, y, 12).addClass("circle");
            countCircle.attr({
                // fillOpacity: "0.5",
                fill: "#bada55",
                stroke: "#000",
                strokeWidth: 1
            })
            rectElement.after(countCircle);
            parentG.append(countCircle);
            let text = countCircle.paper.text(x - 4, y + 6, count).addClass("count");
            text.attr({ fontWeight: "bold", fill: "blue" })
            parentG.append(text);
        }
    }

    function drawCirclesOnRect(rect) {

        let parentG = rect.parent();
        let id = parentG.attr().id;

        // setClickState(sourceGroupID, clickState);




        let rectPosX = rect.attr("x");
        let rectPosY = rect.attr("y");
        let xBlue = +rectPosX - 5;
        let yBlue = +rectPosY - 5;
        let xGreen = +rectPosX + 15;
        let yGreen = +rectPosY - 5;
        // let arr = [[xBlue, yBlue], [xGreen, yGreen]]


        let countCircleBlue = Snap().circle(xBlue, yBlue, 12).addClass("circle-out");
        let countCircleGreen = Snap().circle(xGreen, yGreen, 12).addClass("circle-in");

        rect.after(countCircleBlue);
        parentG.append(countCircleBlue);
        let textBlue = countCircleBlue.paper.text(xBlue - 4, yBlue + 6, 0).addClass("circle-out");
        textBlue.attr({ fontWeight: "bold", fill: "black" })
        parentG.append(textBlue);

        countCircleBlue.click(() => {
            let clickState = getClickState(id) + 1;

            console.log(clickState);
            setElementsByState(id, clickState)
            setClickState(id, clickState);
        });

        // rect.after(countCircleGreen);
        // parentG.append(countCircleGreen);
        // let textGreen = countCircleGreen.paper.text(xGreen - 4, yGreen + 6, 0).addClass("circle-in");
        // textGreen.attr({ fontWeight: "bold", fill: "black" })
        // parentG.append(textGreen);

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
        //attr: source or target
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
                console.log("added class to: " + id)
                lineGroupArr.forEach((path) => path.addClass(classType));
            } else {
                // console.log("removed class of line: " + id);
                lineGroupArr.forEach((path) => path.removeClass("selected-out-lines selected-in-lines selected-all-lines"));
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
            // console.log(sourceLines);

        })
        return lines;
    }
    function getRectsFromElements(rectID, type) {
        let arr = [];
        this.elements.find((element) => {
            if (element.id === rectID) {
                if (type == "source") {
                    arr = element.sources
                } else {
                    arr = element.targets
                }

            }
            // console.log(sourceLines);

        })
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
        // console.log("rect: " + rectValue + " selected: " + count);
        switchClass(element, classType);
        drawCountCircle(element, count);
    }

    function deductSelectionCount(element, classType) {
        let currentCount = parseInt(element.attr("selectionCount"));
        element.attr("selectionCount", currentCount - 1);
        let count = +element.attr("selectionCount");
        let rectValue = getRectGID(element);
        console.log("rect: " + rectValue + " selected: " + count);
        switchClass(element, classType);
        drawCountCircle(element, count);
    }

    function getRectGID(rectElement) {
        return rectElement.parent().attr().id;
    }

    function getTextDiv(id) {
        return Snap.select("#" + id).select("foreignObject").select("div").select("div").select("div");
    }

    function getInnerText(rectID) {
        return Snap.select("#" + rectID).select("foreignObject").select("div").children("text")[1].node.innerText;
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










