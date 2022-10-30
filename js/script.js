var chart = Snap("#chart");
Snap.load("../dm2.svg", onSVGLoaded);

function onSVGLoaded(data) {
    chart.append(data);

    Snap("#svgchart").drag()
    Snap("#svgchart").mouseover((event) => {
        // console.log(event.target.nodeName);
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else {
            document.body.style.cursor = "default";

        }
    })

    Snap.selectAll("rect").forEach(function (element) {
        element.attr("selectionCount", 0);
        // getInnerText(Snap(element).parent().attr().id);
        // console.log(getInnerText(Snap(element).parent().attr().id))
        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;

            buildElementMap(element);
            console.log("sourceRectID: " + sourceGroupID);
            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            let sourceLines = getLines(sourceGroupID, "source");
            if (!clickedRect.hasClass("selected")) {//if not selected before
                clickedRect.addClass("selected");
                addSelectionCount(clickedRect);
                switchLineClass(sourceLines, 1);
                selectTargetRect(sourceLines, 1);
                drawCountCircle(clickedRect);
                // addSelectionCount(clickedRect); //count 1 selection
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

            // let fontAttr = { color: "blue", fontWeight: "bold" }
            // let sourceGroupText = getTextDiv(sourceGroupID);
            // if (sourceGroupText) {
            //     sourceGroupText.attr(fontAttr);
            // }

        });
        element.dblclick(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;

            console.log(event)
            let
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


        console.log(blockObject);
        return blockObject;
    }

    function drawCountCircle(rectElement) {
        let rectElementPosX = rectElement.attr("x")
        let rectElementPosY = rectElement.attr("y")
        console.log(rectElementPosX, rectElementPosY)
        var bigCircle = Snap().circle(0, 0, 100);


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
        if (Number.isNaN(currentCount)) {
            element.attr("selectionCount", "0");
            currentCount = +(element.attr("selectionCount"));
        }
        element.attr("selectionCount", currentCount + 1);
        let rectValue = getRectElementValue(element);
        console.log("rect: " + rectValue + " selected: " + element.attr("selectionCount"));
        switchClass(element, "selected");

    }
    function deductSelectionCount(element) {
        let currentCount = parseInt(element.attr("selectionCount"));

        element.attr("selectionCount", currentCount - 1);
        let rectValue = getRectElementValue(element);
        console.log("rect: " + rectValue + " selected: " + element.attr("selectionCount"));
        switchClass(element, "selected");
    }

    function getRectElementValue(rectElement) {
        return rectElement.parent().attr().value;
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












