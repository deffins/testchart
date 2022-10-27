
var chart = Snap("#chart");
Snap.load("../dm2.svg", onSVGLoaded);





function onSVGLoaded(data) {
    chart.append(data);

    Snap.selectAll("rect").forEach(function (element) {
        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            console.log(sourceGroupID);
            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            if (!clickedRect.hasClass("selected")) {//if not selected before
                // clickedRect.addClass("selected");
                addSelectionCount(clickedRect); //count 1 selection
            } else {
                if (clickedRect.attr("selectionCount") > 0) {
                    deductSelectionCount(clickedRect);

                } else {
                    // clickedRect.removeClass("selected");

                }
            }

            let sourceLineGroups = Snap.selectAll("g");
            sourceLineGroups.forEach(function (element) {
                let sourceRectID = element.attr("source"); //getting all lines from rect
                let targetRectID = element.attr("target"); //getting all ids from rects connected in other end of line
                if ((sourceRectID) && sourceRectID == sourceGroupID) {
                    if (!element.hasClass("selectedLines")) {
                        element.addClass("selectedLines");
                    } else {
                        element.removeClass("selectedLines");
                    }

                    let targetRect = Snap("#" + targetRectID).select("rect");
                    if (clickedRect.hasClass("selected")) {
                        addSelectionCount(targetRect);

                        // targetRect.addClass("selected");


                    } else {
                        deductSelectionCount(targetRect);


                        // if (targetRect.attr("selectionCount") > 0) {

                        // } else {
                        //     deductSelectionCount(targetRect);
                        //     // targetRect.removeClass("selected");

                        // }
                    }

                }
            })
            let fontAttr = { color: "blue", fontWeight: "bold" }
            let sourceGroupText = getTextDiv(sourceGroupID);
            if (sourceGroupText) {
                sourceGroupText.attr(fontAttr);
            }

        });
    });

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











