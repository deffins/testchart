
var s = Snap();
Snap.load("../chronic-thc-chart.svg", onSVGLoaded);

function onSVGLoaded(data) {
    s.append(data);
    console.log(data);
    console.log(s);

    data.select('#thc-abuse').attr({
        stroke: "#263a1b",
        strokeWidth: 6,
    });

    this.rectArr = Snap(s.select('#thc-abuse'));
    console.log(this.rectArr);
}







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
