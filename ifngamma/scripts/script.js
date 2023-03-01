function init() {
    wireUpUI();
    svgInit();
}

function wireUpUI() {
    document.querySelector("#btn-reset").addEventListener("click", uiCallback.btnResetClick);
    document.querySelector("#btn-clear").addEventListener("click", uiCallback.btnClearClick);
}

function svgInit() {
    fixPointerEventsInSVG();

    var chartElement = document.querySelector("svg");
    chart = Snap(chartElement);
    chart.zpd();
    
    chart.mouseover((event) => {
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "path") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "circle") {
            document.body.style.cursor = "pointer";
        }
    });

    // Mark model boxes
    document.querySelectorAll("g foreignObject > div").forEach(element => { 
        var associatedRect = element.parentElement.parentElement.parentElement.previousElementSibling;
        var width  = +associatedRect.getAttribute("width");
        var height = +associatedRect.getAttribute("height");
        if (width < 100 || width > 200) return;
        if (height < 40 || height > 80) return;
        associatedRect.classList.add("modelBox");
    });

    // Process model boxes
    document.querySelectorAll(".modelBox").forEach(box => {
        boxLabel(box);
        boxLinesLabel(box);
        boxUiCircleRender(box).addEventListener("click", uiCallback.boxUiCircleClick);

    });

}

function boxLabel(box) {
    let boxId = "box" + (document.querySelectorAll(".modelBox[box-id]").length + 1);
    box.setAttribute("box-id", boxId);
    box.classList.add(boxId);
}

function boxLinesLabel(box) {
    let boxArea = {
        left: +box.getAttribute("x"),
        top: +box.getAttribute("y"),
    }
    boxArea.bottom = boxArea.top + +box.getAttribute("height");
    boxArea.right = boxArea.left + +box.getAttribute("width");

    let boxId = box.getAttribute("box-id");

    let allPaths = document.querySelectorAll("path");
    allPaths.forEach(path => {
        let parts = path.getAttribute("d").split(" ");
        let pathStartPoint = {
            left: +parts[1],
            top: +parts[2],
        }
        
        if (!areaContainsPoint(boxArea, pathStartPoint)) 
            return;
            
        path.classList.add(boxId);
        
        // Categorise paths
        let stroke = path.getAttribute("stroke");
        let dashArray = path.getAttribute("stroke-dasharray");
        
        let pathType = "";
        if (dashArray)
            pathType = "promotes-far";
        else if (stroke == "#000000")
            pathType = "promotes";
        else if (stroke == "#d6b656")
            pathType = "inhibits";

        path.setAttribute("relation-type", pathType);
    });
}

function areaContainsPoint(area, point) {
    if (!(point.left <= area.right)) return false;
    if (!(point.left >= area.left)) return false;
    if (!(point.top >= area.top)) return false;
    if (!(point.top <= area.bottom)) return false;
    return true;
}


function boxUiCircleRender(box) {
    let uiCirclePos = {
        left:   +box.getAttribute("x") - 3,
        top:    +box.getAttribute("y") - 3,
    }
    let boxId = box.getAttribute("box-id");
    let boxParent = box.parentElement;
    let uiCircle = Snap(boxParent).circle(uiCirclePos.left, uiCirclePos.top, 12).node;
    uiCircle.classList.add("circle-out");
    uiCircle.classList.add("box-ui-circle");
    uiCircle.classList.add(boxId);
    uiCircle.setAttribute("for-box-id", boxId);
    box.after(uiCircle);

    return uiCircle;
}

function fixPointerEventsInSVG() {
    let rects = document.querySelectorAll("rect");
    rects.forEach(rect => {
        let pointerEvents = rect.getAttribute("pointer-events");
        if (pointerEvents == "none") {
            rect.setAttribute("pointer-events", "all");
        }
    });

    let divs = document.querySelectorAll("div");
    divs.forEach(div => {
        let pointerEventValue = div.style.getPropertyValue("pointer-events");
        if (pointerEventValue == "all") {
            div.style.setProperty("pointer-events", "none");
        }
    });

};

// |||||||||||||||| UI CALLBACKS ||||||||||||||||||
let uiCallback = {
    btnResetClick: function() {
        uiCallback.btnClearClick();
    },

    btnClearClick: function() {
        document.querySelectorAll("[highlight-state]").forEach(elem => {
            elem.removeAttribute("highlight-state");
        });
    },

    boxUiCircleClick: function() {
        let boxUiCircle = this;
        let boxId = boxUiCircle.getAttribute("for-box-id");
        let box = document.querySelector(".modelBox." + boxId);
        let boxLines = document.querySelectorAll("path." + boxId);
        let highlightState = box.getAttribute("highlight-state") || "";

        highlightState = {
            "x":     "all",
            "":     "out",
            "out":  "in",
            "in":   "all",
            "all":  "",
        }[highlightState];

        box.setAttribute("highlight-state", highlightState);
        boxLines.forEach(line => {
            line.setAttribute("highlight-state", highlightState);
        });
    },
}

init();