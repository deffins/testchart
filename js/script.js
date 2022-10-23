
var s = Snap();
Snap.load("../dm.svg", onSVGLoaded);

function onSVGLoaded(data) {
    s.append(data);
    // console.log(data);
    // console.log(s);

    // let rect = Snap(s.select('#chronic-thc'));
    // // let rect2 = Snap(s.select('#BIeTZq3KbKyFNtU_o8Uz-20'));
    // console.log(rect);
    // let groups = rect.selectAll('path');
    // console.log(groups);

    // let rectArr = Snap(s.selectAll('rect'));
    // let rectArr2 = Snap(s.selectAll('#g'));
    // // let rect2 = Snap(s.select('#BIeTZq3KbKyFNtU_o8Uz-20'));
    // console.log(rectArr);
    // console.log(rectArr2);


    Snap.selectAll("rect").forEach(function (element) {

        element.click(function (event) {
            console.log(Snap(event.srcElement).parent().attr().id)
            // console.log(arguments)
            // console.log(event)
            if (!event.srcElement.classList.contains("selected")) {
                Snap(event.srcElement).attr("fill", "lightblue");
                Snap(event.srcElement).attr("strokeWidth", "3");
                Snap(event.srcElement).addClass("selected");
            } else {
                Snap(event.srcElement).attr("fill", "none");
                Snap(event.srcElement).attr("strokeWidth", "1");
                Snap(event.srcElement).removeClass("selected");
            }
        });
    });

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

/////////







// let rects = document.getElementsByTagName("rect");
// for (let i = 0; i < rects.length; i++) {
//     let rect = rects[i];
//     let pointerEvent = rect.getAttribute("pointer-events");
//     if (pointerEvent == "none") {
//         rect.setAttribute("pointer-events", "all");
//     }

//     // console.log(pointerEvent);
// }
// // sets "pointer-events" to "none" for all text nodes so rects can be clicked and highlighted
// let divs = document.getElementsByTagName("div");
// for (let i = 0; i < divs.length; i++) {
//     let div = divs[i];
//     // let text = div.outerText;
//     let pointerEvent = div.style.item(5);
//     let pointerEventValue = div.style.getPropertyValue("pointer-events");
//     // console.log("pointerEvent: " + pointerEventValue);
//     if (pointerEventValue == "all") {
//         div.style.setProperty("pointer-events", "none");
//     }


//     // console.log(text);
// }


// let paths = document.getElementsByTagName("path");
// for (let i = 0; i < paths.length; i++) {
//     let path = paths[i];
//     // let pointerEvent = path.item(5);
//     let fillType = path.getAttribute("fill");

//     let pointerEventValue = path.getAttribute("pointer-events");
//     // console.log("pointerEvent: " + pointerEventValue);
//     if (pointerEventValue == "none" && fillType == "none") {
//         path.setAttribute("pointer-events", "stroke");
//     }


//     console.log(fillType);
// }

// window.addEventListener("mouseup", (e) => {

//     // console.log(e.path[0].tagName);
//     console.log(e);
//     // e.path.forEach(element => console.log(element.tagName))

// });
