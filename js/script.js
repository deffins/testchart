
var chart = Snap("#chart");
Snap.load("../dm2.svg", onSVGLoaded);



function onSVGLoaded(data) {
    chart.append(data);





    Snap.selectAll("rect").forEach(function (element) {

        element.click(function (event) {
            let sourceGroupID = Snap(event.srcElement).parent().attr().id;
            console.log(sourceGroupID);

            let clickedRect = Snap.select("#" + sourceGroupID).select("rect");
            if (!clickedRect.hasClass("selected")) {
                clickedRect.addClass("selected");
            } else {
                clickedRect.removeClass("selected");
            }
            let sourceLineGroups = Snap.selectAll("g");
            sourceLineGroups.forEach(function (element) {
                let hasSource = element.attr("source"); //getting all lines from rect
                let hasTarget = element.attr("target"); //getting all ids from rects connected in other end of line
                if ((hasSource) && hasSource == sourceGroupID) {
                    if (!element.hasClass("selectedLines")) {
                        element.addClass("selectedLines");
                    } else {
                        element.removeClass("selectedLines");
                    }

                    let sourceRect = Snap("#" + hasTarget).select("rect");
                    if (!sourceRect.hasClass("selected")) {
                        sourceRect.addClass("selected");
                    } else {
                        sourceRect.removeClass("selected");
                    }

                }
            })

        });
    });

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











