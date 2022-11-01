var chart = Snap("#chart");
Snap.load("../dm3.svg", onSVGLoaded);

this.elements = [];

function onSVGLoaded(data) {
    chart.append(data);

    Snap("#svgchart").drag()
    Snap("#svgchart").mouseover((event) => {
        let sourceGroupID = Snap(event.srcElement).parent().attr().id;
        console.log(sourceGroupID);
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
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
        this.elements.push(buildElementMap(element));

        element.attr("selectionCount", 0);
        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            console.log("sourceRectID: " + sourceGroupID);
            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            let sourceLines = getLines(sourceGroupID, "source");
            if (!clickedRect.hasClass("selected")) {//if not selected before
                clickedRect.addClass("selected");
                addSelectionCount(clickedRect);
                switchLineClass(sourceLines, 1);
                selectTargetRect(sourceLines, 1);
            } else { //selected
                let selectionCount = clickedRect.attr("selectionCount")
                console.log("clickedRect selectionCount: " + selectionCount);
                let linesSelected = sourceLinesSelected(sourceLines);
                console.log("are lines selected: " + linesSelected);
                switchLineClass(sourceLines, !linesSelected);
                selectTargetRect(sourceLines, !linesSelected);
                if (sourceLines.length > 0) {
                    if (linesSelected) {
                        deductSelectionCount(clickedRect);
                    } else {
                        addSelectionCount(clickedRect);
                    }
                } else {
                    deductSelectionCount(clickedRect);
                }
            }



        });
        element.dblclick(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            console.log(event)

        })
    });

    function makeShitGlow() {

    }

    function buildElementMap(rectElement) {
        let rectElementID = Snap(rectElement).parent().attr().id;
        let targetLines = getLines(rectElementID, "target");
        let sourceLines = getLines(rectElementID, "source");
        let innerText = getInnerText(rectElementID);
        let targets = getLineRectIDs(targetLines, "target");
        let sources = getLineRectIDs(sourceLines, "source");
        let blockObject = {};
        blockObject.id = rectElementID;
        blockObject.targetLines = targetLines;
        blockObject.sourceLines = sourceLines;
        blockObject.text = innerText;
        blockObject.targets = targets;
        blockObject.sources = sources;
        blockObject.selected = false;
        blockObject.selectionCount = 0;

        // console.log(blockObject);
        return blockObject;
    }

    function drawCountCircle(rectElement, count) {
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
        } else return false;

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

    function switchLineClass(arrayOfLineIDs, add) {
        arrayOfLineIDs.forEach(function (id) {
            if (add) {
                Snap.select("#" + id).addClass("selectedLines");
            } else {
                Snap.select("#" + id).removeClass("selectedLines");
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
        // console.log(result)
        return result;
    }

    function selectTargetRect(arrayOfLineIDs, add) {
        arrayOfLineIDs.forEach(function (id) {
            let targetRectID = Snap.select("#" + id).attr("target");
            let targetRect = Snap.select("#" + targetRectID).select("rect")
            if (add) {
                addSelectionCount(targetRect);
            } else {
                deductSelectionCount(targetRect);
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

    function addSelectionCount(element) {
        let currentCount = parseInt(element.attr("selectionCount"));
        element.attr("selectionCount", currentCount + 1);
        let count = +element.attr("selectionCount");
        let rectValue = getRectElementValue(element);
        // console.log("rect: " + rectValue + " selected: " + count);
        switchClass(element, "selected");
        drawCountCircle(element, count);
    }

    function deductSelectionCount(element) {
        let currentCount = parseInt(element.attr("selectionCount"));
        element.attr("selectionCount", currentCount - 1);
        let count = +element.attr("selectionCount");
        let rectValue = getRectElementValue(element);
        // console.log("rect: " + rectValue + " selected: " + count);
        switchClass(element, "selected");
        drawCountCircle(element, count);
    }

    function getRectElementValue(rectElement) {
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












