// let chart = document.getElementById("stuff")

// console.log(chart)

// window.addEventListener("mouseup", (e) => {
//     // Let's pick a random color between #000000 and #FFFFFF
//     const color = Math.round(Math.random() * 0xffffff);
//     let paths = e
//     console.log(paths);

//     // Let's format the color to fit CSS requirements
//     const fill = `#${color.toString(16).padStart(6, "0")}`;

//     // Let's apply our color in the
//     // element we actually clicked on
//     e.target.style.fill = fill;
// });

var chart = Snap("#chart");
console.log(chart);

Snap.load("../chronic-tch-chart.svg", onSVGLoaded);

function onSVGLoaded(svg) {
    chart.append(svg);
}

// window.addEventListener("mouseup", (e) => {
//     if (e.srcElement.nodeName == "svg") {
//         console.log(e.nodeName);
//         return
//     }
//     // if (e.path[0].tagName == "path")
//     if (e.target.style.stroke != null) {
//         if (e.target.style.stroke == "blue") {
//             e.target.style.stroke = "";
//             // e.target.style.fill = "";
//         } else {
//             e.target.style.stroke = "blue";
//             if (e.target.style.fill != null) {
//                 // e.target.style.fill = "lightblue";
//             }


//         }
//     } else {
//         // console.log(e)
//     }
// });

// window.addEventListener("mouseover", (e) => {
//     if (e.path[0].tagName == "path") {
//         e.path[0].style.strokeWidth = 6;
//         // console.log(e.path[0].style.strokeWidth);
//     }

// });

// window.addEventListener("mouseout", (e) => {
//     if (e.path[0].tagName == "path") {
//         console.log(e.path[0].style.strokeWidth)
//         if (e.path[0].style.strokeWidth > 5) {
//             e.path[0].style.strokeWidth = 3;

//         }
//     }

// });



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
