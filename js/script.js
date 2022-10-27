// vajag iezīmēto target rect apstrādāt lai līnijas izejošās nostrādā kā vajag
var chart = Snap("#chart");
Snap.load("../dm2.svg", onSVGLoaded);

function onSVGLoaded(data) {
    chart.append(data);

    Snap.selectAll("rect").forEach(function (element) {
        element.attr("selectionCount", 0);
        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            console.log(sourceGroupID);
            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            let sourceLines = getSourceLines(sourceGroupID);
            if (!clickedRect.hasClass("selected")) {//if not selected before
                clickedRect.addClass("selected");

                switchLineClass(sourceLines, 1);
                selectTargetRect(sourceLines, 1)
                // addSelectionCount(clickedRect); //count 1 selection
            } else {
                if (clickedRect.attr("selectionCount") < 1) {
                    clickedRect.removeClass("selected");
                    switchLineClass(sourceLines, 0);
                    selectTargetRect(sourceLines, 0)

                    // deductSelectionCount(clickedRect);
                }
            }

            // let fontAttr = { color: "blue", fontWeight: "bold" }
            // let sourceGroupText = getTextDiv(sourceGroupID);
            // if (sourceGroupText) {
            //     sourceGroupText.attr(fontAttr);
            // }

        });
    });

    function getTargetRect(lineID) {
        console.log(lineID)
        let targetRect = Snap.select("#" + lineID).attr("target");
        console.log(targetRect);
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

    function getSourceLines(sourceRectID) {
        let result = [];
        Snap.selectAll("g").forEach(function (element) {
            let sourceLineID = element.attr("source");
            // let targetRectID = element.attr("target");
            if (sourceLineID == sourceRectID) {
                // getTargetRect(sourceLineID);
                // console.log(element.attr().id)
                result.push(element.attr().id);
            }
        })
        return result;
    }

    function getTargetLines(sourceRectID) {
        let result = [];
        Snap.selectAll("g").forEach(function (element) {
            let targetLineID = element.attr("target");
            if (targetLineID == sourceRectID) {
                result.push(element.attr().id);
            }
        })
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












