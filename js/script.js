
var s = Snap();
Snap.load("../dm2.svg", onSVGLoaded);

function onSVGLoaded(data) {
    s.append(data);



    Snap.selectAll("rect").forEach(function (element) {

        element.click(function (event) {
            let sourceRectID = Snap(event.srcElement).parent().attr().id;
            // console.log(sourceRectID);

            //Snap.select("#Lp-_7fw3k4eCupaw-q1m-23").select("rect").attr("fill", "blue")


            let sourceLineGroups = Snap.selectAll("g")

            sourceLineGroups.forEach(function (element) {

                let hasSource = element.attr("source");
                let hasTarget = element.attr("target");
                if ((hasSource) && hasSource == sourceRectID) {

                    element.attr();
                    element.attr("strokeWidth", "3")
                    element.attr("stroke", "blue")
                    let hasTarget = element.attr("target");
                    if (hasTarget) {
                        console.log(hasTarget)
                    }
                    sourceLineGroups.forEach(function (element) {
                        let targetRectID = element.attr("id")
                        if (targetRectID == hasTarget) {
                            let rect = getRectFromG(hasTarget)
                            Snap(rect).attr("fill", "lightblue");
                            element.attr("strokeWidth", "3");
                        }
                    })
                }
            })
            if (!event.srcElement.classList.contains("selected")) {
                Snap()
                Snap(event.srcElement).attr("fill", "lightblue");
                Snap(event.srcElement).attr("strokeWidth", "3");
                Snap(event.srcElement).addClass("selected");
                // Snap(event.srcElement).attr("strokeWidth", "3");
            } else {
                Snap(event.srcElement).attr("fill", "none");
                Snap(event.srcElement).attr("strokeWidth", "1");
                Snap(event.srcElement).removeClass("selected");
            }
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











